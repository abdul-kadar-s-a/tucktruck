import { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, Phone, Eye, AlertCircle } from 'lucide-react';
import { User } from '../../App';
import { TamilNaduMap } from '../shared/TamilNaduMap';
import { geocodeAddress } from '../../utils/locationService';

interface Booking {
  id: string;
  customer: string;
  customerPhone: string;
  driver: string | null;
  driverPhone: string | null;
  pickup: string;
  dropoff: string;
  amount: number;
  status: 'pending' | 'assigned' | 'in-transit' | 'completed' | 'cancelled';
  date: string;
  vehicleType: string;
  driverId?: string;
}

const mockBookings: Booking[] = [
  {
    id: 'BK123456',
    customer: 'Amit Patel',
    customerPhone: '+91 9876543210',
    driver: 'Rajesh Kumar (DR001)',
    driverPhone: '+91 9876543210',
    pickup: 'Mumbai Central, Station Road',
    dropoff: 'Andheri West, SV Road',
    amount: 450,
    status: 'in-transit',
    date: '2025-12-01 10:00 AM',
    vehicleType: 'Tata Ace',
  },
  {
    id: 'BK123457',
    customer: 'Priya Sharma',
    customerPhone: '+91 9876543211',
    driver: null,
    driverPhone: null,
    pickup: 'Thane West, Ghodbunder Road',
    dropoff: 'Navi Mumbai, Vashi',
    amount: 680,
    status: 'pending',
    date: '2025-12-01 02:00 PM',
    vehicleType: 'Eicher 14 Feet',
  },
  {
    id: 'BK123458',
    customer: 'Rahul Desai',
    customerPhone: '+91 9876543212',
    driver: 'Suresh Patil (DR002)',
    driverPhone: '+91 9876543211',
    pickup: 'Bandra West, Linking Road',
    dropoff: 'Powai, Hiranandani',
    amount: 550,
    status: 'completed',
    date: '2025-11-30 09:00 AM',
    vehicleType: 'Mahindra Pickup',
  },
  {
    id: 'BK123459',
    customer: 'Sneha Kulkarni',
    customerPhone: '+91 9876543213',
    driver: 'Amit Sharma (DR003)',
    driverPhone: '+91 9876543212',
    pickup: 'Dadar East, Mumbai',
    dropoff: 'Goregaon East, Mumbai',
    amount: 720,
    status: 'assigned',
    date: '2025-12-01 11:00 AM',
    vehicleType: 'Tata 407',
  },
  {
    id: 'BK123460',
    customer: 'Vikram Singh',
    customerPhone: '+91 9876543214',
    driver: null,
    driverPhone: null,
    pickup: 'Kurla West, LBS Marg',
    dropoff: 'Mulund West, Mumbai',
    amount: 420,
    status: 'cancelled',
    date: '2025-11-29 03:00 PM',
    vehicleType: 'Ashok Leyland Dost',
  },
];

const getStoredBookings = () => {
  const stored = localStorage.getItem('bookings');
  return stored ? JSON.parse(stored) : [];
};

