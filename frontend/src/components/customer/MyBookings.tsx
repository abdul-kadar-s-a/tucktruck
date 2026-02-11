import { useState } from 'react';
import { Package, MapPin, Navigation, Calendar, DollarSign, Star, Phone, Map as MapIcon, X } from 'lucide-react';
import { User } from '../../App';
import { LiveTrackingMap } from '../shared/LiveTrackingMap';
import { geocodeAddress } from '../../utils/locationService';

interface MyBookingsProps {
  user: User;
}



export function MyBookings({ user }: MyBookingsProps) {
  const [filter, setFilter] = useState<'all' | 'in-transit' | 'scheduled' | 'completed' | 'cancelled'>('all');

  // Load bookings from localStorage
  const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  // Simple filter by customer name or phone since we don't always have ID in the booking object properties shown in BookVehicle
  // better to match by name as a simple fallback
  const myBookings = allBookings.filter((b: any) =>
    b.customer === user.name || b.customerPhone === user.phone
  );

  const filteredBookings = filter === 'all'
    ? myBookings
    : myBookings.filter((b: any) => b.status === filter);

  const getStatusColor = (status: string) => {
    const colors = {
      'in-transit': 'bg-blue-100 text-blue-700',
      'scheduled': 'bg-purple-100 text-purple-700',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'in-transit': 'In Transit',
      'scheduled': 'Scheduled',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedBookingForMap, setSelectedBookingForMap] = useState<any>(null);
  const [mapCoords, setMapCoords] = useState<{ pickup: [number, number], dropoff: [number, number] } | null>(null);

  const handleShowMap = async (booking: any) => {
    setSelectedBookingForMap(booking);

    // Geocode locations
    let pickup: [number, number] = [11.1271, 78.6569];
    let dropoff: [number, number] = [13.0827, 80.2707];

    if (booking.pickup) pickup = await geocodeAddress(booking.pickup);
    if (booking.dropoff) dropoff = await geocodeAddress(booking.dropoff);

    setMapCoords({ pickup, dropoff });
    setShowMapModal(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-800 mb-4">My Bookings</h2>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'in-transit', 'scheduled', 'completed', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking: any) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-800">Booking #{booking.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  <p className="text-gray-600">{booking.vehicleType || booking.vehicle}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-gray-800">₹{booking.amount}</p>
                </div>
              </div>

              {/* Route Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="text-gray-800">{booking.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Drop-off</p>
                    <p className="text-gray-800">{booking.dropoff}</p>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{booking.date} at {booking.time}</span>
              </div>

              {/* Driver Info */}
              {(booking.driver || booking.driverId) && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Driver</p>
                      <p className="text-gray-800">
                        {typeof booking.driver === 'string' ? booking.driver : booking.driver?.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {/* Mock rating if not available */}
                          {booking.driver?.rating || '4.8'}
                        </span>
                      </div>
                    </div>

                    {booking.status === 'in-transit' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleShowMap(booking)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                        >
                          <MapIcon className="w-4 h-4" />
                          View Map
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Call Driver
                        </button>
                      </div>
                    )}

                    {booking.status === 'completed' && booking.userRating && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Your rating:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= booking.userRating!
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {booking.status === 'scheduled' && (
                <div className="border-t border-gray-200 pt-4 mt-4 flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Modify Booking
                  </button>
                  <button className="flex-1 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50">
                    Cancel Booking
                  </button>
                </div>
              )}

              {booking.status === 'completed' && !booking.userRating && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <button className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                    Rate this Booking
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Map Modal */}
      {
        showMapModal && selectedBookingForMap && mapCoords && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="font-bold text-gray-800">Live Tracking</h3>
                  <p className="text-sm text-gray-500">Booking #{selectedBookingForMap.id}</p>
                </div>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <div className="p-0">
                <LiveTrackingMap
                  bookingId={selectedBookingForMap.id}
                  pickup={mapCoords.pickup}
                  dropoff={mapCoords.dropoff}
                  driverId={selectedBookingForMap.driverId}
                  status={selectedBookingForMap.status}
                  height="500px"
                />
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
