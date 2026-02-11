import { useEffect, useRef, useCallback } from 'react';
import socket from '../services/socket';
import { SocketEvent } from '../services/socketEvents';

/**
 * Custom React hook for managing Socket.IO events
 * Provides easy subscription and emission with automatic cleanup
 */

interface UseSocketOptions {
    enabled?: boolean; // Whether to enable the socket connection
}

export function useSocket(options: UseSocketOptions = { enabled: true }) {
    const { enabled = true } = options;
    const listenersRef = useRef<Map<string, Function>>(new Map());

    /**
     * Subscribe to a socket event
     * Automatically cleans up on unmount
     */
    const on = useCallback(<T = any>(
        event: SocketEvent | string,
        callback: (data: T) => void
    ) => {
        if (!enabled) return;

        // Remove existing listener if any
        if (listenersRef.current.has(event)) {
            socket.off(event, listenersRef.current.get(event) as any);
        }

        // Add new listener
        socket.on(event, callback);
        listenersRef.current.set(event, callback);
    }, [enabled]);

    /**
     * Subscribe to a socket event (one-time)
     * Automatically removes listener after first call
     */
    const once = useCallback(<T = any>(
        event: SocketEvent | string,
        callback: (data: T) => void
    ) => {
        if (!enabled) return;

        socket.once(event, callback);
    }, [enabled]);

    /**
     * Unsubscribe from a socket event
     */
    const off = useCallback((event: SocketEvent | string) => {
        const listener = listenersRef.current.get(event);
        if (listener) {
            socket.off(event, listener as any);
            listenersRef.current.delete(event);
        }
    }, []);

    /**
     * Emit a socket event
     */
    const emit = useCallback(<T = any>(
        event: SocketEvent | string,
        data?: T,
        callback?: (response: any) => void
    ) => {
        if (!enabled) {
            console.warn('Socket is disabled, cannot emit:', event);
            return;
        }

        if (callback) {
            socket.emit(event, data, callback);
        } else {
            socket.emit(event, data);
        }
    }, [enabled]);

    /**
     * Get connection status
     */
    const isConnected = useCallback(() => {
        return socket.connected;
    }, []);

    /**
     * Get socket ID
     */
    const getSocketId = useCallback(() => {
        return socket.id;
    }, []);

    /**
     * Manually connect socket
     */
    const connect = useCallback(() => {
        if (!socket.connected) {
            socket.connect();
        }
    }, []);

    /**
     * Manually disconnect socket
     */
    const disconnect = useCallback(() => {
        if (socket.connected) {
            socket.disconnect();
        }
    }, []);

    // Cleanup all listeners on unmount
    useEffect(() => {
        return () => {
            listenersRef.current.forEach((listener, event) => {
                socket.off(event, listener as any);
            });
            listenersRef.current.clear();
        };
    }, []);

    return {
        on,
        once,
        off,
        emit,
        isConnected,
        getSocketId,
        connect,
        disconnect,
        socket, // Expose raw socket for advanced use cases
    };
}

/**
 * Hook for listening to a specific event
 * Simpler API for single event subscriptions
 */
export function useSocketEvent<T = any>(
    event: SocketEvent | string,
    callback: (data: T) => void,
    dependencies: any[] = []
) {
    const { on, off } = useSocket();

    useEffect(() => {
        on(event, callback);
        return () => off(event);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event, ...dependencies]);
}

/**
 * Hook for emitting events
 * Returns a memoized emit function
 */
export function useSocketEmit() {
    const { emit } = useSocket();
    return emit;
}
