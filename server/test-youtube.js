import dotenv from 'dotenv';
dotenv.config();

import { searchFitnessVideos } from './src/services/youtube.service.js';

async function test() {
  try {
    console.log('Testing YouTube Data API v3...');
    const results = await searchFitnessVideos({ q: 'calisthenics', maxResults: 2 });
    console.log('Success! Found', results.videos.length, 'videos');
    console.log(JSON.stringify(results.videos, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

test();
