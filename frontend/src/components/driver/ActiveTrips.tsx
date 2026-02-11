import { useState } from 'react';
import { MapPin, Navigation, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { User } from '../../App';

interface ActiveTripsProps {
  user: User;
}

interface Trip {
  id: string;
  customer: string;
  customerPhone: string;
  pickup: string;
  dropoff: string;
  amount: number;
  weight: string;
  description: string;
  status: 'en-route-pickup' | 'arrived-pickup' | 'picked-up' | 'en-route-dropoff' | 'arrived-dropoff';
}

const mockTrips: Trip[] = [
  {
    id: 'BK123456',
    customer: 'Amit Patel',
    customerPhone: '+91 9876543210',
    pickup: 'Mumbai Central, Station Road, Mumbai - 400008',
    dropoff: 'Andheri West, SV Road, Mumbai - 400058',
    amount: 450,
    weight: '500 kg',
    description: 'Furniture items - Handle with care',
    status: 'picked-up',
  },
];

export function ActiveTrips({ user }: ActiveTripsProps) {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);

  const updateTripStatus = (tripId: string, newStatus: Trip['status']) => {
    setTrips(trips.map(trip => 
      trip.id === tripId ? { ...trip, status: newStatus } : trip
    ));
  };

  const completeTrip = (tripId: string) => {
    if (confirm('Are you sure you want to mark this trip as delivered?')) {
      setTrips(trips.filter(trip => trip.id !== tripId));
      alert('Trip completed successfully! Payment will be processed.');
    }
  };

  const cancelTrip = (tripId: string) => {
    if (confirm('Are you sure you want to cancel this trip? Please contact admin for assistance.')) {
      // In real app, this would contact admin
      alert('Cancellation request sent to admin. You will be contacted shortly.');
    }
  };

  const getStatusInfo = (status: Trip['status']) => {
    const statusMap = {
      'en-route-pickup': { text: 'En Route to Pickup', color: 'bg-blue-100 text-blue-700', next: 'arrived-pickup' as const, action: 'Reached Pickup' },
      'arrived-pickup': { text: 'Arrived at Pickup', color: 'bg-yellow-100 text-yellow-700', next: 'picked-up' as const, action: 'Goods Picked Up' },
      'picked-up': { text: 'Goods Picked Up', color: 'bg-green-100 text-green-700', next: 'en-route-dropoff' as const, action: 'Start to Dropoff' },
      'en-route-dropoff': { text: 'En Route to Dropoff', color: 'bg-blue-100 text-blue-700', next: 'arrived-dropoff' as const, action: 'Reached Dropoff' },
      'arrived-dropoff': { text: 'Arrived at Dropoff', color: 'bg-yellow-100 text-yellow-700', next: null, action: 'Mark as Delivered' },
    };
    return statusMap[status];
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-800 mb-2">Active Trips</h2>
        <p className="text-gray-600">Manage your ongoing deliveries</p>
      </div>

      {trips.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-800 mb-2">No Active Trips</h3>
          <p className="text-gray-500">You don't have any active trips at the moment</p>
        </div>
      ) : (
        <div className="space-y-6">
          {trips.map((trip) => {
            const statusInfo = getStatusInfo(trip.status);
            
            return (
              <div key={trip.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="mb-1">Trip #{trip.id}</h3>
                      <p className="opacity-90">Customer: {trip.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl">₹{trip.amount}</p>
                    </div>
                  </div>
                  <span className={`inline-block px-4 py-2 rounded-full ${statusInfo.color} bg-opacity-20 text-white border border-white border-opacity-30`}>
                    {statusInfo.text}
                  </span>
                </div>

                {/* Map */}
                <div className="h-64 bg-gray-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160992848!2d72.71637244999999!3d19.08219785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1638880000000!5m2!1sen!2sin"
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>

                {/* Trip Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 rounded-full p-2 mt-1">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Pickup Location</p>
                          <p className="text-gray-800">{trip.pickup}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-red-100 rounded-full p-2 mt-1">
                          <Navigation className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Drop-off Location</p>
                          <p className="text-gray-800">{trip.dropoff}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-2">Customer Contact</p>
                        <p className="text-gray-800 mb-3">{trip.customerPhone}</p>
                        <a
                          href={`tel:${trip.customerPhone}`}
                          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          Call Customer
                        </a>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Weight</p>
                            <p className="text-gray-800">{trip.weight}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payment</p>
                            <p className="text-gray-800">₹{trip.amount}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="text-gray-800">{trip.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {statusInfo.next ? (
                      <button
                        onClick={() => updateTripStatus(trip.id, statusInfo.next!)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        {statusInfo.action}
                      </button>
                    ) : (
                      <button
                        onClick={() => completeTrip(trip.id)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Mark as Delivered
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Open in Maps
                      </button>
                      <button
                        onClick={() => cancelTrip(trip.id)}
                        className="border-2 border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Report Issue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
