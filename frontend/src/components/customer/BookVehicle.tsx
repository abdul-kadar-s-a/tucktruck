import { useState, useEffect } from 'react';
import { MapPin, Navigation, Package, DollarSign, TrendingUp, CreditCard, Smartphone, Wallet, Search, Clock, Star, Menu, ArrowLeft, ChevronRight, X } from 'lucide-react';
import { User } from '../../App';
import { TrackBooking } from './TrackBooking';
import { PaymentDetails } from './PaymentDetails';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { calculateTripCost, getDriverRate, TripCostBreakdown } from '../../utils/pricing';
import { TamilNaduMap } from '../shared/TamilNaduMap';
import { geocodeAddress } from '../../utils/locationService';
import { useSocket } from '../../hooks/useSocket';
import { BOOKING_EVENTS, DRIVER_EVENTS, BookingData } from '../../services/socketEvents';
import { LiveBookingNotification } from './LiveBookingNotification';
import { motion, AnimatePresence } from 'framer-motion';

interface BookVehicleProps {
  user: User;
}

interface VehicleType {
  id: string;
  name: string;
  type: string;
  capacity: string;
  size: string;
  baseRate: number;
  image: string;
  description: string;
  eta?: string;
  rating?: number;
}

const defaultVehicleTypes: VehicleType[] = [
  {
    id: '1',
    name: 'Prime Sedan',
    type: 'Sedan',
    capacity: '4 Person',
    size: 'Medium',
    baseRate: 15,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    description: 'Comfortable sedan for daily commute',
    eta: '2 min',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Auto',
    type: 'Auto Rickshaw',
    capacity: '3 Person',
    size: 'Small',
    baseRate: 10,
    image: 'https://images.unsplash.com/photo-1596423985392-12499d14143a?auto=format&fit=crop&w=800&q=80',
    description: 'Quick and affordable',
    eta: '3 min',
    rating: 4.5
  },
  {
    id: '3',
    name: 'Mini Truck',
    type: 'Tata Ace',
    capacity: '750 kg',
    size: 'Small',
    baseRate: 20,
    image: 'https://images.unsplash.com/photo-1586697827711-163e6142c145?auto=format&fit=crop&w=800&q=80',
    description: 'Perfect for small loads',
    eta: '5 min',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Pickup',
    type: 'Bolero Pickup',
    capacity: '1000 kg',
    size: 'Medium',
    baseRate: 25,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    description: 'For medium-sized goods',
    eta: '8 min',
    rating: 4.6
  },
];

