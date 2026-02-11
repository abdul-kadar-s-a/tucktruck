import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Truck, Clock, Star, ChevronRight, X, Sparkles, Package } from 'lucide-react';
import AppLayout from '../shared/AppLayout';
import MainMap from '../shared/MainMap';

interface ZomatoBookVehicleProps {
    user: any;
}

const vehicles = [
    {
        id: 'mini-truck',
        name: 'Mini Truck',
        capacity: '1 Ton',
        rate: 15,
        emoji: '🚚',
        description: 'Perfect for small loads',
        rating: 4.8,
        trips: '2.5k+',
        eta: '5 mins',
        color: 'from-orange-400 to-red-500'
    },
    {
        id: 'pickup',
        name: 'Pickup Van',
        capacity: '750 Kg',
        rate: 12,
        emoji: '🛻',
        description: 'Quick city delivery',
        rating: 4.9,
        trips: '3.2k+',
        eta: '3 mins',
        color: 'from-blue-400 to-indigo-500'
    },
    {
        id: 'large-truck',
        name: 'Large Truck',
        capacity: '3 Ton',
        rate: 25,
        emoji: '🚛',
        description: 'Heavy cargo specialist',
        rating: 4.7,
        trips: '1.8k+',
        eta: '8 mins',
        color: 'from-purple-400 to-pink-500'
    },
    {
        id: 'tempo',
        name: 'Tempo',
        capacity: '500 Kg',
        rate: 10,
        emoji: '🚐',
        description: 'Express city delivery',
        rating: 4.9,
        trips: '4.1k+',
        eta: '2 mins',
        color: 'from-green-400 to-teal-500'
    }
];

const ZomatoBookVehicle: React.FC<ZomatoBookVehicleProps> = ({ user }) => {
    const [step, setStep] = useState<'location' | 'vehicle' | 'confirm'>('location');
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [showDetails, setShowDetails] = useState(false);

    const handleLocationSubmit = () => {
        if (pickup && dropoff) {
            setStep('vehicle');
        }
    };

    const handleVehicleSelect = (vehicle: any) => {
        setSelectedVehicle(vehicle);
        setShowDetails(true);
    };

    const handleConfirmBooking = () => {
        setStep('confirm');
        // Integrate with your existing booking logic here
        console.log('Booking confirmed:', { pickup, dropoff, vehicle: selectedVehicle });
    };

    return (
        <AppLayout>
            {/* Full Screen Map */}
            <MainMap />

            {/* Zomato-Style Header */}
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white shadow-2xl"
            >
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white rounded-full p-2">
                            <Package className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">TuckTruck</h1>
                            <p className="text-xs opacity-90">Fast & Reliable Delivery</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-semibold">{user.name}</span>
                    </div>
                </div>
            </motion.div>

            {/* Location Input Step */}
            <AnimatePresence>
                {step === 'location' && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            {/* Drag Handle */}
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Where to?</h2>
                            <p className="text-gray-500 mb-6">Enter your pickup and delivery locations</p>

                            {/* Pickup Location */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Pickup Location
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                                    <input
                                        type="text"
                                        value={pickup}
                                        onChange={(e) => setPickup(e.target.value)}
                                        placeholder="Enter pickup address"
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:outline-none text-gray-900 font-medium transition-all"
                                    />
                                </div>
                            </div>

                            {/* Dropoff Location */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Dropoff Location
                                </label>
                                <div className="relative">
                                    <Navigation className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                                    <input
                                        type="text"
                                        value={dropoff}
                                        onChange={(e) => setDropoff(e.target.value)}
                                        placeholder="Enter delivery address"
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:outline-none text-gray-900 font-medium transition-all"
                                    />
                                </div>
                            </div>

                            {/* Continue Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLocationSubmit}
                                disabled={!pickup || !dropoff}
                                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${pickup && dropoff
                                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-xl'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Find Vehicles
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vehicle Selection Step */}
            <AnimatePresence>
                {step === 'vehicle' && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            {/* Drag Handle */}
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Choose Vehicle</h2>
                                    <p className="text-sm text-gray-500">{pickup} → {dropoff}</p>
                                </div>
                                <button
                                    onClick={() => setStep('location')}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>

                            {/* Vehicle Cards */}
                            <div className="space-y-4">
                                {vehicles.map((vehicle, index) => (
                                    <motion.div
                                        key={vehicle.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleVehicleSelect(vehicle)}
                                        className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all shadow-md hover:shadow-xl ${selectedVehicle?.id === vehicle.id ? 'ring-4 ring-red-500' : ''
                                            }`}
                                    >
                                        {/* Gradient Background */}
                                        <div className={`absolute inset-0 bg-gradient-to-r ${vehicle.color} opacity-10`}></div>

                                        <div className="relative p-5 flex items-center gap-4">
                                            {/* Vehicle Emoji */}
                                            <div className="text-5xl">{vehicle.emoji}</div>

                                            {/* Vehicle Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-bold text-gray-900">{vehicle.name}</h3>
                                                    <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full">
                                                        <Star className="w-3 h-3 text-green-600 fill-green-600" />
                                                        <span className="text-xs font-semibold text-green-700">{vehicle.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{vehicle.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Package className="w-3 h-3" />
                                                        {vehicle.capacity}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {vehicle.eta} away
                                                    </span>
                                                    <span>{vehicle.trips} trips</span>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-gray-900">₹{vehicle.rate}</p>
                                                <p className="text-xs text-gray-500">per km</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Confirm Button */}
                            {selectedVehicle && (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleConfirmBooking}
                                    className="w-full mt-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                                >
                                    Book {selectedVehicle.name} - ₹{selectedVehicle.rate}/km
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirmation Step */}
            <AnimatePresence>
                {step === 'confirm' && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                >
                                    ✓
                                </motion.div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                            <p className="text-gray-600 mb-6">
                                Your {selectedVehicle?.name} is on the way
                            </p>
                            <button
                                onClick={() => setStep('location')}
                                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold"
                            >
                                Track Booking
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AppLayout>
    );
};

export default ZomatoBookVehicle;
