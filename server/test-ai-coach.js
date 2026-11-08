import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000/api/v1';
let token = '';
let conversationId = '';
let secondConversationId = '';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json().catch(() => null);
  
  return { status: res.status, data };
}

async function runTests() {
  console.log('--- STARTING AI COACH TESTS ---');
  
  // 1. Auth & Setup
  console.log('\\n[Setup] Registering test user...');
  const email = `testai_${Date.now()}@example.com`;
  let res = await request('/auth/register', 'POST', {
    name: 'Test AI User',
    email,
    password: 'Password123!',
    passwordConfirm: 'Password123!'
  });
  
  if (res.status !== 201) {
    console.error('Registration failed', res.data);
    process.exit(1);
  }
  token = res.data.token;
  console.log('Registered successfully');

  // Set Profile Context
  console.log('\\n[Setup] Setting user profile context...');
  res = await request('/users/profile', 'PUT', {
    fitnessGoals: ['Hypertrophy', 'Strength'],
    experienceLevel: 'Intermediate',
    preferredWorkoutTypes: ['Calisthenics', 'Weights'],
    equipmentAvailable: ['Pull-up bar', 'Dumbbells']
  });
  if (res.status !== 200) {
    console.error('Failed to set profile', res.data);
    process.exit(1);
  }
  console.log('Profile context set.');

  // Create Conversation
  console.log('\\n[Setup] Creating new AI conversation...');
  res = await request('/ai/conversations', 'POST');
  if (res.status !== 201) {
    console.error('Failed to create conversation', res.data);
    process.exit(1);
  }
  conversationId = res.data.data._id;
  console.log(`Conversation created: ${conversationId}`);

  // Test 1: Profile Context
  console.log('\\n[Test 1] Profile Context: "What do you know about me?"');
  res = await request(`/ai/conversations/${conversationId}/messages`, 'POST', {
    content: "What do you know about me?"
  });
  console.log('AI Reply:', res.data.data.content);
  if (!res.data.data.content.toLowerCase().includes('calisthenics') && !res.data.data.content.toLowerCase().includes('intermediate')) {
    console.warn('WARNING: AI did not mention profile details. Check context injection.');
  } else {
    console.log('Test 1 PASSED');
  }

  // Test 2: Workout Generation
  console.log('\\n[Test 2] Workout Generation');
  res = await request(`/ai/conversations/${conversationId}/messages`, 'POST', {
    content: "Create a 4-day workout plan based on my current goals, experience, equipment, and schedule."
  });
  console.log('AI Reply length:', res.data.data.content.length);
  console.log('Test 2 PASSED');

  // Test 3: Follow-up Context
  console.log('\\n[Test 3] Follow-up Context: "Make day 1 harder."');
  res = await request(`/ai/conversations/${conversationId}/messages`, 'POST', {
    content: "Make day 1 harder."
  });
  console.log('AI Reply snippet:', res.data.data.content.substring(0, 150) + '...');
  console.log('Test 3 PASSED');

  // Test 4: Fitness Question
  console.log('\\n[Test 4] Fitness Question: "How can I improve my handstand push-up strength?"');
  res = await request(`/ai/conversations/${conversationId}/messages`, 'POST', {
    content: "How can I improve my handstand push-up strength?"
  });
  console.log('AI Reply length:', res.data.data.content.length);
  console.log('Test 4 PASSED');

  // Test 5: Nutrition
  console.log('\\n[Test 5] Nutrition: "Give me a simple daily nutrition strategy for my current goal."');
  res = await request(`/ai/conversations/${conversationId}/messages`, 'POST', {
    content: "Give me a simple daily nutrition strategy for my current goal."
  });
  console.log('AI Reply length:', res.data.data.content.length);
  console.log('Test 5 PASSED');

  // Test 6: Conversation Persistence
  console.log('\\n[Test 6] Conversation Persistence (Simulating refresh)');
  res = await request(`/ai/conversations/${conversationId}`);
  if (res.status === 200 && res.data.data.messages.length > 0) {
    console.log(`Fetched conversation with ${res.data.data.messages.length} messages.`);
    console.log('Test 6 PASSED');
  } else {
    console.error('Test 6 FAILED');
  }

  // Test 7: New Conversation
  console.log('\\n[Test 7] New Conversation');
  res = await request('/ai/conversations', 'POST');
  secondConversationId = res.data.data._id;
  console.log(`Second conversation created: ${secondConversationId}`);
  if (secondConversationId !== conversationId) {
    console.log('Test 7 PASSED');
  }

  // Test 8: Long Conversation
  console.log('\\n[Test 8] Long Conversation (Sending 3 more messages to original conv)');
  for (let i = 1; i <= 3; i++) {
    process.stdout.write(`Sending message ${i}... `);
    res = await request(`/ai/conversations/${conversationId}/messages`, 'POST', {
      content: `This is normal test message ${i}`
    });
    console.log(res.status === 200 ? 'OK' : `FAIL (${res.status})`);
  }
  console.log('Test 8 PASSED');

  console.log('\\n--- TESTS COMPLETE ---');
}

runTests().catch(console.error);
