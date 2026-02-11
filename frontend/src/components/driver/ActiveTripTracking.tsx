import { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, Package, CheckCircle, IndianRupee, Map } from 'lucide-react';
import { Button } from '../ui/button';
import { TamilNaduMap } from '../shared/TamilNaduMap';
import { geocodeAddress } from '../../utils/locationService';
import { useSocket } from '../../hooks/useSocket';
import { DRIVER_EVENTS, TRIP_EVENTS, BOOKING_EVENTS } from '../../services/socketEvents';
import { watchPosition, clearWatch, getCurrentPosition } from '../../services/geolocation';

interface ActiveTripTrackingProps {
  booking: {
    id: string;
    customer: string;
    customerPhone: string;
    pickup: string;
    dropoff: string;
    distance: number;
    payment: number;
    weight: string;
    description: string;
  };
  onComplete: () => void;
}

type TripStage = 'accepted' | 'reaching-pickup' | 'at-pickup' | 'picked-up' | 'in-transit' | 'at-dropoff' | 'delivered' | 'money-received';

export function ActiveTripTracking({ booking, onComplete }: ActiveTripTrackingProps) {
  const [stage, setStage] = useState<TripStage>('accepted');
  const [showMap, setShowMap] = useState(false);
  const [showMoneyConfirm, setShowMoneyConfirm] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<[number, number] | undefined>(undefined);
  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | undefined>(undefined);
  const [driverLocation, setDriverLocation] = useState<[number, number]>([11.1271, 78.6569]);
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);

  // Initialize socket for real-time updates
  const { emit } = useSocket();

  useEffect(() => {
    const fetchCoords = async () => {
      if (booking.pickup) {
        const p = await geocodeAddress(booking.pickup);
        setPickupCoords(p);
      }
      if (booking.dropoff) {
        const d = await geocodeAddress(booking.dropoff);
        setDropoffCoords(d);
      }
    };
    fetchCoords();
  }, [booking.pickup, booking.dropoff]);

  // 🔥 REAL-TIME: Start location tracking and broadcasting
  useEffect(() => {
    // Set driver status to 'busy'
    const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const currentBooking = storedBookings.find((b: any) => b.id === booking.id);

    if (currentBooking && currentBooking.driverId) {
      const updatedDrivers = drivers.map((d: any) =>
        d.id === currentBooking.driverId ? { ...d, status: 'busy' } : d
      );
      localStorage.setItem('drivers', JSON.stringify(updatedDrivers));

      // Start watching driver location
      const watchId = watchPosition(
        (location) => {
          setDriverLocation([location.lat, location.lng]);

          // 🔥 EMIT REAL-TIME LOCATION UPDATE (every 5 seconds)
          emit(DRIVER_EVENTS.DRIVER_LOCATION_UPDATE, {
            driverId: currentBooking.driverId,
            bookingId: booking.id,
            lat: location.lat,
            lng: location.lng,
            timestamp: new Date().toISOString(),
            speed: location.speed,
            heading: location.heading,
          });

          console.log('📍 Location broadcasted:', location.lat, location.lng);
        },
        (error) => {
          console.error('Geolocation error:', error.message);
        }
      );

      if (watchId !== null) {
        setLocationWatchId(watchId);
      }
    }

    // Cleanup: Stop location tracking on unmount
    return () => {
      if (locationWatchId !== null) {
        clearWatch(locationWatchId);
      }
    };
  }, []);

  const stages: { key: TripStage; label: string; action: string }[] = [
    { key: 'accepted', label: 'Order Accepted', action: 'Start Journey to Pickup' },
    { key: 'reaching-pickup', label: 'Reaching Pickup Location', action: 'Mark Arrived at Pickup' },
    { key: 'at-pickup', label: 'At Pickup Location', action: 'Mark Goods Picked Up' },
    { key: 'picked-up', label: 'Goods Loaded', action: 'Start Journey to Dropoff' },
    { key: 'in-transit', label: 'In Transit to Dropoff', action: 'Mark Arrived at Dropoff' },
    { key: 'at-dropoff', label: 'At Dropoff Location', action: 'Mark Delivered' },
    { key: 'delivered', label: 'Delivered', action: 'Confirm Money Received' },
    { key: 'money-received', label: 'Trip Complete', action: 'Complete' },
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);
  const currentStage = stages[currentStageIndex];

  const handleNextStage = () => {
    if (stage === 'delivered') {
      setShowMoneyConfirm(true);
      return;
    }

    if (stage === 'money-received') {
      onComplete();
      return;
    }

    const nextIndex = currentStageIndex + 1;
    if (nextIndex < stages.length) {
      const nextStage = stages[nextIndex].key;
      setStage(nextStage);

      // Update localStorage
      const statusMapping: Record<TripStage, string> = {
        'accepted': 'accepted',
        'reaching-pickup': 'en-route-pickup',
        'at-pickup': 'arrived-pickup',
        'picked-up': 'picked-up',
        'in-transit': 'en-route-dropoff',
        'at-dropoff': 'arrived-dropoff',
        'delivered': 'delivered',
        'money-received': 'completed'
      };

      const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedBookings = storedBookings.map((b: any) =>
        b.id === booking.id ? { ...b, status: statusMapping[nextStage] } : b
      );
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));

      // 🔥 EMIT REAL-TIME STATUS UPDATE
      emit(BOOKING_EVENTS.BOOKING_STATUS_UPDATE, {
        bookingId: booking.id,
        tripId: booking.id,
        status: statusMapping[nextStage],
        timestamp: new Date().toISOString(),
      });

      console.log('🚀 Trip status updated and broadcasted:', statusMapping[nextStage]);
    }
  };

  const handleMoneyReceived = () => {
    setShowMoneyConfirm(false);
    setStage('money-received');

    // Update localStorage to completed
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updatedBookings = storedBookings.map((b: any) =>
      b.id === booking.id ? { ...b, status: 'completed' } : b
    );
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    // Set Driver back to ONLINE
    const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
    const currentBooking = storedBookings.find((b: any) => b.id === booking.id);
    if (currentBooking && currentBooking.driverId) {
      const updatedDrivers = drivers.map((d: any) =>
        d.id === currentBooking.driverId ? { ...d, status: 'online' } : d
      );
      localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
    }

    onComplete();
  };

  const getStageColor = (stageKey: TripStage) => {
    const index = stages.findIndex(s => s.key === stageKey);
    if (index < currentStageIndex) return 'bg-green-500';
    if (index === currentStageIndex) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Money Received Confirmation Modal */}
      {showMoneyConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Cash Received</h3>
              <p className="text-gray-600">Have you received ₹{booking.payment} in cash from the customer?</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Cash Amount</span>
                <span className="text-2xl font-bold text-green-600">₹{booking.payment}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowMoneyConfirm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleMoneyReceived}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Yes, Money Received
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Active Trip</h2>
            <p className="text-gray-600">Booking #{booking.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Payment</p>
            <p className="text-2xl font-bold text-green-600">₹{booking.payment}</p>
            <p className="text-xs text-gray-500">Cash on Delivery</p>
          </div>
        </div>

        {/* Current Stage Indicator */}
        <div className={`${getStageColor(stage)} text-white px-4 py-3 rounded-lg text-center`}>
          <p className="text-lg font-semibold">{currentStage.label}</p>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Trip Progress</h3>
        <div className="space-y-3">
          {stages.map((s, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isPending = index > currentStageIndex;

            return (
              <div key={s.key} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white text-sm">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`${isCurrent ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                    {s.label}
                  </p>
                </div>
                {isCompleted && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Location</h3>
          <Button
            onClick={() => setShowMap(!showMap)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Map className="w-4 h-4" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>

        {showMap && (
          <div className="bg-gray-100 rounded-lg h-64 overflow-hidden mb-4 border border-gray-200">
            <TamilNaduMap
              pickup={pickupCoords}
              dropoff={dropoffCoords}
              driverLocation={driverLocation}
              height="100%"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <MapPin className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600 mb-1">Pickup Location</p>
              <p className="text-gray-800 font-medium">{booking.pickup}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
            <Navigation className="w-5 h-5 text-red-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600 mb-1">Dropoff Location</p>
              <p className="text-gray-800 font-medium">{booking.dropoff}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Customer Details</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Customer Name</p>
            <p className="text-gray-800 font-medium">{booking.customer}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Contact Customer</p>
            <a
              href={`tel:${booking.customerPhone}`}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors justify-center"
            >
              <Phone className="w-5 h-5" />
              Call {booking.customerPhone}
            </a>
            <p className="text-xs text-gray-500 mt-1 text-center">Dummy phone number for demo</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="text-gray-800 font-medium">{booking.weight}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Distance</p>
                <p className="text-gray-800 font-medium">{booking.distance} km</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-gray-800 font-medium">{booking.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {stage !== 'money-received' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Button
            onClick={handleNextStage}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
          >
            {currentStage.action}
          </Button>
        </div>
      )}

      {stage === 'money-received' && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Trip Completed Successfully!</h3>
            <p className="text-green-700 mb-4">Cash payment of ₹{booking.payment} received</p>
            <Button
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              Back to Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
