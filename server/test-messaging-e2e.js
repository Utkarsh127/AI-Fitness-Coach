import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5000/api/v1';

async function runE2E() {
  console.log('--- STARTING MESSAGING E2E VERIFICATION ---');
  
  const clientA = axios.create({ baseURL: API_URL, withCredentials: true });
  const clientB = axios.create({ baseURL: API_URL, withCredentials: true });

  // 1. Create User A and User B
  const userA = { name: 'User A', username: 'usera' + Date.now(), email: `usera${Date.now()}@test.com`, password: 'Password123!', confirmPassword: 'Password123!' };
  const userB = { name: 'User B', username: 'userb' + Date.now(), email: `userb${Date.now()}@test.com`, password: 'Password123!', confirmPassword: 'Password123!' };

  console.log('Registering User A...');
  const resA = await clientA.post('/auth/register', userA);
  const tokenA = resA.data.data.accessToken;
  const idA = resA.data.data.user._id;
  const cookiesA = resA.headers['set-cookie'];

  console.log('Registering User B...');
  const resB = await clientB.post('/auth/register', userB);
  const tokenB = resB.data.data.accessToken;
  const idB = resB.data.data.user._id;
  const cookiesB = resB.headers['set-cookie'];

  clientA.defaults.headers.common['Authorization'] = `Bearer ${tokenA}`;
  if (cookiesA) clientA.defaults.headers.common['Cookie'] = cookiesA.join('; ');

  clientB.defaults.headers.common['Authorization'] = `Bearer ${tokenB}`;
  if (cookiesB) clientB.defaults.headers.common['Cookie'] = cookiesB.join('; ');

  // 2. Start Socket Sessions
  console.log('Connecting sockets...');
  console.log(`Token A prefix: ${tokenA?.substring(0, 10)}...`);
  const socketA = io('http://localhost:5000', { 
    auth: { token: tokenA },
    extraHeaders: { Authorization: `Bearer ${tokenA}` },
    transports: ['websocket', 'polling'],
    withCredentials: true
  });
  const socketB = io('http://localhost:5000', { 
    auth: { token: tokenB },
    extraHeaders: { Authorization: `Bearer ${tokenB}` },
    transports: ['websocket', 'polling'],
    withCredentials: true
  });

  socketA.on('connect_error', err => console.log('Socket A error:', err.message));
  socketB.on('connect_error', err => console.log('Socket B error:', err.message));

  await new Promise(r => setTimeout(r, 2000));
  
  if (socketA.connected && socketB.connected) {
    console.log('Sockets connected successfully! Presence is ONLINE.');
  } else {
    console.log('Sockets failed to connect:', { a: socketA.connected, b: socketB.connected });
  }

  // 3. User A starts conversation with User B
  console.log('User A creating conversation...');
  const convRes = await clientA.post('/messages/conversations', {
    participants: [idB],
    type: 'private'
  });
  const conversationId = convRes.data.data._id;
  console.log('Conversation created:', conversationId);

  // Both join room
  socketA.emit('joinConversation', conversationId);
  socketB.emit('joinConversation', conversationId);

  // 4. User A sends message
  console.log('User A sending message...');
  
  const msgPromiseB = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Timeout waiting for message on B')), 5000);
    socketB.once('receiveMessage', msg => { clearTimeout(t); resolve(msg); });
  });
  
  await clientA.post('/messages', {
    conversationId,
    content: 'Hello from User A',
    messageType: 'Text'
  }, { headers: { 'Content-Type': 'multipart/form-data' } });

  const receivedMsgB = await msgPromiseB;
  console.log('User B received instantly:', receivedMsgB.content);

  // 5. User B replies
  console.log('User B replying...');
  const msgPromiseA = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Timeout waiting for message on A')), 5000);
    socketA.once('receiveMessage', msg => { clearTimeout(t); resolve(msg); });
  });

  await clientB.post('/messages', {
    conversationId,
    content: 'Hello from User B',
    messageType: 'Text'
  }, { headers: { 'Content-Type': 'multipart/form-data' } });

  const receivedMsgA = await msgPromiseA;
  console.log('User A received instantly:', receivedMsgA.content);

  // 6. Test Refresh Token Flow
  console.log('Testing refresh token flow...');
  const refreshRes = await clientB.post('/auth/refresh');
  if (refreshRes.status === 200) {
    console.log('Refresh token flow SUCCESS');
  }

  console.log('--- ALL TESTS PASSED! ---');
  socketA.disconnect();
  socketB.disconnect();
}

runE2E().catch(err => {
  console.error('TEST FAILED:', err.response ? err.response.data : err);
  process.exit(1);
});