export function ManageBookings({ user }: { user: User }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    return getStoredBookings();
  });

  // Poll for booking updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBookings(prev => {
        const newData = getStoredBookings();
        if (JSON.stringify(prev) !== JSON.stringify(newData)) {
          return newData;
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'assigned' | 'in-transit' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [mapCoords, setMapCoords] = useState<{ pickup: [number, number], dropoff: [number, number] } | null>(null);

  useEffect(() => {
    const fetchCoords = async () => {
      if (selectedBooking) {
        let pickup: [number, number] = [11.1271, 78.6569];
        let dropoff: [number, number] = [13.0827, 80.2707];

        if (selectedBooking.pickup) pickup = await geocodeAddress(selectedBooking.pickup);
        if (selectedBooking.dropoff) dropoff = await geocodeAddress(selectedBooking.dropoff);

        setMapCoords({ pickup, dropoff });
      } else {
        setMapCoords(null);
      }
    };
    fetchCoords();
  }, [selectedBooking]);
  const [bookingToAssign, setBookingToAssign] = useState<Booking | null>(null);

  // Mock available drivers or fetch from localStorage
  const getAvailableDrivers = () => {
    const stored = localStorage.getItem('drivers');
    const allDrivers = stored ? JSON.parse(stored) : [];
    // Just return all drivers for now, or filter by 'online' status
    return allDrivers.filter((d: any) => d.status === 'online');
  };

  const availableDrivers = getAvailableDrivers();

  const handleAssignDriver = (driver: any) => {
    if (!bookingToAssign) return;

    // Update the booking in local state
    // In a real app, this would be an API call
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingToAssign.id) {
        return {
          ...b,
          driver: `${driver.name} (${driver.id})`,
          driverPhone: driver.phone,
          driverId: driver.id,
          status: 'assigned' as const
        };
      }
      return b;
    });

    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    setShowAssignModal(false);
    setBookingToAssign(null);
    alert(`Driver ${driver.name} assigned to booking ${bookingToAssign.id}`);
  };

  const filteredBookings = bookings.filter((booking) => {
    // If user is a driver, only show their assigned bookings
    if (user.type === 'driver' && booking.driverId !== user.id) { // Ensure user has id
      return false;
    }

    const matchesSearch = booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') {
      return matchesSearch;
    }
    return matchesSearch && booking.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'assigned': 'bg-purple-100 text-purple-700',
      'in-transit': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-800 mb-2">Manage Bookings</h2>
          <p className="text-gray-600">Monitor and manage all platform bookings</p>
        </div>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete all bookings? This cannot be undone.')) {
              localStorage.removeItem('bookings');
              setBookings([]);
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        >
          Clear History
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search by booking ID or customer name..."
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {(['all', 'pending', 'assigned', 'in-transit', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${filterStatus === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-800">Booking #{booking.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  <p className="text-gray-600">{booking.vehicleType}</p>
                  <p className="text-sm text-gray-500 mt-1">{booking.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-gray-800">₹{booking.amount}</p>
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Customer</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-800">{booking.customer}</p>
                      <p className="text-sm text-gray-600">{booking.customerPhone}</p>
                    </div>
                    <a
                      href={`tel:${booking.customerPhone}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Driver</p>
                  {booking.driver ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-800">{booking.driver}</p>
                        <p className="text-sm text-gray-600">{booking.driverPhone}</p>
                      </div>
                      <a
                        href={`tel:${booking.driverPhone}`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <p className="text-gray-600">Not assigned yet</p>
                      <button
                        onClick={() => {
                          setBookingToAssign(booking);
                          setShowAssignModal(true);
                        }}
                        className="ml-auto px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                        Assign Driver
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-800">Booking Details</h3>
                <p className="text-gray-600">#{selectedBooking.id}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="text-gray-800">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedBooking.status)}`}>
                    {getStatusLabel(selectedBooking.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="text-gray-800">{selectedBooking.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-gray-800">₹{selectedBooking.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type</p>
                  <p className="text-gray-800">{selectedBooking.vehicleType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="text-gray-800">Cash on Delivery</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-gray-800 mb-3 font-semibold">Route Information</h4>

                {mapCoords && (
                  <div className="mb-4 h-48 rounded-lg overflow-hidden border border-gray-200">
                    <TamilNaduMap
                      pickup={mapCoords.pickup}
                      dropoff={mapCoords.dropoff}
                      height="100%"
                      zoom={8}
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="text-gray-800">{selectedBooking.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-red-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Drop-off Location</p>
                      <p className="text-gray-800">{selectedBooking.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-gray-800 mb-3">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Customer</p>
                    <p className="text-gray-800">{selectedBooking.customer}</p>
                    <p className="text-sm text-gray-600">{selectedBooking.customerPhone}</p>
                    <a
                      href={`tel:${selectedBooking.customerPhone}`}
                      className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-700"
                    >
                      <Phone className="w-4 h-4" />
                      Call Customer
                    </a>
                  </div>
                  {selectedBooking.driver && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Driver</p>
                      <p className="text-gray-800">{selectedBooking.driver}</p>
                      <p className="text-sm text-gray-600">{selectedBooking.driverPhone}</p>
                      <a
                        href={`tel:${selectedBooking.driverPhone}`}
                        className="inline-flex items-center gap-2 mt-2 text-green-600 hover:text-green-700"
                      >
                        <Phone className="w-4 h-4" />
                        Call Driver
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Assign Driver Modal */}
      {showAssignModal && bookingToAssign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800 font-bold">Assign Driver</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <div className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100">✕</div>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Selecting driver for Booking <span className="font-mono font-bold">{bookingToAssign.id}</span></p>
              <p className="text-xs text-gray-500 mt-1">Pickup: {bookingToAssign.pickup}</p>
            </div>

            <div className="space-y-3">
              {availableDrivers.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No online drivers available</p>
              ) : (
                availableDrivers.map((driver: any) => (
                  <div key={driver.id} className="border border-gray-200 rounded-lg p-3 hover:bg-purple-50 hover:border-purple-200 transition-colors cursor-pointer" onClick={() => handleAssignDriver(driver)}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{driver.name}</p>
                        <p className="text-xs text-gray-500">{driver.vehicle} • {driver.vehicleNo}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Online</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
