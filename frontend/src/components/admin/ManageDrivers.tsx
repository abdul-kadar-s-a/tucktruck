import { useState, useEffect } from 'react';
import { Search, Filter, Phone, Mail, Star, MapPin, CheckCircle, XCircle, Eye, DollarSign } from 'lucide-react';
import { getDriverRate } from '../../utils/pricing';
import { User } from '../../App';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  vehicleNo: string;
  rating: number;
  trips: number;
  status: 'online' | 'offline' | 'on-trip';
  zone: string;
  approved: boolean;
  address?: string;
  password?: string;
}

const getStoredDrivers = () => {
  const stored = localStorage.getItem('drivers');
  return stored ? JSON.parse(stored) : [];
};

const mockDrivers: Driver[] = [
  {
    id: 'DR001',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 9876543210',
    vehicle: 'Tata Ace',
    vehicleNo: 'MH-12-AB-1234',
    rating: 4.8,
    trips: 234,
    status: 'on-trip',
    zone: 'West Mumbai',
    approved: true,
  },
  {
    id: 'DR002',
    name: 'Suresh Patil',
    email: 'suresh@example.com',
    phone: '+91 9876543211',
    vehicle: 'Eicher 14 Feet',
    vehicleNo: 'MH-12-CD-5678',
    rating: 4.9,
    trips: 189,
    status: 'online',
    zone: 'Central Mumbai',
    approved: true,
  },
  {
    id: 'DR003',
    name: 'Amit Sharma',
    email: 'amit@example.com',
    phone: '+91 9876543212',
    vehicle: 'Tata 407',
    vehicleNo: 'MH-12-EF-9012',
    rating: 4.7,
    trips: 156,
    status: 'offline',
    zone: 'East Mumbai',
    approved: true,
  },
  {
    id: 'DR004',
    name: 'Vijay Singh',
    email: 'vijay@example.com',
    phone: '+91 9876543213',
    vehicle: 'Mahindra Pickup',
    vehicleNo: 'MH-12-GH-3456',
    rating: 4.6,
    trips: 98,
    status: 'online',
    zone: 'Navi Mumbai',
    approved: true,
  },
  {
    id: 'DR005',
    name: 'Prakash Yadav',
    email: 'prakash@example.com',
    phone: '+91 9876543214',
    vehicle: 'Ashok Leyland Dost',
    vehicleNo: 'MH-12-IJ-7890',
    rating: 0,
    trips: 0,
    status: 'offline',
    zone: 'Unassigned',
    approved: false,
  },
];

export function ManageDrivers({ user }: { user: User }) {
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    return getStoredDrivers();
  });

  // Poll for driver updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedDrivers = getStoredDrivers();
      // Only update if data changed to avoid re-renders? 
      // Simplified: just update. React handles virtual DOM diff.
      // But let's check length or something basic to avoid too much noise, or just set it.
      // Since it's local dev with localStorage, setting it is fine.
      // Comparing JSON strings is a good check.
      setDrivers(prev => {
        const newData = getStoredDrivers();
        if (JSON.stringify(prev) !== JSON.stringify(newData)) {
          return newData;
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline' | 'on-trip' | 'pending'>('all');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const filteredDrivers = drivers.filter((driver) => {
    const vehicleNoMatch = driver.vehicleNo ? driver.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleNoMatch;

    if (filterStatus === 'pending') {
      return matchesSearch && !driver.approved;
    }
    if (filterStatus === 'all') {
      return matchesSearch;
    }
    // Safe check for status
    const driverStatus = driver.status || 'offline';
    return matchesSearch && driverStatus === filterStatus;
  });

  const approveDriver = (driverId: string) => {
    const updatedDrivers = drivers.map(d =>
      d.id === driverId ? { ...d, approved: true, zone: 'West Mumbai' } : d
    );
    setDrivers(updatedDrivers);
    localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
    alert('Driver approved successfully!');
  };

  const rejectDriver = (driverId: string) => {
    if (confirm('Are you sure you want to reject this driver?')) {
      const updatedDrivers = drivers.filter(d => d.id !== driverId);
      setDrivers(updatedDrivers);
      localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
      alert('Driver rejected');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'online': 'bg-green-100 text-green-700',
      'offline': 'bg-gray-100 text-gray-700',
      'on-trip': 'bg-blue-100 text-blue-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-800 mb-2">Manage Drivers</h2>
          <p className="text-gray-600">View, approve, and manage driver partners</p>
        </div>
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
              placeholder="Search by name, ID, or vehicle number..."
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {(['all', 'online', 'offline', 'on-trip', 'pending'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${filterStatus === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drivers List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600">Driver</th>
                <th className="text-left py-4 px-6 text-gray-600">Contact</th>
                <th className="text-left py-4 px-6 text-gray-600">Vehicle</th>
                <th className="text-left py-4 px-6 text-gray-600">Rating</th>
                <th className="text-left py-4 px-6 text-gray-600">Zone</th>
                <th className="text-left py-4 px-6 text-gray-600">Status</th>
                <th className="text-left py-4 px-6 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-gray-800">{driver.name}</p>
                      <p className="text-sm text-gray-500">{driver.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {driver.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {driver.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-gray-800">{driver.vehicle}</p>
                      <p className="text-sm text-gray-500">{driver.vehicleNo}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-800">{driver.rating !== undefined ? driver.rating : 'N/A'}</span>
                      {(driver.trips || 0) > 0 && (
                        <span className="text-sm text-gray-500">({driver.trips})</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-800">{driver.zone || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {driver.approved ? (
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(driver.status || 'offline')}`}>
                        {(driver.status || 'offline').replace('-', ' ')}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                        Pending Approval
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {driver.approved ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedDriver(driver)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <a
                          href={`tel:${driver.phone}`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Call Driver"
                        >
                          <Phone className="w-5 h-5" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveDriver(driver.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => rejectDriver(driver.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDrivers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No drivers found</p>
          </div>
        )}
      </div>

      {/* Driver Details Modal */}
      {
        selectedDriver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-800">Driver Details</h3>
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Driver ID</p>
                  <p className="text-gray-800">{selectedDriver.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-gray-800">{selectedDriver.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{selectedDriver.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">{selectedDriver.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type</p>
                  <p className="text-gray-800">{selectedDriver.vehicle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Number</p>
                  <p className="text-gray-800">{selectedDriver.vehicleNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-800">{selectedDriver.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Trips</p>
                  <p className="text-gray-800">{selectedDriver.trips}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Zone</p>
                  <p className="text-gray-800">{selectedDriver.zone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">{selectedDriver.address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Password</p>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-800 font-mono">
                      {showPassword ? (selectedDriver.password || '******') : '••••••'}
                    </p>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={`tel:${selectedDriver.phone}`}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
                >
                  Call Driver
                </a>
                <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  Assign Zone
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
