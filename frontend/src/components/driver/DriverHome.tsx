import { AlertCircle, Phone, CheckCircle, X, MapPin, Navigation, Package, DollarSign, Bell } from 'lucide-react';
import { User } from '../../App';
import { useState, useEffect } from 'react';
import { getDriverRate, calculateTripCost } from '../../utils/pricing';
import { ActiveTripTracking } from './ActiveTripTracking';
import { useSocket } from '../../hooks/useSocket';
import { DRIVER_EVENTS, BOOKING_EVENTS, BookingData } from '../../services/socketEvents';

interface DriverHomeProps {
  user: User;
  isOnline: boolean;
}

interface BookingRequest {
  id: string;
  customer: string;
  customerPhone: string;
  pickup: string;
  dropoff: string;
  distance: number;
  payment: number;
  weight: string;
  description: string;
}

const mockRequests: BookingRequest[] = [
  {
    id: 'REQ001',
    customer: 'Amit Patel',
    customerPhone: '+91 9876543210',
    pickup: 'Mumbai Central, Station Road',
    dropoff: 'Andheri West, SV Road',
    distance: 15,
    payment: 450,
    weight: '500 kg',
    description: 'Furniture items',
  },
  {
    id: 'REQ002',
    customer: 'Priya Sharma',
    customerPhone: '+91 9876543211',
    pickup: 'Thane West, Ghodbunder Road',
    dropoff: 'Navi Mumbai, Vashi',
    distance: 22,
    payment: 680,
    weight: '800 kg',
    description: 'Electronic goods',
  },
];

