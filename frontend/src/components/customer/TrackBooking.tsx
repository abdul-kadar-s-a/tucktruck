import { useState, useEffect } from 'react';
import { MapPin, Phone, Star, CheckCircle, Navigation, Map as MapIcon } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { LiveTrackingMap } from '../shared/LiveTrackingMap';
import { geocodeAddress } from '../../utils/locationService';
import { useSocket } from '../../hooks/useSocket';
import { DRIVER_EVENTS, BOOKING_EVENTS, DriverLocationData, TripStatusData } from '../../services/socketEvents';

interface TrackBookingProps {
  bookingId: string;
  vehicle: {
    name: string;
    type: string;
  };
  pickup: string;
  dropoff: string;
  driverName: string;
  driverPhone: string;
  amount: number;
  onComplete: () => void;
}

export function TrackBooking({ bookingId, vehicle, pickup, dropoff, driverName, driverPhone, amount, onComplete }: TrackBookingProps) {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'en-route-pickup' | 'arrived-pickup' | 'picked-up' | 'en-route-dropoff' | 'arrived-dropoff' | 'delivered' | 'completed'>('pending');
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showMap, setShowMap] = useState(false);

  // State for driver details, initially empty or based on props
  const [driver, setDriver] = useState({
    id: 'Waiting...',
    name: driverName || 'Searching for driver...',
    phone: driverPhone || '',
    rating: 0,
    trips: 0,
    vehicleNo: 'Waiting...',
    vehicleImage: null as string | null,
  });

  const [driverAssigned, setDriverAssigned] = useState(!!driverName);
  const [driverLocation, setDriverLocation] = useState<[number, number] | undefined>(undefined);
  const [pickupCoords, setPickupCoords] = useState<[number, number] | undefined>(undefined);
  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | undefined>(undefined);

  // Initialize socket for real-time updates
  const { on, off } = useSocket();

  // Geocode locations on mount
  useEffect(() => {
    const initCoords = async () => {
      if (pickup) {
        const pCoords = await geocodeAddress(pickup);
        setPickupCoords(pCoords);
      }
      if (dropoff) {
        const dCoords = await geocodeAddress(dropoff);
        setDropoffCoords(dCoords);
      }
    };
    initCoords();
  }, [pickup, dropoff]);

  // Poll for status updates and driver assignment from localStorage
  useEffect(() => {
    // Poll every 3 seconds to check if Admin has assigned a driver in localStorage
    const pollInterval = setInterval(() => {
      try {
        const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const currentBooking = storedBookings.find((b: any) => b.id === bookingId);

        if (currentBooking) {
          // Update status if it changed
          if (currentBooking.status !== status) {
            setStatus(currentBooking.status);

            // If completed, show rating
            if (currentBooking.status === 'completed') {
              setShowRating(true);
            }
          }

          // Check for driver assignment
          if (currentBooking.driver && currentBooking.driverId && !driverAssigned) {
            setDriverAssigned(true);
            setStatus('accepted'); // Move to accepted once driver is found

            // In a real app, we would fetch full driver details from API using driverId
            // Here we simulate fetching details or use what's in the booking object
            // Let's try to find more driver info from 'drivers' localStorage if available
            const storedDrivers = JSON.parse(localStorage.getItem('drivers') || '[]');
            const driverDetails = storedDrivers.find((d: any) => d.id === currentBooking.driverId);

            setDriver({
              id: currentBooking.driverId,
              name: driverDetails?.name || currentBooking.driver.split('(')[0].trim(),
              phone: currentBooking.driverPhone || driverDetails?.phone || '',
              rating: 4.8, // Mock default
              trips: 150, // Mock default
              vehicleNo: driverDetails?.vehicleNo || 'TN-45-AA-1234',
              // Prioritize the direct vehicleImage property which we save in DriverVehicle.tsx
              vehicleImage: driverDetails?.vehicleImage || driverDetails?.documents?.find((doc: any) => doc.type === 'vehicleImage')?.file || null
            });
          }
        }
      } catch (error) {
        console.error("Error polling booking status", error);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [bookingId, status, driverAssigned]);

  // 🔥 REAL-TIME: Listen for driver location updates
  useEffect(() => {
    // Listen for driver location updates
    on<DriverLocationData>(DRIVER_EVENTS.DRIVER_LOCATION_UPDATE, (data) => {
      console.log('📍 Driver location update:', data);
      if (data.driverId === driver.id || data.bookingId === bookingId) {
        setDriverLocation([data.lat, data.lng]);
      }
    });

    // Listen for trip status updates
    on<TripStatusData>(BOOKING_EVENTS.BOOKING_STATUS_UPDATE, (data) => {
      console.log('🚀 Trip status update:', data);
      if (data.bookingId === bookingId) {
        setStatus(data.status as any);
        if (data.status === 'completed') {
          setShowRating(true);
        }
      }
    });

    // Cleanup listeners
    return () => {
      off(DRIVER_EVENTS.DRIVER_LOCATION_UPDATE);
      off(BOOKING_EVENTS.BOOKING_STATUS_UPDATE);
    };
  }, [bookingId, driver.id, on, off]);

  // Auto-progress status simulation (fallback if no real-time updates)
  useEffect(() => {
    if (!driverAssigned) return;

    const statuses: typeof status[] = ['accepted', 'en-route-pickup', 'arrived-pickup', 'picked-up', 'en-route-dropoff', 'arrived-dropoff', 'delivered'];

    // Find where we are
    let currentIndex = statuses.indexOf(status);
    if (currentIndex === -1) currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statuses.length - 1) {
        currentIndex++;
        setStatus(statuses[currentIndex]);
      } else {
        setShowRating(true);
        clearInterval(interval);
      }
    }, 5000); // 5 seconds per status

    return () => clearInterval(interval);
  }, [driverAssigned]);

  const getStatusInfo = () => {
    const statusMap = {
      'pending': { text: 'Waiting for Driver Assignment', color: 'bg-yellow-500', step: 0, emoji: '⏳' },
      'accepted': { text: 'Booking Accepted', color: 'bg-blue-500', step: 1, emoji: '✅' },
      'en-route-pickup': { text: 'Driver En Route to Pickup', color: 'bg-blue-500', step: 2, emoji: '🚗' },
      'arrived-pickup': { text: 'Driver Arrived at Pickup', color: 'bg-green-500', step: 3, emoji: '📍' },
      'picked-up': { text: 'Goods Picked Up', color: 'bg-green-500', step: 4, emoji: '📦' },
      'en-route-dropoff': { text: 'En Route to Drop-off', color: 'bg-blue-500', step: 5, emoji: '🚚' },
      'arrived-dropoff': { text: 'Arrived at Drop-off', color: 'bg-green-500', step: 6, emoji: '🎯' },
      'delivered': { text: 'Delivered Successfully', color: 'bg-green-600', step: 7, emoji: '✨' },
      'completed': { text: 'Trip Completed', color: 'bg-green-700', step: 8, emoji: '🎉' },
    };
    return statusMap[status] || statusMap['pending'];
  };

  const handleSubmitRating = () => {
    alert(`Thank you for your rating!\nRating: ${rating} stars\nTip: ₹${tip}\nFeedback: ${feedback}`);
    onComplete();
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedBookings = storedBookings.map((b: any) =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      );
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      setStatus('cancelled' as any); // Type assertion if 'cancelled' not in original union
      alert('Booking cancelled successfully.');
      onComplete(); // Go back to selection
    }
  };

  const statusInfo = getStatusInfo();

  if (showRating) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Delivery Complete! 🎉</h2>
            <p className="text-gray-600">Your goods have been delivered successfully</p>
            <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Amount to Pay Driver</p>
              <p className="text-3xl font-bold text-blue-600">₹{amount.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Cash on Delivery</p>
            </div>
          </div>

          {/* Rate Driver */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">⭐ Rate Your Experience</h3>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-gray-600">
                {rating === 5 ? '🌟 Excellent!' : rating === 4 ? '😊 Great!' : rating === 3 ? '🙂 Good' : '😐 Could be better'}
              </p>
            )}
          </div>

          {/* Add Tip */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">💰 Add a Tip (Optional)</h3>
            <div className="grid grid-cols-4 gap-2">
              {[0, 20, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTip(amount)}
                  className={`py-3 rounded-lg border-2 transition-all font-semibold ${tip === amount
                    ? 'border-green-600 bg-green-50 text-green-600 transform scale-105'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {amount === 0 ? 'No Tip' : `₹${amount}`}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={tip}
              onChange={(e) => setTip(Number(e.target.value))}
              className="w-full mt-3 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter custom amount"
            />
          </div>

          {/* Feedback */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">💬 Additional Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Share your experience with us..."
            />
          </div>

          <Button
            onClick={handleSubmitRating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
          >
            Submit & Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📦 Tracking Booking</h2>
            <p className="text-gray-600">ID: {bookingId}</p>
          </div>
          <div className={`px-6 py-3 rounded-full text-white ${statusInfo.color} shadow-lg`}>
            <span className="text-2xl mr-2">{statusInfo.emoji}</span>
            <span className="font-semibold">{statusInfo.text}</span>
          </div>
        </div>

        {/* Cancellation Controls */}
        {status === 'pending' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-semibold">Waiting for a driver...</p>
              <p className="text-sm text-yellow-600">You can cancel the booking before a driver is assigned.</p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors"
            >
              Cancel Booking
            </button>
          </div>
        )}

        {(status !== 'pending' && status !== 'completed' && status !== 'delivered' && status !== 'cancelled' as any) && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-blue-800 font-semibold">Driver Assigned</p>
              <p className="text-sm text-blue-600">Cancellation is disabled once a driver accepts your booking.</p>
            </div>
          </div>
        )}

        {/* Progress Timeline */}
        <div className="mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-2 bg-gray-200 rounded-full -z-10">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(statusInfo.step / 7) * 100}%` }}
              />
            </div>
            {[
              { label: 'Drivers', step: 0, emoji: '⏳' },
              { label: 'Accepted', step: 1, emoji: '✅' },
              { label: 'En Route', step: 2, emoji: '🚗' },
              { label: 'Picked Up', step: 4, emoji: '📦' },
              { label: 'In Transit', step: 5, emoji: '🚚' },
              { label: 'Delivered', step: 7, emoji: '✨' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${statusInfo.step >= item.step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                >
                  {statusInfo.step >= item.step ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white text-xs font-bold">{item.step}</span>
                  )}
                </div>
                <span className="text-xs text-gray-600 mt-2 text-center font-semibold">{item.emoji} {item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Map */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">🗺️ Live Location Tracking</h3>
          <Button
            onClick={() => setShowMap(!showMap)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <MapIcon className="w-4 h-4" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>

        {showMap && (
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 relative border-2 border-gray-200">
            <LiveTrackingMap
              bookingId={bookingId}
              pickup={pickupCoords || [11.1271, 78.6569]}
              dropoff={dropoffCoords || [13.0827, 80.2707]}
              driverId={driver.id}
              driverLocation={driverLocation}
              status={status}
            />
            {driverLocation && (
              <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-lg border-2 border-green-500">
                <p className="text-xs text-gray-600">📡 Live Tracking</p>
                <p className="text-sm font-bold text-green-600">Driver Location Updated</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Driver & Vehicle Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">👤 Driver Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Driver ID</p>
              <p className="text-gray-800 font-semibold">{driver.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-gray-800 font-semibold text-lg">{driver.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-800 font-semibold text-lg">{driver.rating}</span>
                <span className="text-gray-500">({driver.trips} trips)</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Contact Driver</p>
              <a
                href={`tel:${driver.phone}`}
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg font-semibold"
              >
                <Phone className="w-5 h-5" />
                Call {driver.phone}
              </a>
              <p className="text-xs text-center text-gray-500 mt-2">📞 Dummy phone number for demo</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🚚 Vehicle Details</h3>
          <div className="space-y-4">
            {driver.vehicleImage ? (
              <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm">
                <ImageWithFallback
                  src={driver.vehicleImage}
                  alt="Vehicle"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border-2 border-gray-200 border-dashed">
                <span>No vehicle image available</span>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Vehicle Type</p>
              <p className="text-gray-800 font-semibold text-lg">{vehicle.name}</p>
              <p className="text-gray-600">{vehicle.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vehicle Number</p>
              <p className="text-gray-800 font-semibold text-lg font-mono bg-gray-100 inline-block px-2 py-1 rounded">{driver.vehicleNo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Route Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🛣️ Route Information</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="bg-green-500 rounded-full p-3 shadow-md">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-700">Pickup Location</p>
              <p className="text-gray-800 font-semibold">{pickup}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
            <div className="bg-red-500 rounded-full p-3 shadow-md">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">Drop-off Location</p>
              <p className="text-gray-800 font-semibold">{dropoff}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">💰 Total Amount</p>
            <p className="text-3xl font-bold text-blue-600">₹{amount.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Payment Method</p>
            <p className="text-lg font-semibold text-green-600">💵 Cash on Delivery</p>
            <p className="text-xs text-gray-500">Pay driver after delivery</p>
          </div>
        </div>
      </div>
    </div >
  );
}
