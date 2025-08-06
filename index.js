const { GoogleAuth } = require('google-auth-library');

(async () => {
  try {
    // Get the Base64-encoded key from environment variables
    const base64Key = process.env.GCP_BASE64_KEY;
    
    if (!base64Key) {
      throw new Error('GCP_BASE64_KEY environment variable not set');
    }
    
    // Decode the Base64 key
    const decodedKey = Buffer.from(base64Key, 'base64').toString('utf8');
    
    // Parse the JSON
    const credentials = JSON.parse(decodedKey);
    
    // Initialize GoogleAuth with the credentials
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