export function DriverHome({ user, isOnline }: DriverHomeProps) {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [showEmergency, setShowEmergency] = useState(false);
  const [activeBooking, setActiveBooking] = useState<BookingRequest | null>(null);
  const [todayEarnings, setTodayEarnings] = useState(1450);
  const [todayTrips, setTodayTrips] = useState(3);
  const driverRate = getDriverRate(user.id);

  // Initialize socket for real-time updates
  const { emit, on, off } = useSocket();

  // Update requests based on online status
  // Update requests based on online status and localStorage
  useEffect(() => {
    if (!isOnline) {
      setRequests([]);
      return;
    }

    const fetchRequests = () => {
      try {
        const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const myRequests = storedBookings.filter((b: any) =>
          b.driverId === user.id && b.status === 'assigned'
        ).map((b: any) => ({
          id: b.id,
          customer: b.customer,
          customerPhone: b.customerPhone,
          pickup: b.pickup,
          dropoff: b.dropoff,
          distance: 15, // Mock distance if not saved
          payment: b.amount,
          weight: b.weight || 'N/A', // Assuming weight is saved
          description: b.description || 'Goods', // Assuming description is saved
          // Preserve original booking for updates
          original: b
        }));
        setRequests(myRequests);
      } catch (error) {
        console.error("Error fetching requests", error);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [isOnline, user.id]);

  // 🔥 REAL-TIME: Broadcast online/offline status
  useEffect(() => {
    if (isOnline) {
      // Emit driver online event
      emit(DRIVER_EVENTS.DRIVER_ONLINE, {
        driverId: user.id,
        driverName: user.name,
        vehicleType: user.zone || 'Truck', // Use zone or default
        timestamp: new Date().toISOString(),
      });
      console.log('✅ Driver went ONLINE - broadcasted to server');
    } else {
      // Emit driver offline event
      emit(DRIVER_EVENTS.DRIVER_OFFLINE, {
        driverId: user.id,
        timestamp: new Date().toISOString(),
      });
      console.log('❌ Driver went OFFLINE - broadcasted to server');
    }
  }, [isOnline, user.id, user.name, user.zone, emit]);

  // 🔥 REAL-TIME: Listen for new booking requests
  useEffect(() => {
    // Listen for new booking requests assigned to this driver
    on<BookingData>(BOOKING_EVENTS.NEW_BOOKING_REQUEST, (data) => {
      console.log('🔔 New booking request received:', data);
      if (data.driverId === user.id) {
        const newRequest: BookingRequest = {
          id: data.id || '',
          customer: data.customer,
          customerPhone: data.customerPhone,
          pickup: data.pickup,
          dropoff: data.dropoff,
          distance: 15, // Calculate from data if available
          payment: data.amount,
          weight: 'N/A',
          description: 'Goods',
        };
        setRequests(prev => [...prev, newRequest]);
        // Play sound notification
        playNotificationSound();
      }
    });

    // Listen for earnings updates
    on<any>(DRIVER_EVENTS.EARNINGS_UPDATED, (data) => {
      console.log('💰 Earnings updated:', data);
      if (data.driverId === user.id) {
        setTodayEarnings(data.todayEarnings || todayEarnings);
        setTodayTrips(data.todayTrips || todayTrips);
      }
    });

    return () => {
      off(BOOKING_EVENTS.NEW_BOOKING_REQUEST);
      off(DRIVER_EVENTS.EARNINGS_UPDATED);
    };
  }, [user.id, on, off, todayEarnings, todayTrips]);

  const handleAccept = (request: BookingRequest) => {
    // Update booking status in localStorage
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updatedBookings = storedBookings.map((b: any) =>
      b.id === request.id ? { ...b, status: 'accepted' } : b
    );
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    // 🔥 EMIT REAL-TIME EVENT - Notify customer and admin
    emit(BOOKING_EVENTS.BOOKING_ACCEPTED, {
      id: request.id,
      driverId: user.id,
      driver: user.name,
      status: 'accepted',
      timestamp: new Date().toISOString(),
    });

    console.log('✅ Booking accepted and emitted:', request.id);

    setActiveBooking(request);
    setRequests(requests.filter(r => r.id !== request.id));
  };

  const handleDecline = (requestId: string) => {
    // 🔥 EMIT REAL-TIME EVENT - Notify backend
    emit(DRIVER_EVENTS.REJECT_BOOKING, {
      bookingId: requestId,
      driverId: user.id,
      timestamp: new Date().toISOString(),
    });

    console.log('❌ Booking declined and emitted:', requestId);
    setRequests(requests.filter(r => r.id !== requestId));
  };

  // Play notification sound for new bookings
  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,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');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Could not play sound:', e));
    } catch (error) {
      console.log('Notification sound not available');
    }
  };

  const handleTripComplete = () => {
    setActiveBooking(null);
    // Reload requests if still online
    if (isOnline) {
      setTimeout(() => {
        setRequests(mockRequests);
      }, 2000);
    }
  };

  const emergencyContacts = [
    { name: 'Family Contact 1', number: '+91 9876543210' },
    { name: 'Family Contact 2', number: '+91 9876543211' },
    { name: 'Police', number: '100' },
    { name: 'Ambulance', number: '108' },
  ];

  // If there's an active booking, show tracking
  if (activeBooking) {
    return (
      <ActiveTripTracking
        booking={activeBooking}
        onComplete={handleTripComplete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Rate Display */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="opacity-90 mb-1">Your Current Rate</p>
            <p className="text-4xl font-bold">₹{driverRate}/km</p>
            <p className="text-sm opacity-90 mt-2">Customers see this rate when booking</p>
          </div>
          <DollarSign className="w-16 h-16 opacity-50" />
        </div>
      </div>

      {/* Emergency Button */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">🆘 Emergency Assistance</h3>
            <p className="text-gray-600">Quick access to emergency contacts</p>
          </div>
          <button
            onClick={() => setShowEmergency(!showEmergency)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-semibold shadow-md"
          >
            <AlertCircle className="w-5 h-5" />
            SOS Emergency
          </button>
        </div>

        {showEmergency && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-3">
            {emergencyContacts.map((contact, index) => (
              <a
                key={index}
                href={`tel:${contact.number}`}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
              >
                <div>
                  <p className="font-semibold text-gray-800">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.number}</p>
                </div>
                <Phone className="w-5 h-5 text-red-600" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Status Alert */}
      {!isOnline && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-bold text-yellow-800">You are currently offline</h3>
              <p className="text-yellow-700">Toggle your status to online to start receiving booking requests</p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Today's Trips</p>
              <p className="text-2xl font-bold text-gray-800">{todayTrips}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-800">₹{todayEarnings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 rounded-full p-3">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Trips</p>
              <p className="text-2xl font-bold text-gray-800">234</p>
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Orders Alert - Fixed at bottom */}
      {requests.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 shadow-2xl z-50 animate-bounce">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 animate-pulse" />
              <div>
                <p className="font-bold text-lg">🔔 New Booking Request!</p>
                <p className="text-sm opacity-90">{requests.length} pending request(s)</p>
              </div>
            </div>
            <div className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold">
              Check Below ↓
            </div>
          </div>
        </div>
      )}

      {/* Booking Requests */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {isOnline ? '📨 Incoming Booking Requests' : '📭 No Active Requests'}
          </h2>
          {requests.length > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              {requests.length} New
            </span>
          )}
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {isOnline ? 'Waiting for booking requests...' : 'Go online to receive booking requests'}
            </p>
            {!isOnline && (
              <p className="text-gray-400 text-sm mt-2">
                Toggle the switch at the top to go online
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const tripCost = calculateTripCost(request.pickup, request.dropoff, driverRate);
              return (
                <div
                  key={request.id}
                  className="border-2 border-blue-200 bg-blue-50 rounded-xl p-6 shadow-lg animate-pulse-slow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">🔔 New Booking Request</h3>
                      <p className="text-gray-600">From: {request.customer}</p>
                      <p className="text-sm text-gray-500">Phone: {request.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">₹{tripCost.total.toFixed(0)}</p>
                      <p className="text-sm text-gray-500">{tripCost.distance} km</p>
                      <p className="text-xs text-gray-500">@ ₹{driverRate}/km</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-700">Pickup</p>
                        <p className="text-gray-800">{request.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <Navigation className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-red-700">Drop-off</p>
                        <p className="text-gray-800">{request.dropoff}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-white rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="font-semibold text-gray-800">{request.weight}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="font-semibold text-gray-800">{request.description}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-600 mb-2 font-semibold">💰 Price Breakdown:</p>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Base Fare ({tripCost.distance} km × ₹{driverRate}/km)</span>
                          <span className="font-semibold">₹{tripCost.baseFare.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Toll Charges (both ways)</span>
                          <span className="font-semibold">₹{tripCost.tollCharges.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-1 font-bold">
                          <span>Total (Cash on Delivery)</span>
                          <span className="text-green-600">₹{tripCost.total.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAccept(request)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Accept Booking
                    </button>
                    <button
                      onClick={() => handleDecline(request.id)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                      <X className="w-5 h-5" />
                      Decline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Recent Trips</h3>
        <div className="space-y-3">
          {[
            { id: 'BK001', from: 'Dadar', to: 'Bandra', amount: 420, status: 'Completed' },
            { id: 'BK002', from: 'Kurla', to: 'Andheri', amount: 580, status: 'Completed' },
            { id: 'BK003', from: 'Thane', to: 'Mumbai', amount: 450, status: 'Completed' },
          ].map((trip) => (
            <div key={trip.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-semibold text-gray-800">{trip.from} → {trip.to}</p>
                <p className="text-sm text-gray-500">Booking #{trip.id}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">₹{trip.amount}</p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-semibold">
                  ✓ {trip.status}
                </span>
              </div>
            </div>
          ))}</div>
      </div>
    </div>
  );
}
