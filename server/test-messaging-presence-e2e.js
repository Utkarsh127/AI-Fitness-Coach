import { chromium } from 'playwright';
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const APP_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5000/api/v1';

// We use the direct API approach from the Community tests to bypass UI onboarding friction
async function registerUser(email, username, password, name) {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, { email, username, password, confirmPassword: password, name });
    return { token: res.data.data.accessToken, id: res.data.data.user._id };
  } catch (err) {
    if (err.response?.status === 400 || err.response?.status === 409) {
      const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password });
      return { token: loginRes.data.data.accessToken, id: loginRes.data.data.user._id };
    }
    throw err;
  }
}

async function bypassOnboarding(token) {
  await axios.post(`${API_URL}/users/me/onboarding`, 
    { 
      age: 25, gender: 'male', height: 180, weight: 80, 
      fitnessGoal: ['Muscle Gain'], experienceLevel: 'Intermediate',
      trainingDaysPerWeek: 4, preferredWorkoutDuration: 60,
      trainingLocation: 'Gym', availableEquipment: ['Dumbbells']
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

async function runTests() {
  console.log('Starting Playwright E2E Messaging Presence & Error Tests...');

  let browserA, browserB;
  try {
    const timestamp = Date.now();
    const userA = { email: `presenceA_${timestamp}@test.com`, username: `usera_${timestamp}`, password: 'Password123!', name: `User A ${timestamp}` };
    const userB = { email: `presenceB_${timestamp}@test.com`, username: `userb_${timestamp}`, password: 'Password123!', name: `User B ${timestamp}` };

    console.log('Registering User A & B via API...');
    const authA = await registerUser(userA.email, userA.username, userA.password, userA.name);
    const authB = await registerUser(userB.email, userB.username, userB.password, userB.name);

    console.log('Bypassing onboarding via API...');
    await bypassOnboarding(authA.token);
    await bypassOnboarding(authB.token);

    // Start browsers
    browserA = await chromium.launch({ headless: true });
    browserB = await chromium.launch({ headless: true });

    const contextA = await browserA.newContext();
    const contextB = await browserB.newContext();

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    // Login function via UI (Playwright)
    const loginUI = async (page, user) => {
      await page.goto(`${APP_URL}/login`);
      await page.fill('input[type="email"]', user.email);
      await page.fill('input[type="password"]', user.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(`${APP_URL}/dashboard`);
    };

    console.log('Logging in via UI for sessions...');
    await Promise.all([loginUI(pageA, userA), loginUI(pageB, userB)]);
    
    // B goes to Messages and creates a chat with A
    await pageB.goto(`${APP_URL}/messages`);
    
    // Create new chat
    await pageB.click('button:has-text("Start New Chat")');
    await pageB.waitForTimeout(2000); // Wait for initial loadUsers('') to settle
    await pageB.fill('input[placeholder="Search by name, username or email..."]', userA.name);
    await pageB.waitForTimeout(1000); // Wait for search API calls to settle
    await pageB.click(`text=${userA.name}`);
    await pageB.waitForSelector(`text=Your Messages`, { state: 'hidden' }); // Wait until ChatWindow mounts

    // --- TEST 1: Verify B sees A as Online ---
    console.log('TEST 1: User B sees User A as Online');
    await pageB.waitForSelector('text=Online', { state: 'visible', timeout: 5000 });
    console.log('[OK] TEST 1 Passed.');

    // --- TEST 2: Verify B sees A go Offline when A disconnects ---
    console.log('TEST 2: User B sees User A go Offline');
    await pageA.close(); // Closes Browser A (disconnects socket)
    await pageB.waitForSelector('text=Offline', { state: 'visible', timeout: 5000 });
    console.log('[OK] TEST 2 Passed.');

    // --- TEST 3: Verify B sees A go Online when A reconnects ---
    console.log('TEST 3: User B sees User A reconnect (Online)');
    const pageA2 = await contextA.newPage();
    await pageA2.goto(`${APP_URL}/dashboard`); // Already logged in from contextA
    await pageB.waitForSelector('text=Online', { state: 'visible', timeout: 5000 });
    console.log('[OK] TEST 3 Passed.');

    // --- TEST 4: Cloudinary Quota Error Toast ---
    console.log('TEST 4: Cloudinary Quota Error Toast');
    // A goes to messages to chat with B
    await pageA2.goto(`${APP_URL}/messages`);
    await pageA2.waitForSelector(`text=${userB.name}`);
    await pageA2.click(`text=${userB.name}`);
    
    // Generate a dummy file to upload
    const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
    const fs = await import('fs');
    const dummyPath = path.join(process.cwd(), 'dummy.png');
    fs.writeFileSync(dummyPath, buffer);

    // Upload it
    await pageA2.setInputFiles('input[type="file"]', dummyPath);
    await pageA2.click('button[type="submit"]');

    // Wait for the Cloudinary toast error
    await pageA2.waitForSelector('text=Image upload failed. Cloudinary quota exceeded. Please try again later.', { state: 'visible', timeout: 10000 });
    console.log('[OK] TEST 4 Passed (Proper error handled!).');

    // Clean up dummy
    fs.unlinkSync(dummyPath);

    console.log('ALL MESSAGING PRESENCE & ERROR TESTS PASSED!');

  } catch (err) {
    console.error('TEST FAILED:', err);
    try {
      if (browserB) {
        const pages = await browserB.contexts()[0].pages();
        if (pages.length > 0) await pages[0].screenshot({ path: 'test-error-B.png' });
      }
    } catch (e) { console.error('Screenshot failed', e); }
    process.exit(1);
  } finally {
    if (browserA) await browserA.close();
    if (browserB) await browserB.close();
  }
}

runTests();
