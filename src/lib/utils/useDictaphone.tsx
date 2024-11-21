import { useEffect, useState } from 'react';
import { getAzureSpeechSynthesis } from '@/lib/api/azureSpeech';
import { askChatGpt, transcribeAudioBase64 } from '@/lib/api/chatGpt';
import Npc from '@/lib/types/Npc';
import { Message, Messages } from '@/lib/types/Messages';
import Meyda from 'meyda';

export const useDictaphone = (npc: Npc) => {
  const [messages, setMessages] = useState<Messages>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [listening, setListening] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );

  useEffect(() => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
        })
        .catch((error) => {
          console.error("Erreur lors de l'accès au microphone:", error);
        });
    }
  }, []);

  const getResponse = async (newMessage: Message) => {
    if (newMessage.content.length === 0 || isFetching) return;

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    try {
      const textResponse = await askChatGpt(npc, [...messages, newMessage]);
      if (!textResponse) throw new Error("Couldn't get chatgpt response");

      const base64AudioResponse = await getAzureSpeechSynthesis(
        textResponse.content,
        npc.voice,
      );
      if (!base64AudioResponse) throw new Error("Couldn't get audio response");

      const audio = new Audio(base64AudioResponse);
      audio.play();

      setMessages((prevMessages) => [...prevMessages, textResponse]);
      setIsFetching(false);
    } catch (error) {
      console.error('Error:', error);
      setIsFetching(false);
    }
  };

  const startListening = () => {
    if (!mediaRecorder) {
      console.warn('MediaRecorder not available');
      return;
    }

    if (listening) {
      console.warn("L'enregistrement est déjà en cours");
      return;
    }

    setListening(true);
    const audioChunks: Blob[] = [];
    let silenceCounter = 0;
    const maxSilenceCount = 200;

    mediaRecorder.start();
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    const audioContext = new window.AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(
      mediaRecorder.stream,
    );

    // Création d'un filtre passe-bande
    const bandPassFilter = audioContext.createBiquadFilter();
    bandPassFilter.type = 'bandpass';
    bandPassFilter.frequency.value = 200;
    bandPassFilter.Q.setValueAtTime(1, audioContext.currentTime);

    mediaStreamSource.connect(bandPassFilter);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    bandPassFilter.connect(analyser);

    const canvas = document.getElementById('spectrum') as HTMLCanvasElement;
    const canvasCtx = canvas?.getContext('2d');
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      if (!listening) return;

      analyser.getByteFrequencyData(dataArray);

      if (canvasCtx) {
        canvasCtx.fillStyle = 'black';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / dataArray.length) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          barHeight = dataArray[i] / 2;

          canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
          canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    const meydaAnalyzer = Meyda.createMeydaAnalyzer({
      audioContext,
      source: bandPassFilter,
      bufferSize: 512,
      featureExtractors: ['rms'],
      callback: (features: { rms: number }) => {
        const { rms } = features;

        if (rms < 0.01) {
          silenceCounter++;
          if (silenceCounter >= maxSilenceCount) {
            console.log(
              "Arrêt de l'enregistrement après seuil de silence atteint",
            );
            stopListening();
          }
        } else {
          silenceCounter = 0;
        }
      },
    });

    meydaAnalyzer.start();

    mediaRecorder.onstop = async () => {
      setListening(false);
      meydaAnalyzer.stop();
      mediaStreamSource.disconnect();
      bandPassFilter.disconnect();
      audioContext.close();

      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Data = reader.result?.toString().split(',')[1];
        if (base64Data) {
          try {
            setIsFetching(true);
            const transcription = await transcribeAudioBase64(base64Data);
            if (transcription) {
              const newMessage: Message = {
                role: 'user',
                content: transcription,
              };
              getResponse(newMessage);
            }
          } catch (error) {
            console.error('Error transcribing audio:', error);
          }
        }
      };
      reader.readAsDataURL(audioBlob);
    };
  };

  const stopListening = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    } else {
      console.warn('Aucun enregistrement en cours');
    }
    setListening(false);
  };

  return {
    messages,
    isFetching,
    startListening,
    stopListening,
    listening,
  };
};
