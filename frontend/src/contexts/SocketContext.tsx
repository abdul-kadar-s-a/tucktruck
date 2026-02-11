import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import socket from '../services/socket';
import { USER_EVENTS } from '../services/socketEvents';
import { User } from '../App';

interface SocketContextType {
    isConnected: boolean;
    socketId: string | null;
    error: string | null;
}

const SocketContext = createContext<SocketContextType>({
    isConnected: false,
    socketId: null,
    error: null,
});

export const useSocketContext = () => useContext(SocketContext);

interface SocketProviderProps {
    children: ReactNode;
    user: User | null;
}

export function SocketProvider({ children, user }: SocketProviderProps) {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [socketId, setSocketId] = useState<string | null>(socket.id || null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Connection event handlers
        function onConnect() {
            setIsConnected(true);
            setSocketId(socket.id || null);
            setError(null);
            console.log('✅ Socket connected in context:', socket.id);

            // Authenticate user if logged in
            if (user) {
                socket.emit(USER_EVENTS.USER_AUTHENTICATE, {
                    userId: user.id,
                    userType: user.type,
                    name: user.name,
                    email: user.email,
                });
            }
        }

        function onDisconnect() {
            setIsConnected(false);
            setSocketId(null);
            console.log('❌ Socket disconnected in context');
        }

        function onConnectError(err: Error) {
            setError(err.message);
            setIsConnected(false);
            console.error('🔴 Socket connection error in context:', err.message);
        }

        function onReconnect() {
            setError(null);
            console.log('🔄 Socket reconnected in context');
        }

        // Register event listeners
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectError);
        socket.on('reconnect', onReconnect);

        // Set initial state if already connected
        if (socket.connected) {
            onConnect();
        }

        // Cleanup on unmount
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectError);
            socket.off('reconnect', onReconnect);
        };
    }, [user]);

    // Handle user logout
    useEffect(() => {
        if (!user && socket.connected) {
            socket.emit(USER_EVENTS.USER_LOGOUT);
        }
    }, [user]);

    const value: SocketContextType = {
        isConnected,
        socketId,
        error,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}
