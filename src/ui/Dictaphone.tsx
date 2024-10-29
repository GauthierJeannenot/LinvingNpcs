'use client'
import 'regenerator-runtime/runtime' 
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Npc from '@/lib/types/Npc';
import { askChatGpt } from '@/lib/api/chatGpt';
import { AzureSpeechSynthesis } from '@/lib/api/azureSpeech';
import { useEffect, useState } from 'react';
import MicIcon from '@mui/icons-material/Mic'; // For microphone icon
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const Dictaphone = ({ npc }: {npc: Npc}) => {
  const {
    finalTranscript,
    transcript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const getResponse = async() => {
      setIsFetching(true)
      const textResponse = await askChatGpt(npc, transcript)
      if (!textResponse) throw new Error("couldn't get chatgpt response")
      const base64AudioResponse = await AzureSpeechSynthesis(textResponse)
      if(!base64AudioResponse) throw new Error("couldn't get audio response")
      console.log(base64AudioResponse)
      const audio = new Audio(base64AudioResponse)
      audio.play().finally(() => setIsFetching(false))
      
    }

    if (finalTranscript.length !== 0) {
      getResponse()
    }
  }, [finalTranscript, npc, transcript])
  




  return (
    <div className='text-center'>
        {isFetching ? <p>Loading ...</p> : <button disabled={isFetching} onClick={() => SpeechRecognition.startListening()}>{listening ? <FiberManualRecordIcon /> : <MicIcon />}</button> }
    </div>
  );
};
export default Dictaphone;