const { GoogleAuth } = require('google-auth-library');

(async () => {
  try {
    // Get the Base64-encoded key from environment variables
    const base64Key = process.env.GCP_BASE64_KEY?.trim();
    
    if (!base64Key) {
      throw new Error('GCP_BASE64_KEY environment variable not set');
    }
    
    // Decode the Base64 key
    let decodedKey;
    try {
      decodedKey = Buffer.from(base64Key, 'base64').toString('utf8');
    } catch (decodeErr) {
      throw new Error(`Base64 decoding failed: ${decodeErr.message}`);
    }
    
    // Parse the JSON
    let credentials;
    try {
      credentials = JSON.parse(decodedKey);
    } catch (parseErr) {
      throw new Error(`JSON parsing failed: ${parseErr.message}`);
    }
    
    // Initialize GoogleAuth
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
    
    // Use a sample audio file from Google Cloud Storage
    const audio = {
      uri: "gs://cloud-samples-tests/speech/brooklyn.flac"
    };
    
    const { data } = await client.request({
      url: 'https://speech.googleapis.com/v1/speech:recognize',
      method: 'POST',
      data: { config, audio }
    });
    
    console.log('✅ STT API responded:', data);
  } catch (err) {
    console.error('❌ STT test failed:', err.message);
    if (err.response) {
      console.error('API Error Details:', err.response.data);
    }
  }
})();
