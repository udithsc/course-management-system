// Suppress console output during tests to keep output clean
// Load test env vars
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test', override: false });
dotenv.config({ path: '.env', override: false });

// Silence logger noise in tests
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'info').mockImplementation(() => {});
