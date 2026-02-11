import { Package, Users, Truck, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Bell } from 'lucide-react';
import { User } from '../../App';
import { Card } from '../ui/card';
import BookingMapView from './BookingMapView';
import { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { BOOKING_EVENTS, DRIVER_EVENTS, ADMIN_EVENTS, BookingData } from '../../services/socketEvents';

interface AdminHomeProps {
  user: User;
}

export function AdminHome({ user }: AdminHomeProps) {
  const [stats, setStats] = useState({
    totalBookings: 1245,
    activeBookings: 48,
    totalRevenue: 4567890,
    todayRevenue: 45600,
    totalCustomers: 892,
    totalDrivers: 156,
    activeDrivers: 89,
    completedBookings: 1189,
  });

  const [recentBookings, setRecentBookings] = useState([
    {
      id: 'BK12345',
      customer: 'Rajesh Kumar',
      driver: 'Amit Sharma',
      from: 'Mumbai Central',
      to: 'Andheri West',
      amount: 450,
      status: 'completed',
      time: '2 hours ago',
    },
    {
      id: 'BK12346',
      customer: 'Priya Patel',
      driver: 'Suresh Reddy',
      from: 'Thane',
      to: 'Navi Mumbai',
      amount: 680,
      status: 'in-transit',
      time: '30 mins ago',
    },
    {
      id: 'BK12347',
      customer: 'Amit Singh',
      driver: 'Rajesh Kumar',
      from: 'Bandra',
      to: 'Powai',
      amount: 520,
      status: 'pending',
      time: '15 mins ago',
    },
  ]);

  const [newBookingAlert, setNewBookingAlert] = useState<BookingData | null>(null);

  // Initialize socket for real-time updates
  const { on, off } = useSocket();

  const topDrivers = [
    { name: 'Amit Sharma', trips: 234, rating: 4.9, earnings: 45600 },
    { name: 'Suresh Reddy', trips: 198, rating: 4.8, earnings: 38900 },
    { name: 'Rajesh Kumar', trips: 176, rating: 4.7, earnings: 34500 },
  ];

  // 🔥 REAL-TIME: Listen for new bookings and updates
  useEffect(() => {
    // Listen for new booking alerts
    on<BookingData>(BOOKING_EVENTS.NEW_BOOKING_ALERT, (data) => {
      console.log('🔔 New booking alert received:', data);
      setNewBookingAlert(data);

      // Update stats
      setStats(prev => ({
        ...prev,
        activeBookings: prev.activeBookings + 1,
        totalBookings: prev.totalBookings + 1,
      }));

      // Add to recent bookings
      const newBooking = {
        id: data.id || 'NEW',
        customer: data.customer,
        driver: data.driver || 'Unassigned',
        from: data.pickup,
        to: data.dropoff,
        amount: data.amount,
        status: data.status,
        time: 'Just now',
      };
      setRecentBookings(prev => [newBooking, ...prev.slice(0, 2)]);

      // Auto-hide alert after 5 seconds
      setTimeout(() => setNewBookingAlert(null), 5000);
    });

    // Listen for booking status updates
    on<any>(BOOKING_EVENTS.BOOKING_STATUS_UPDATE, (data) => {
      console.log('🚀 Booking status updated:', data);
      setRecentBookings(prev =>
        prev.map(b => b.id === data.bookingId ? { ...b, status: data.status } : b)
      );

      if (data.status === 'completed') {
        setStats(prev => ({
          ...prev,
          activeBookings: Math.max(0, prev.activeBookings - 1),
          completedBookings: prev.completedBookings + 1,
        }));
      }
    });

    // Listen for driver status changes
    on<any>(DRIVER_EVENTS.DRIVER_STATUS_CHANGED, (data) => {
      console.log('🚗 Driver status changed:', data);
      if (data.status === 'online') {
        setStats(prev => ({ ...prev, activeDrivers: prev.activeDrivers + 1 }));
      } else if (data.status === 'offline') {
        setStats(prev => ({ ...prev, activeDrivers: Math.max(0, prev.activeDrivers - 1) }));
      }
    });

    // Listen for earnings updates
    on<any>(ADMIN_EVENTS.EARNINGS_UPDATED, (data) => {
      console.log('💰 Earnings updated:', data);
      setStats(prev => ({
        ...prev,
        todayRevenue: data.todayRevenue || prev.todayRevenue,
        totalRevenue: data.totalRevenue || prev.totalRevenue,
      }));
    });

    return () => {
      off(BOOKING_EVENTS.NEW_BOOKING_ALERT);
      off(BOOKING_EVENTS.BOOKING_STATUS_UPDATE);
      off(DRIVER_EVENTS.DRIVER_STATUS_CHANGED);
      off(ADMIN_EVENTS.EARNINGS_UPDATED);
    };
  }, [on, off]);

  return (
    <div className="space-y-6">
      {/* New Booking Alert - Fixed at top */}
      {newBookingAlert && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-2xl z-50 animate-bounce max-w-md">
          <div className="flex items-start gap-3">
            <Bell className="w-6 h-6 animate-pulse" />
            <div className="flex-1">
              <p className="font-bold text-lg mb-1">🔔 New Booking Alert!</p>
              <p className="text-sm opacity-90">From: {newBookingAlert.customer}</p>
              <p className="text-sm opacity-90">{newBookingAlert.pickup} → {newBookingAlert.dropoff}</p>
              <p className="text-sm font-semibold mt-1">₹{newBookingAlert.amount}</p>
            </div>
            <button
              onClick={() => setNewBookingAlert(null)}
              className="text-white hover:bg-blue-700 rounded p-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-blue-100 text-lg">Here's what's happening with TUCKTRUCK today</p>
        <div className="mt-4 flex items-center gap-2 bg-blue-500 bg-opacity-30 rounded-lg px-4 py-2 w-fit">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">Live Dashboard - Real-time updates enabled</span>
        </div>
      </div>

      {/* Live Map View */}
      <div className="mb-8 h-[500px]">
        <BookingMapView />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500">TODAY</span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Active Bookings</p>
          <p className="text-3xl font-bold text-gray-800">{stats.activeBookings}</p>
          <p className="text-sm text-green-600 mt-2">↗ +12% from yesterday</p>
        </Card>

        <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500">TODAY</span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Revenue</p>
          <p className="text-3xl font-bold text-gray-800">₹{(stats.todayRevenue / 1000).toFixed(1)}k</p>
          <p className="text-sm text-green-600 mt-2">↗ +8% from yesterday</p>
        </Card>

        <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 rounded-full p-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500">TOTAL</span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalCustomers}</p>
          <p className="text-sm text-green-600 mt-2">↗ +24 this week</p>
        </Card>

        <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 rounded-full p-3">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500">ONLINE</span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Active Drivers</p>
          <p className="text-3xl font-bold text-gray-800">{stats.activeDrivers}/{stats.totalDrivers}</p>
          <p className="text-sm text-gray-500 mt-2">{Math.round((stats.activeDrivers / stats.totalDrivers) * 100)}% online</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">📦 Recent Bookings</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">View All</button>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="border-2 border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{booking.id}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : booking.status === 'in-transit'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                      }`}
                  >
                    {booking.status === 'completed'
                      ? '✓ Completed'
                      : booking.status === 'in-transit'
                        ? '🚚 In Transit'
                        : '⏳ Pending'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Customer: {booking.customer}</p>
                  <p>Driver: {booking.driver}</p>
                  <p>Route: {booking.from} → {booking.to}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="font-semibold text-green-600">₹{booking.amount}</span>
                    <span className="text-xs text-gray-500">{booking.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Drivers */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">⭐ Top Performing Drivers</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">View All</button>
          </div>
          <div className="space-y-4">
            {topDrivers.map((driver, index) => (
              <div key={driver.name} className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-lg hover:border-blue-200 transition-colors">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                  }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{driver.name}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <span>📦 {driver.trips} trips</span>
                    <span>⭐ {driver.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{(driver.earnings / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-gray-500">earnings</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-semibold mb-1">Completed Bookings</p>
              <p className="text-3xl font-bold text-green-800">{stats.completedBookings}</p>
              <p className="text-sm text-green-600 mt-2">95.5% success rate</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-semibold mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-800">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
              <p className="text-sm text-blue-600 mt-2">All time</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 font-semibold mb-1">Avg. Booking Value</p>
              <p className="text-3xl font-bold text-purple-800">₹{Math.round(stats.totalRevenue / stats.totalBookings)}</p>
              <p className="text-sm text-purple-600 mt-2">Per booking</p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-600 opacity-50" />
          </div>
        </Card>
      </div>
    </div>
  );
}
