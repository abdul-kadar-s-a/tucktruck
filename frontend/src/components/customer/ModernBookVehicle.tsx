import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Search } from 'lucide-react';
import AppLayout from '../shared/AppLayout';
import MainMap from '../shared/MainMap';
import RideSelectorSheet from './RideSelectorSheet';

interface ModernBookVehicleProps {
    user: any;
}

const ModernBookVehicle: React.FC<ModernBookVehicleProps> = ({ user }) => {
    const [showVehicleSelector, setShowVehicleSelector] = useState(false);
    const [pickupLocation, setPickupLocation] = useState<[number, number] | undefined>();
    const [dropoffLocation, setDropoffLocation] = useState<[number, number] | undefined>();
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');

    const handleSelectVehicle = (vehicle: any) => {
        console.log('Selected vehicle:', vehicle);
        // Here you can integrate with your existing booking logic
    };

    return (
        <AppLayout>
            {/* Full Screen Map */}
            <MainMap
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
            />

            {/* Top Search Bar */}
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                style={{
                    position: 'fixed',
                    top: 20,
                    left: 20,
                    right: 20,
                    zIndex: 900,
                    background: 'white',
                    borderRadius: 16,
                    padding: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
            >
                {/* Pickup Input */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 12,
                    padding: 12,
                    background: '#f5f5f5',
                    borderRadius: 12
                }}>
                    <MapPin size={20} color="#FFC107" />
                    <input
                        type="text"
                        placeholder="Enter pickup location"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        style={{
                            flex: 1,
                            border: 'none',
                            background: 'transparent',
                            fontSize: 16,
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Dropoff Input */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    background: '#f5f5f5',
                    borderRadius: 12
                }}>
                    <Navigation size={20} color="#2e7d32" />
                    <input
                        type="text"
                        placeholder="Enter dropoff location"
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        style={{
                            flex: 1,
                            border: 'none',
                            background: 'transparent',
                            fontSize: 16,
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Search Button */}
                {pickup && dropoff && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowVehicleSelector(true)}
                        style={{
                            width: '100%',
                            marginTop: 12,
                            padding: 14,
                            background: '#FFC107',
                            border: 'none',
                            borderRadius: 12,
                            fontSize: 16,
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8
                        }}
                    >
                        <Search size={20} />
                        Find Vehicles
                    </motion.button>
                )}
            </motion.div>

            {/* Vehicle Selector Bottom Sheet */}
            <RideSelectorSheet
                open={showVehicleSelector}
                onClose={() => setShowVehicleSelector(false)}
                onSelectVehicle={handleSelectVehicle}
            />
        </AppLayout>
    );
};

export default ModernBookVehicle;
