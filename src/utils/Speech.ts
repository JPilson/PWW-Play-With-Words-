
import textToSpeech from "@google-cloud/text-to-speech"
import fs from "fs"
import util from "util"
import {google} from "@google-cloud/text-to-speech/build/protos/protos";
import ISynthesizeSpeechRequest = google.cloud.texttospeech.v1.ISynthesizeSpeechRequest;

// Import other required libraries

// Creates a client
export default  class Speech {

    static  async  quickStart():Promise<void> {
        const client = new textToSpeech.TextToSpeechClient();
        // The text to synthesize
        const text = 'hello, world!';

        // Construct the request
        const request:ISynthesizeSpeechRequest = {
            input: {text: text},
            // Select the language and SSML voice gender (optional)
            voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
            // select the type of audio encoding
            audioConfig: {audioEncoding: 'MP3'},
        };

        // Performs the text-to-speech request
        const response:any = await client.synthesizeSpeech(request);
        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);
        await writeFile('output.mp3', response.audioContent, 'binary');
        console.log('Audio content written to file: output.mp3');
    }
}
