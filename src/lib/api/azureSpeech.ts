'use server';

export const AzureSpeechSynthesis = async (text: string) => {
  try {
    const ssmlData = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
            <voice name="fr-FR-RemyMultilingualNeural"> <!-- Remplace la voix ici -->
              <mstts:express-as style="angry"> 
                ${text}
              </mstts:express-as>
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
          'User-Agent': 'LinvingNpcs', // Replace with your app name
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
