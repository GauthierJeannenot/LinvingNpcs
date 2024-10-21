'use client'
import 'regenerator-runtime/runtime' 
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Npc from '@/lib/types/Npc';
import { askChatGpt } from '@/lib/api/chatGpt';
import { useEffect } from 'react';

const Dictaphone = ({ npc }: {npc: Npc}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // if (!browserSupportsSpeechRecognition) {
  //   return <span>Browser doesn't support speech recognition.</span>;
  // }

  
  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <button onClick={() => askChatGpt(npc, transcript)}>askChatGpt</button>
      <p>{transcript}</p>
    </div>
  );
};
export default Dictaphone;