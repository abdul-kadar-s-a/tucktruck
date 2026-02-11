import { useEffect, useState } from 'react';
import { CheckCircle, Truck, MapPin, Clock, X } from 'lucide-react';

interface LiveBookingNotificationProps {
    type: 'driverAssigned' | 'driverAccepted' | 'driverArriving' | 'tripStarted' | 'tripCompleted';
    driverName?: string;
    vehicleType?: string;
    eta?: string;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDuration?: number;
}

export function LiveBookingNotification({
    type,
    driverName,
    vehicleType,
    eta,
    onClose,
    autoClose = true,
    autoCloseDuration = 5000,
}: LiveBookingNotificationProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Slide in animation
        setTimeout(() => setIsVisible(true), 100);

        // Auto close
        if (autoClose) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Wait for slide-out animation
            }, autoCloseDuration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, autoCloseDuration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const getNotificationContent = () => {
        switch (type) {
            case 'driverAssigned':
                return {
                    icon: <Truck className="w-6 h-6 text-blue-600" />,
                    title: 'Driver Assigned!',
                    message: `${driverName} will be your driver with ${vehicleType}`,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                };
            case 'driverAccepted':
                return {
                    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
                    title: 'Booking Accepted!',
                    message: `${driverName} has accepted your booking`,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                };
            case 'driverArriving':
                return {
                    icon: <MapPin className="w-6 h-6 text-orange-600" />,
                    title: 'Driver Arriving Soon',
                    message: `${driverName} is ${eta} away from pickup`,
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                };
            case 'tripStarted':
                return {
                    icon: <Clock className="w-6 h-6 text-purple-600" />,
                    title: 'Trip Started!',
                    message: 'Your goods are on the way',
                    bgColor: 'bg-purple-50',
                    borderColor: 'border-purple-200',
                };
            case 'tripCompleted':
                return {
                    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
                    title: 'Trip Completed!',
                    message: 'Your goods have been delivered successfully',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                };
            default:
                return {
                    icon: <CheckCircle className="w-6 h-6 text-gray-600" />,
                    title: 'Notification',
                    message: 'You have a new update',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                };
        }
    };

    const content = getNotificationContent();

    return (
        <div
            className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
        >
            <div
                className={`${content.bgColor} ${content.borderColor} border-2 rounded-xl shadow-lg p-4 max-w-sm flex items-start gap-3`}
            >
                <div className="flex-shrink-0 mt-0.5">{content.icon}</div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1">{content.title}</h4>
                    <p className="text-sm text-gray-600">{content.message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
