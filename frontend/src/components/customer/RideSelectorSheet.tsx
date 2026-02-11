import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Package, X } from 'lucide-react';

interface Vehicle {
    id: string;
    name: string;
    capacity: string;
    rate: number;
    icon: string;
    description: string;
}

interface RideSelectorSheetProps {
    open: boolean;
    onClose?: () => void;
    onSelectVehicle?: (vehicle: Vehicle) => void;
}

const vehicles: Vehicle[] = [
    {
        id: 'mini-truck',
        name: 'Mini Truck',
        capacity: '1 Ton',
        rate: 15,
        icon: '🚚',
        description: 'Perfect for small loads'
    },
    {
        id: 'pickup',
        name: 'Pickup',
        capacity: '750 Kg',
        rate: 12,
        icon: '🛻',
        description: 'Quick delivery'
    },
    {
        id: 'large-truck',
        name: 'Large Truck',
        capacity: '3 Ton',
        rate: 25,
        icon: '🚛',
        description: 'Heavy cargo'
    },
    {
        id: 'tempo',
        name: 'Tempo',
        capacity: '500 Kg',
        rate: 10,
        icon: '🚐',
        description: 'City delivery'
    }
];

const RideSelectorSheet: React.FC<RideSelectorSheetProps> = ({
    open,
    onClose,
    onSelectVehicle
}) => {
    const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

    const handleSelect = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle.id);
        if (onSelectVehicle) {
            onSelectVehicle(vehicle);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'black',
                            zIndex: 998
                        }}
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'white',
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            padding: '24px',
                            maxHeight: '70vh',
                            overflowY: 'auto',
                            zIndex: 999,
                            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 20
                        }}>
                            <h2 style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                margin: 0,
                                color: '#1a1a1a'
                            }}>
                                Select a Vehicle
                            </h2>
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: '#f5f5f5',
                                        border: 'none',
                                        borderRadius: 50,
                                        width: 36,
                                        height: 36,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {/* Vehicle Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: 16
                        }}>
                            {vehicles.map((vehicle) => (
                                <motion.div
                                    key={vehicle.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSelect(vehicle)}
                                    style={{
                                        background: selectedVehicle === vehicle.id ? '#FFD54F' : '#FFF9E6',
                                        border: selectedVehicle === vehicle.id ? '2px solid #FFC107' : '2px solid transparent',
                                        padding: 16,
                                        borderRadius: 16,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: selectedVehicle === vehicle.id
                                            ? '0 4px 12px rgba(255, 193, 7, 0.3)'
                                            : '0 2px 8px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <div style={{ fontSize: 40, marginBottom: 8 }}>
                                        {vehicle.icon}
                                    </div>
                                    <h4 style={{
                                        margin: '0 0 4px 0',
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: '#1a1a1a'
                                    }}>
                                        {vehicle.name}
                                    </h4>
                                    <p style={{
                                        margin: '0 0 8px 0',
                                        fontSize: 13,
                                        color: '#666'
                                    }}>
                                        {vehicle.capacity}
                                    </p>
                                    <p style={{
                                        margin: 0,
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: '#2e7d32'
                                    }}>
                                        ₹{vehicle.rate} / km
                                    </p>
                                    <p style={{
                                        margin: '4px 0 0 0',
                                        fontSize: 12,
                                        color: '#999'
                                    }}>
                                        {vehicle.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Confirm Button */}
                        {selectedVehicle && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    width: '100%',
                                    marginTop: 24,
                                    padding: '16px',
                                    background: '#FFC107',
                                    border: 'none',
                                    borderRadius: 12,
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: '#1a1a1a',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)'
                                }}
                            >
                                Continue with {vehicles.find(v => v.id === selectedVehicle)?.name}
                            </motion.button>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RideSelectorSheet;
