const axios = require('axios');
const config = require('../config/config');

class ElevenLabsService {
  constructor() {
    this.apiKey = config.elevenLabs.apiKey;
    this.baseURL = 'https://api.elevenlabs.io/v1';
    this.voiceId = config.elevenLabs.voiceId; // ID голосу за замовчуванням
  }

  async textToSpeech(text) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseURL}/text-to-speech/${this.voiceId}`,
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        data: {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        },
        responseType: 'arraybuffer',
      });

      return response.data;
    } catch (error) {
      console.error('Eleven Labs API Error:', error);
      throw new Error('Помилка при генерації аудіо: ' + error.message);
    }
  }
}

module.exports = new ElevenLabsService(); 