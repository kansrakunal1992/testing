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
    
    // Validate decoded key looks like JSON
    if (!decodedKey.startsWith('{') || !decodedKey.endsWith('}')) {
      console.error('Decoded key preview (first 200 chars):', decodedKey.substring(0, 200));
      throw new Error('Decoded key is not valid JSON format');
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
    
    // Additional debugging for Base64 issues
    if (err.message.includes('Base64 decoding failed') || 
        err.message.includes('JSON parsing failed') ||
        err.message.includes('not valid JSON')) {
      console.error('🔍 Debugging info:');
      console.error('- Check that GCP_BASE64_KEY is set correctly in Railway');
      console.error('- Verify the entire Base64 string was copied without truncation');
      console.error('- Ensure no extra characters were added during copy/paste');
    }
  }
})();
