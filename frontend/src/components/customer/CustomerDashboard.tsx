import { useState, useEffect } from 'react';
import { Home, Package, Clock, User as UserIcon, Menu, X, MapPin, AlertTriangle, Sparkles } from 'lucide-react';
import { User } from '../../App';
import { BookVehicle } from './BookVehicle';
import ZomatoBookVehicle from './ZomatoBookVehicle';
import { MyBookings } from './MyBookings';
import { SavedAddresses } from './SavedAddresses';
import { Profile } from '../shared/Profile';
import { EmergencyCall } from '../shared/EmergencyCall';

interface CustomerDashboardProps {
  user: User;
  onLogout: () => void;
}

export function CustomerDashboard({ user, onLogout }: CustomerDashboardProps) {

  const [activeTab, setActiveTab] = useState<'home' | 'book' | 'bookings' | 'addresses' | 'profile'>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [modernUI, setModernUI] = useState(false);

  // ⭐ DASHBOARD STATS STATE
  const [stats, setStats] = useState({
    activeBookings: 0,
    totalBookings: 0,
    savedAddresses: 0
  });

  // ⭐ FETCH DASHBOARD DATA
  const loadDashboard = () => {
    fetch(`http://localhost:8080/api/customer/dashboard/${user.id}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.log("Dashboard API error:", err));
  };

  useEffect(() => {
    loadDashboard();
  }, [user.id]);

  // ⭐ AUTO REFRESH WHEN BOOKING CREATED
  useEffect(() => {
    const refreshDashboard = () => loadDashboard();
    window.addEventListener("bookingCreated", refreshDashboard);
    return () => window.removeEventListener("bookingCreated", refreshDashboard);
  }, [user.id]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-full p-2">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-800 font-bold">TUCKTRUCK</h1>
              <p className="text-sm text-gray-500">Welcome, {user.name}</p>
            </div>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <nav className="hidden lg:flex items-center gap-4">
            <button onClick={() => setActiveTab('home')} className="px-4 py-2 rounded-lg hover:bg-gray-100">
              <Home className="w-5 h-5 inline mr-2" /> Home
            </button>
            <button onClick={() => setActiveTab('book')} className="px-4 py-2 rounded-lg hover:bg-gray-100">
              <Package className="w-5 h-5 inline mr-2" /> Book Vehicle
            </button>
            <button onClick={() => setActiveTab('bookings')} className="px-4 py-2 rounded-lg hover:bg-gray-100">
              <Clock className="w-5 h-5 inline mr-2" /> My Bookings
            </button>
            <button onClick={() => setActiveTab('addresses')} className="px-4 py-2 rounded-lg hover:bg-gray-100">
              <MapPin className="w-5 h-5 inline mr-2" /> Saved Addresses
            </button>
            <button onClick={() => setActiveTab('profile')} className="px-4 py-2 rounded-lg hover:bg-gray-100">
              <UserIcon className="w-5 h-5 inline mr-2" /> Profile
            </button>

            <button
              onClick={() => setShowEmergency(true)}
              className="p-2 bg-red-100 text-red-600 rounded-lg"
            >
              <AlertTriangle className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-4">

        {activeTab === 'home' && (
          <HomeTab user={user} stats={stats} onBookNow={() => setActiveTab('book')} />
        )}

        {activeTab === 'book' && <BookVehicle user={user} />}
        {activeTab === 'bookings' && <MyBookings user={user} />}
        {activeTab === 'addresses' && <SavedAddresses user={user} />}
        {activeTab === 'profile' && <Profile user={user} onLogout={onLogout} />}

      </main>

      {showEmergency && (
        <EmergencyCall
          onClose={() => setShowEmergency(false)}
          adminPhone="+91 1800-123-4567"
        />
      )}
    </div>
  );
}

function HomeTab({ user, stats, onBookNow }: any) {
  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Hello, {user.name}! 👋</h2>
        <p className="mb-6 opacity-90">Book your commercial vehicle in seconds</p>
        <button
          onClick={onBookNow}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg"
        >
          Book a Vehicle Now
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500">Active Bookings</p>
          <p className="text-3xl font-bold text-green-600">{stats.activeBookings}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500">Total Bookings</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalBookings}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500">Saved Addresses</p>
          <p className="text-3xl font-bold text-purple-600">{stats.savedAddresses}</p>
        </div>

      </div>
    </div>
  );
}
