import { useState } from 'react';
import { Home, Package, DollarSign, User as UserIcon, Menu, X, Truck } from 'lucide-react';
import { User } from '../../App';
import { DriverHome } from './DriverHome';
import { ActiveTrips } from './ActiveTrips';
import { DriverEarnings } from './DriverEarnings';
import { DriverVehicle } from './DriverVehicle';
import { Profile } from '../shared/Profile';
import { EmergencyCall } from '../shared/EmergencyCall';

interface DriverDashboardProps {
  user: User;
  onLogout: () => void;
}

export function DriverDashboard({ user, onLogout }: DriverDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'trips' | 'earnings' | 'vehicles' | 'profile'>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  const handleStatusToggle = () => {
    if (isOnline) {
      // Check for active bookings before going offline
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const hasActiveBooking = bookings.some((b: any) =>
        b.driverId === user.id &&
        ['assigned', 'accepted', 'en-route-pickup', 'arrived-pickup', 'picked-up', 'en-route-dropoff', 'arrived-dropoff', 'delivered'].includes(b.status)
      );

      if (hasActiveBooking) {
        alert('Cannot go offline while you have an active booking. Please complete the current trip first.');
        return;
      }
    }

    const newStatus = !isOnline;
    setIsOnline(newStatus);

    // Update driver status in localStorage
    const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
    const updatedDrivers = drivers.map((d: any) =>
      d.id === user.id ? { ...d, status: newStatus ? 'online' : 'offline' } : d
    );
    // If driver not found (first login), add them (mock)
    if (!drivers.find((d: any) => d.id === user.id)) {
      updatedDrivers.push({
        id: user.id,
        name: user.name,
        phone: user.phone || '',
        status: newStatus ? 'online' : 'offline',
        vehicle: 'Tata Ace', // Default
        vehicleNo: 'TN-00-0000'
      });
    }
    localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 rounded-full p-2">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-800">TUCKTRUCK Driver</h1>
                <p className="text-sm text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>

            {/* Online/Offline Toggle */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
                <span className="text-sm text-gray-600">Status:</span>
                <button
                  onClick={handleStatusToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOnline ? 'bg-green-600' : 'bg-gray-400'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
                <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-gray-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 mt-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Home className="w-5 h-5 inline mr-2" />
              Home
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'trips' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              Active Trips
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'earnings' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <DollarSign className="w-5 h-5 inline mr-2" />
              Earnings
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'vehicles' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Truck className="w-5 h-5 inline mr-2" />
              Vehicles
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <UserIcon className="w-5 h-5 inline mr-2" />
              Profile
            </button>
          </nav>

          {/* Mobile Navigation */}
          {menuOpen && (
            <nav className="lg:hidden border-t border-gray-200 mt-4 pt-2">
              <button
                onClick={() => { setActiveTab('home'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left ${activeTab === 'home' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
              >
                <Home className="w-5 h-5 inline mr-2" />
                Home
              </button>
              <button
                onClick={() => { setActiveTab('trips'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left ${activeTab === 'trips' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
              >
                <Package className="w-5 h-5 inline mr-2" />
                Active Trips
              </button>
              <button
                onClick={() => { setActiveTab('earnings'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left ${activeTab === 'earnings' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
              >
                <DollarSign className="w-5 h-5 inline mr-2" />
                Earnings
              </button>
              <button
                onClick={() => { setActiveTab('vehicles'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left ${activeTab === 'vehicles' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
              >
                <Truck className="w-5 h-5 inline mr-2" />
                Vehicles
              </button>
              <button
                onClick={() => { setActiveTab('profile'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left ${activeTab === 'profile' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
              >
                <UserIcon className="w-5 h-5 inline mr-2" />
                Profile
              </button>
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <button
                    onClick={handleStatusToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOnline ? 'bg-green-600' : 'bg-gray-400'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {activeTab === 'home' && <DriverHome user={user} isOnline={isOnline} />}
        {activeTab === 'trips' && <ActiveTrips user={user} />}
        {activeTab === 'earnings' && <DriverEarnings user={user} />}
        {activeTab === 'vehicles' && <DriverVehicle user={user} />}
        {activeTab === 'profile' && <Profile user={user} onLogout={onLogout} />}
      </main>

      {/* Emergency Call Modal */}
      {showEmergency && (
        <EmergencyCall
          onClose={() => setShowEmergency(false)}
          adminPhone="+91 1800-123-4567"
        />
      )}
    </div>
  );
}