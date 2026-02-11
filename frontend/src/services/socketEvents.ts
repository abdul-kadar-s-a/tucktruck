/**
 * Socket.IO Event Definitions
 * All real-time events used across the TuckTruck application
 */

// ============================================
// BOOKING EVENTS
// ============================================

export const BOOKING_EVENTS = {
    // Customer → Backend
    CREATE_BOOKING: 'createBooking',
    CANCEL_BOOKING: 'cancelBooking',

    // Backend → Customer
    BOOKING_CREATED: 'bookingCreated',
    BOOKING_ACCEPTED: 'bookingAccepted',
    BOOKING_CANCELLED: 'bookingCancelled',
    BOOKING_COMPLETED: 'bookingCompleted',
    BOOKING_STATUS_UPDATE: 'bookingStatusUpdate',

    // Backend → Driver
    NEW_BOOKING_REQUEST: 'newBookingRequest',
    BOOKING_ASSIGNED: 'bookingAssigned',

    // Backend → Admin
    NEW_BOOKING_ALERT: 'newBookingAlert',
} as const;

// ============================================
// DRIVER EVENTS
// ============================================

export const DRIVER_EVENTS = {
    // Driver → Backend
    DRIVER_ONLINE: 'driverOnline',
    DRIVER_OFFLINE: 'driverOffline',
    ACCEPT_BOOKING: 'acceptBooking',
    REJECT_BOOKING: 'rejectBooking',
    DRIVER_LOCATION_UPDATE: 'driverLocationUpdate',

    // Backend → Customer/Admin
    DRIVER_ASSIGNED: 'driverAssigned',
    DRIVER_ACCEPTED_BOOKING: 'driverAcceptedBooking',
    DRIVER_REJECTED_BOOKING: 'driverRejectedBooking',
    DRIVER_ARRIVING: 'driverArriving',

    // Backend → Admin
    DRIVER_STATUS_CHANGED: 'driverStatusChanged',

    // Backend → Driver
    EARNINGS_UPDATED: 'earningsUpdated',
} as const;

// ============================================
// TRIP EVENTS
// ============================================

export const TRIP_EVENTS = {
    // Driver → Backend
    TRIP_STARTED: 'tripStarted',
    TRIP_STATUS_UPDATE: 'tripStatusUpdate',
    TRIP_COMPLETED: 'tripCompleted',

    // Status updates
    REACHING_PICKUP: 'reachingPickup',
    AT_PICKUP: 'atPickup',
    PICKED_UP: 'pickedUp',
    IN_TRANSIT: 'inTransit',
    AT_DROPOFF: 'atDropoff',
    DELIVERED: 'delivered',

    // Backend → Customer/Admin
    TRIP_CANCELLED: 'tripCancelled',
    TRIP_IN_PROGRESS: 'tripInProgress',
} as const;

// ============================================
// ADMIN EVENTS
// ============================================

export const ADMIN_EVENTS = {
    // Admin → Backend
    ASSIGN_DRIVER: 'assignDriver',
    APPROVE_DRIVER: 'approveDriver',
    BLOCK_DRIVER: 'blockDriver',
    CANCEL_BOOKING_ADMIN: 'cancelBookingAdmin',

    // Backend → Admin
    EARNINGS_UPDATED: 'earningsUpdated',
    DRIVER_REGISTERED: 'driverRegistered',
    USER_REGISTERED: 'userRegistered',
} as const;

// ============================================
// USER EVENTS
// ============================================

export const USER_EVENTS = {
    // User → Backend
    USER_AUTHENTICATE: 'userAuthenticate',
    USER_LOGOUT: 'userLogout',

    // Backend → User
    AUTHENTICATION_SUCCESS: 'authenticationSuccess',
    AUTHENTICATION_FAILED: 'authenticationFailed',
} as const;

// ============================================
// NOTIFICATION EVENTS
// ============================================

export const NOTIFICATION_EVENTS = {
    // Backend → Any
    NOTIFICATION: 'notification',
    ALERT: 'alert',
    ERROR: 'error',
    SUCCESS: 'success',
} as const;

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface BookingData {
    id?: string;
    customer: string;
    customerId: string;
    customerPhone: string;
    pickup: string;
    dropoff: string;
    vehicleType: string;
    amount: number;
    status: string;
    date: string;
    driver?: string;
    driverId?: string;
    driverPhone?: string;
}

export interface DriverLocationData {
    driverId: string;
    tripId?: string;
    bookingId?: string;
    lat: number;
    lng: number;
    timestamp: string;
    speed?: number;
    heading?: number;
}

export interface TripStatusData {
    tripId: string;
    bookingId: string;
    status: string;
    timestamp: string;
    location?: {
        lat: number;
        lng: number;
    };
}

export interface DriverStatusData {
    driverId: string;
    status: 'online' | 'offline' | 'busy';
    timestamp: string;
}

export interface NotificationData {
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    data?: any;
}

// Export all events as a single object
export const SOCKET_EVENTS = {
    ...BOOKING_EVENTS,
    ...DRIVER_EVENTS,
    ...TRIP_EVENTS,
    ...ADMIN_EVENTS,
    ...USER_EVENTS,
    ...NOTIFICATION_EVENTS,
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];
