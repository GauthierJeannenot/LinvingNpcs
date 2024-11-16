import { useEffect, useState } from 'react';
import { AzureSpeechSynthesis } from '@/lib/api/azureSpeech';
import { askChatGpt, transcribeAudioBase64 } from '@/lib/api/chatGpt'; // Assurez-vous que transcribeAudioBase64 existe
import Npc from '@/lib/types/Npc';
import { Message, Messages } from '@/lib/types/Messages';

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
    setIsFetching(true);
    try {
      const textResponse = await askChatGpt(npc, [...messages, newMessage]);
      if (!textResponse) throw new Error("Couldn't get chatgpt response");

      const base64AudioResponse = await AzureSpeechSynthesis(
        textResponse.content,
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

    setListening(true);
    const audioChunks: Blob[] = [];

    mediaRecorder.start();
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      setListening(false);
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Data = reader.result?.toString().split(',')[1];
        if (base64Data) {
          try {
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

    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
  };

  return {
    messages,
    isFetching,
    startListening,
    listening,
  };
};
