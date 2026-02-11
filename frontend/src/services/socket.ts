import { io, Socket } from 'socket.io-client';

// Backend server URL - update this when you have a backend running
const SOCKET_URL = 'http://localhost:3001';

// Create socket instance with configuration
const socket: Socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
});

// Connection event handlers
socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
    console.error('🔴 Socket connection error:', error.message);
});

socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
    console.error('🔴 Socket reconnection error:', error.message);
});

socket.on('reconnect_failed', () => {
    console.error('🔴 Socket reconnection failed - max attempts reached');
});

export default socket;
