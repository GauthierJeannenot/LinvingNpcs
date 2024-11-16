'use server';

export const getAzureSpeechSynthesis = async (
  text: string,
  voice: { name: string; rate: string; pitch: string; style: string },
) => {
  try {
    const ssmlData = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
            <voice name="${voice.name}">
            <prosody rate="${voice.rate}" pitch="${voice.pitch}">
              <mstts:express-as style="${voice.style}"> 
                ${text}
              </mstts:express-as>
               </prosody>
            </voice>
          </speak>`;

    const audioResponse = await fetch(
      'https://francecentral.tts.speech.microsoft.com/cognitiveservices/v1',
      {
        method: 'POST',
        headers: {
          'X-Microsoft-OutputFormat': 'audio-48khz-192kbitrate-mono-mp3',
          'Content-Type': 'application/ssml+xml',
          'Ocp-Apim-Subscription-Key': `${process.env.AZURE_SPEECH_API_KEY}`,
          'User-Agent': 'LinvingNpcs',
        },
        body: ssmlData,
      },
    );
    const arrayBuffer = await audioResponse.arrayBuffer();
    const audioBase64 = await Buffer.from(arrayBuffer).toString('base64');
    return `data:audio/mp3;base64,${audioBase64}`;
  } catch (error) {
    console.error(error);
  }
};
