
const API_URL = 'http://localhost:8080/api';

export const api = {
    // Auth
    signup: async (data: any) => {
        let endpoint = '/auth/signup';
        if (data.role === 'DRIVER') {
            // endpoint = '/auth/signup/driver'; // Controller has specific endpoint or general signup
            // AuthController has /signup which handles roles if passed.
            // It also has /signup/driver. Let's use /signup and pass role.
        }

        // Ensure role is uppercase for backend Enum
        if (data.role) data.role = data.role.toUpperCase();

        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Signup failed');
        }
        return response.json();
    },

    login: async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Login failed');
        }
        return response.json();
    },

    // Users
    updateUser: async (id: string, data: any) => {
        // Implement if needed
    },

    // Bookings
    createBooking: async (bookingData: any) => {
        // bookingData from frontend might be flat. Backend expects nested objects.
        // e.g. customer: { id: ... }

        const payload = {
            ...bookingData,
            customer: { id: bookingData.customerId },
            status: 'PENDING'
        };

        // Remove flat customerId if it causes issues, but extra fields are usually ignored

        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Failed to create booking');
        }
        return response.json();
    },

    getCustomerBookings: async (customerId: string) => {
        const response = await fetch(`${API_URL}/bookings/customer/${customerId}`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        return response.json();
    },

    getDriverBookings: async (driverId: string) => {
        const response = await fetch(`${API_URL}/bookings/driver/${driverId}`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        return response.json();
    },

    getDriverActiveBooking: async (driverId: string) => {
        const response = await fetch(`${API_URL}/bookings/driver/${driverId}/active`);
        if (response.status === 204) return null;
        if (!response.ok) throw new Error('Failed to fetch active booking');
        return response.json();
    },

    updateBookingStatus: async (bookingId: string, status: string) => {
        const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update status');
        return response.json();
    },

    // Drivers
    updateDriverLocation: async (bookingId: string, driverId: string, lat: number, lng: number) => {
        const response = await fetch(`${API_URL}/bookings/${bookingId}/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ driverId, latitude: lat, longitude: lng })
        });
        return response.ok;
    },

    toggleDriverStatus: async (driverId: string, isOnline: boolean) => {
        // Check DriverController for this endpoint
        // Assuming PUT /api/drivers/{id}/status
        const response = await fetch(`${API_URL}/drivers/${driverId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isOnline })
        });
        if (!response.ok) throw new Error('Failed to update driver status');
        return response.json();
    },

    getAvailableDrivers: async () => {
        const response = await fetch(`${API_URL}/drivers/available`);
        if (!response.ok) throw new Error('Failed to fetch drivers');
        return response.json();
    }
};
