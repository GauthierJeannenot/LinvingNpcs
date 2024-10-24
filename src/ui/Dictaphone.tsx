'use client'
import 'regenerator-runtime/runtime' 
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Npc from '@/lib/types/Npc';
import { askChatGpt } from '@/lib/api/chatGpt';
import { AzureSpeechSynthesis } from '@/lib/api/azureSpeech';

const Dictaphone = ({ npc }: {npc: Npc}) => {
  const {
    transcript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  const getResponse = async() => {
    const textResponse = await askChatGpt(npc, transcript)
    if (!textResponse) throw new Error("couldn't get chatgpt response")
    const base64AudioResponse = await AzureSpeechSynthesis(textResponse)
    if(!base64AudioResponse) throw new Error("couldn't get audio response")
    console.log(base64AudioResponse)
    const audio = new Audio(base64AudioResponse)
    audio.play().catch(error => console.log(error))
  }


  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={() => SpeechRecognition.startListening()}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <button onClick={() => getResponse()}>askChatGpt</button>
      <p>{transcript}</p>
    </div>
  );
};
export default Dictaphone;