export function BookVehicle({ user }: BookVehicleProps) {
  const [step, setStep] = useState<'select' | 'details' | 'confirm' | 'payment' | 'tracking'>('select');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    pickup: '',
    dropoff: '',
    weight: '',
    description: '',
    isFragile: false,
  });
  const [pickupCoords, setPickupCoords] = useState<[number, number] | undefined>(undefined);
  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card' | 'wallet'>('cod');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [costBreakdown, setCostBreakdown] = useState<TripCostBreakdown | null>(null);
  const [driverRate, setDriverRate] = useState(20);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>(defaultVehicleTypes);
  const [notification, setNotification] = useState<{
    type: 'driverAssigned' | 'driverAccepted' | 'driverArriving' | 'tripStarted' | 'tripCompleted';
    driverName?: string;
    vehicleType?: string;
    eta?: string;
  } | null>(null);

  // Initialize socket
  const { emit, on, off } = useSocket();

  // Initialize data
  useEffect(() => {
    // Basic initialization of vehicles (mock)
    // In a real app, logic to fetch driver availability would go here
  }, []);

  // Check for active bookings
  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const userActiveBooking = allBookings.find((b: any) =>
      b.customer === user.name &&
      !['completed', 'cancelled'].includes(b.status)
    );

    if (userActiveBooking) {
      setBookingId(userActiveBooking.id);
      const vehicleInfo = defaultVehicleTypes.find(v => v.name === userActiveBooking.vehicleType) || defaultVehicleTypes[0];
      setSelectedVehicle(vehicleInfo);
      setBookingDetails({
        pickup: userActiveBooking.pickup,
        dropoff: userActiveBooking.dropoff,
        weight: '',
        description: '',
        isFragile: false
      });
      setCostBreakdown({
        total: userActiveBooking.amount,
        distance: 0,
        baseRate: 0,
        baseFare: 0,
        tollCharges: 0,
        handlingFee: 0
      });
      setStep('tracking');
    }
  }, [user.name]);

  // Cost calculation
  useEffect(() => {
    if (bookingDetails.pickup && bookingDetails.dropoff && selectedVehicle) {
      const breakdown = calculateTripCost(
        bookingDetails.pickup,
        bookingDetails.dropoff,
        driverRate,
        bookingDetails.isFragile
      );
      setCostBreakdown(breakdown);
    }
  }, [bookingDetails.pickup, bookingDetails.dropoff, bookingDetails.isFragile, selectedVehicle, driverRate]);

  // Socket listeners
  useEffect(() => {
    on<BookingData>(DRIVER_EVENTS.DRIVER_ASSIGNED, (data) => {
      if (data.id === bookingId) {
        setNotification({
          type: 'driverAssigned',
          driverName: data.driver || 'A driver',
          vehicleType: data.vehicleType,
        });
      }
    });
    // ... other listeners
    return () => {
      off(DRIVER_EVENTS.DRIVER_ASSIGNED);
    };
  }, [bookingId, on, off]);

  const handleSelectVehicle = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    setDriverRate(vehicle.baseRate);
    // Don't change step immediately if we want to confirm details first
    // But for this UI, selecting a vehicle is part of the flow
  };

  const handleConfirm = () => {
    if (!bookingDetails.pickup || !bookingDetails.dropoff) {
      alert('Please enter pickup and dropoff locations');
      return;
    }
    setStep('confirm');
  };

  const createBooking = () => {
    const id = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const newBooking: BookingData = {
      id,
      customer: user.name,
      customerId: user.id,
      customerPhone: user.phone || '9999999999',
      driver: undefined,
      driverPhone: undefined,
      driverId: undefined,
      pickup: bookingDetails.pickup,
      dropoff: bookingDetails.dropoff,
      amount: costBreakdown?.total || 0,
      status: 'pending',
      date: new Date().toISOString(),
      vehicleType: selectedVehicle?.name || 'Unknown',
    };

    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, newBooking]));

    emit(BOOKING_EVENTS.CREATE_BOOKING, newBooking, (response: any) => { });
    setBookingId(id);
    setStep('tracking');
  };

  // Render Full Screen Layout
  return (
    <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-gray-100 font-sans">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <TamilNaduMap
          pickup={pickupCoords} // Pass undefined if not calculated yet
          dropoff={dropoffCoords} // Pass undefined if not calculated yet
          className="w-full h-full"
        />
      </div>

      {/* Top Floating Search Bar */}
      {step === 'select' && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="bg-white rounded-3xl shadow-xl p-4 animate-slide-down">
            <h2 className="text-xl font-bold text-gray-800 mb-3 px-1">Where are you going today?</h2>

            <div className="space-y-3">
              {/* Pickup */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                </div>
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  value={bookingDetails.pickup}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, pickup: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all placeholder-gray-400 font-medium text-gray-800"
                />
              </div>

              {/* Dropoff */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <input
                  type="text"
                  placeholder="Enter dropoff location"
                  value={bookingDetails.dropoff}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, dropoff: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:outline-none transition-all placeholder-gray-400 font-medium text-gray-800"
                />
              </div>
            </div>

            {/* Quick Suggestions (Optional) */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1 hide-scrollbar">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-yellow-50 rounded-full border border-gray-100 transition-colors shrink-0">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Recent</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-yellow-50 rounded-full border border-gray-100 transition-colors shrink-0">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Home</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-yellow-50 rounded-full border border-gray-100 transition-colors shrink-0">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Work</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area - Bottom Sheet */}
      <AnimatePresence>
        {step === 'select' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] overflow-hidden"
          >
            {/* Handle Bar */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
            </div>

            <div className="p-5 pb-8 min-h-[300px]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">Suggested rides</h3>

              {/* Horizontal Scrollable Vehicles */}
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar px-1">
                {vehicleTypes.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => handleSelectVehicle(vehicle)}
                    className={`relative min-w-[200px] p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 snap-center
                      ${selectedVehicle?.id === vehicle.id
                        ? 'bg-[#FFD700] border-[#FFD700] shadow-lg transform scale-105'
                        : 'bg-white border-gray-100 hover:border-yellow-200'}`}
                  >
                    <ImageWithFallback src={vehicle.image} alt={vehicle.name} className="w-28 h-20 object-contain mx-auto mb-2 mix-blend-multiply" />
                    <h4 className="font-bold text-lg text-gray-900 leading-tight">{vehicle.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{vehicle.capacity} ride</p>

                    <div className="flex items-end justify-between mt-2">
                      <div>
                        <p className="font-bold text-xl text-black">₹{bookingDetails.pickup && bookingDetails.dropoff ? ((costBreakdown?.distance || 5) * vehicle.baseRate).toFixed(0) : vehicle.baseRate + '/km'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold bg-white/50 px-2 py-1 rounded-full">{vehicle.eta}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Confirm Button */}
              {selectedVehicle && (
                <div className="mt-4 animate-fade-in-up">
                  <button
                    onClick={handleConfirm}
                    className="w-full py-4 bg-black text-white text-lg font-bold rounded-2xl hover:bg-gray-900 hover:shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Select {selectedVehicle.name}
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Confirmation Modal / Full Sheet */}
        {step === 'confirm' && selectedVehicle && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 bg-white"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 flex items-center gap-4 border-b border-gray-100">
                <button onClick={() => setStep('select')} className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-6 h-6 text-black" />
                </button>
                <h2 className="text-xl font-bold">Confirm Booking</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {/* Map Preview (Small) */}
                <div className="h-48 rounded-2xl overflow-hidden mb-6 relative">
                  <TamilNaduMap className="w-full h-full" />
                  <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                </div>

                {/* Address Details */}
                <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                  <div className="flex gap-4 mb-6 relative">
                    <div className="flex flex-col items-center pt-2 gap-1 absolute left-0 h-full">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-0.5 flex-1 bg-gray-300"></div>
                      <div className="w-3 h-3 rounded-full bg-black"></div>
                    </div>
                    <div className="pl-8 flex flex-col gap-6">
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pickup</p>
                        <p className="text-gray-900 font-semibold text-lg leading-tight">{bookingDetails.pickup || 'Select Pickup'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Dropoff</p>
                        <p className="text-gray-900 font-semibold text-lg leading-tight">{bookingDetails.dropoff || 'Select Dropoff'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Arrival</p>
                      <p className="font-bold text-gray-900">04:23 PM</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Distance</p>
                      <p className="font-bold text-gray-900">{costBreakdown?.distance || '4.7'} Km</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-xl shadow-sm border border-yellow-100 col-span-2">
                      <p className="text-xs text-yellow-700 mb-1">Total Price</p>
                      <p className="font-bold text-2xl text-black">₹{costBreakdown?.total.toFixed(0) || '0'}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Driver Preview */}
                <div className="flex items-center gap-4 bg-white border-2 border-gray-100 p-4 rounded-2xl mb-6">
                  <ImageWithFallback src={selectedVehicle.image} className="w-16 h-12 object-contain" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{selectedVehicle.name}</h4>
                    <p className="text-sm text-gray-500">{selectedVehicle.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-4 h-4 text-black fill-black" />
                      <span className="font-bold">{selectedVehicle.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">Ajay</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white">
                <button
                  onClick={createBooking}
                  className="w-full py-4 bg-black text-white text-lg font-bold rounded-2xl hover:bg-gray-900 hover:shadow-xl transform active:scale-95 transition-all"
                >
                  Confirm Ride
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tracking Booking Step */}
        {step === 'tracking' && bookingId && selectedVehicle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[60] bg-white text-black"
          >
            <button onClick={() => setStep('select')} className="absolute top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <TrackBooking
              bookingId={bookingId}
              vehicle={{
                name: selectedVehicle.name,
                type: selectedVehicle.type,
              }}
              pickup={bookingDetails.pickup}
              dropoff={bookingDetails.dropoff}
              driverName="Ajay"
              driverPhone="9876543210"
              amount={costBreakdown?.total || 0}
              onComplete={() => {
                setStep('select');
                setBookingId(null);
                setSelectedVehicle(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
