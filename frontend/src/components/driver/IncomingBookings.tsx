import { useState, useEffect } from 'react';
import { MapPin, Package, DollarSign, Clock, Phone, X, CheckCircle } from 'lucide-react';
import { User } from '../../App';

interface IncomingBookingProps {
  user: User;
  onAccept?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
}

interface BookingRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  estimatedFare: number;
  vehicleType: string;
  timestamp: string;
}

const mockRequests: BookingRequest[] = [
  {
    id: 'REQ001',
    customerId: 'CUST123',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43210',
    pickupAddress: 'Trichy Central Bus Stand, Trichy - 620001',
    dropoffAddress: 'Anna Salai, Chennai - 600002',
    distance: 15.5,
    estimatedFare: 750,
    vehicleType: 'Tata Ace',
    timestamp: new Date().toISOString(),
  },
];

export function IncomingBookings({ user, onAccept, onReject }: IncomingBookingProps) {
  const [requests, setRequests] = useState<BookingRequest[]>(mockRequests);
  const [showModal, setShowModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<BookingRequest | null>(null);

  useEffect(() => {
    // Check if new requests exist
    if (requests.length > 0 && !currentRequest) {
      setCurrentRequest(requests[0]);
      setShowModal(true);
      vibratePhone();
      playNotificationSound();
    }
  }, [requests, currentRequest]);

  const vibratePhone = () => {
    // Vibrate phone if supported
    if ('vibrate' in navigator) {
      // Vibrate pattern: vibrate 300ms, pause 100ms, vibrate 300ms, pause 100ms, vibrate 300ms
      navigator.vibrate([300, 100, 300, 100, 300]);
    }
  };

  const playNotificationSound = () => {
    // Play notification sound (in real app, use actual audio file)
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio notification not supported');
    }
  };

  const handleAccept = () => {
    if (currentRequest) {
      alert(`Booking ${currentRequest.id} accepted! Customer will be notified.`);
      onAccept?.(currentRequest.id);
      setRequests(requests.filter(r => r.id !== currentRequest.id));
      setShowModal(false);
      setCurrentRequest(null);
    }
  };

  const handleReject = () => {
    if (currentRequest) {
      if (confirm('Are you sure you want to reject this booking?')) {
        alert(`Booking ${currentRequest.id} rejected.`);
        onReject?.(currentRequest.id);
        setRequests(requests.filter(r => r.id !== currentRequest.id));
        setShowModal(false);
        setCurrentRequest(null);
      }
    }
  };

  const handleCallCustomer = (phone: string) => {
    alert(`Calling customer: ${phone}`);
    window.location.href = `tel:${phone}`;
  };

  if (!showModal || !currentRequest) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No pending booking requests</p>
        <p className="text-sm text-gray-500 mt-2">You'll be notified when new bookings arrive</p>
      </div>
    );
  }

  const timeAgo = () => {
    const now = new Date();
    const timestamp = new Date(currentRequest.timestamp);
    const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-white bg-opacity-20 rounded-full p-2 animate-pulse">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-xl">New Booking Request!</h3>
            </div>
            <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
              {timeAgo()}
            </span>
          </div>
          <p className="text-sm opacity-90">Booking ID: {currentRequest.id}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-2">Customer Details</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 font-medium">{currentRequest.customerName}</p>
                <p className="text-sm text-gray-600">{currentRequest.customerPhone}</p>
              </div>
              <button
                onClick={() => handleCallCustomer(currentRequest.customerPhone)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-2 mt-1">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Pickup Location</p>
                <p className="text-gray-800">{currentRequest.pickupAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-red-100 rounded-full p-2 mt-1">
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Drop-off Location</p>
                <p className="text-gray-800">{currentRequest.dropoffAddress}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Vehicle</p>
              <p className="text-sm text-gray-800 font-medium">{currentRequest.vehicleType}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Distance</p>
              <p className="text-sm text-gray-800 font-medium">{currentRequest.distance} km</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Fare</p>
              <p className="text-sm text-gray-800 font-medium">₹{currentRequest.estimatedFare}</p>
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              ⚠️ Please respond within 2 minutes or the request will be auto-cancelled
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={handleReject}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <X className="w-5 h-5" />
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Accept
          </button>
        </div>

        {/* Queue Info */}
        {requests.length > 1 && (
          <div className="px-6 pb-4 text-center">
            <p className="text-sm text-gray-600">
              {requests.length - 1} more request{requests.length > 2 ? 's' : ''} in queue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
