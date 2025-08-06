const { GoogleAuth } = require('google-auth-library');

(async () => {
  try {
    const rawJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const cleanedJson = rawJson.replace(/\\n/g, '\n');
    const credentials = JSON.parse(cleanedJson);

    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const client = await auth.getClient();

    const config = {
      encoding: 'FLAC',
      sampleRateHertz: 16000,
      languageCode: 'en-US'
    };

    const audio = {
      content: '' // Empty base64 string for test
    };

    const { data } = await client.request({
      url: 'https://speech.googleapis.com/v1/speech:recognize',
      method: 'POST',
      data: { config, audio }
    });

    console.log('✅ STT API responded:', data);
  } catch (err) {
    console.error('❌ STT test failed:', err.message);
  }
})();
