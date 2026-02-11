import { useState, useEffect } from 'react';
import { DollarSign, Users, Package, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 285000, bookings: 156 },
  { month: 'Feb', revenue: 310000, bookings: 178 },
  { month: 'Mar', revenue: 345000, bookings: 198 },
  { month: 'Apr', revenue: 380000, bookings: 214 },
  { month: 'May', revenue: 365000, bookings: 205 },
  { month: 'Jun', revenue: 420000, bookings: 234 },
  { month: 'Jul', revenue: 445000, bookings: 256 },
  { month: 'Aug', revenue: 430000, bookings: 245 },
  { month: 'Sep', revenue: 465000, bookings: 268 },
  { month: 'Oct', revenue: 490000, bookings: 285 },
  { month: 'Nov', revenue: 510000, bookings: 298 },
  { month: 'Dec', revenue: 535000, bookings: 312 },
];

const vehicleDistribution = [
  { name: 'Tata Ace', value: 456, color: '#3b82f6' },
  { name: 'Eicher 14 Feet', value: 312, color: '#10b981' },
  { name: 'Tata 407', value: 234, color: '#8b5cf6' },
  { name: 'Mahindra Pickup', value: 189, color: '#f59e0b' },
  { name: 'Ashok Leyland Dost', value: 152, color: '#ef4444' },
];

const performanceData = [
  { day: 'Mon', bookings: 45, completed: 42 },
  { day: 'Tue', bookings: 52, completed: 48 },
  { day: 'Wed', bookings: 38, completed: 36 },
  { day: 'Thu', bookings: 58, completed: 55 },
  { day: 'Fri', bookings: 64, completed: 61 },
  { day: 'Sat', bookings: 72, completed: 68 },
  { day: 'Sun', bookings: 56, completed: 53 },
];

export function Analytics() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalDrivers: 0,
    avgBookingValue: 0,
    completionRate: 0,
    customerSatisfaction: 0,
  });

  useEffect(() => {
    // Calculate stats from real data
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');

    if (bookings.length === 0) return;

    const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (Number(b.amount) || 0), 0);
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter((b: any) => b.status === 'completed').length;

    setStats({
      totalRevenue,
      totalBookings,
      totalDrivers: drivers.length,
      avgBookingValue: totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0,
      completionRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0,
      customerSatisfaction: 4.8, // Default until we have ratings
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-800 mb-2">Analytics & Reports</h2>
          <p className="text-gray-600">Platform performance metrics and insights</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <DollarSign className="w-8 h-8 mb-3 opacity-90" />
          <p className="opacity-90 mb-2">Total Revenue (Dec)</p>
          <p className="text-3xl">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-sm opacity-75 mt-2">+12% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <Package className="w-8 h-8 mb-3 opacity-90" />
          <p className="opacity-90 mb-2">Total Bookings</p>
          <p className="text-3xl">{stats.totalBookings}</p>
          <p className="text-sm opacity-75 mt-2">{stats.completionRate}% completion rate</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Users className="w-8 h-8 mb-3 opacity-90" />
          <p className="opacity-90 mb-2">Active Drivers</p>
          <p className="text-3xl">{stats.totalDrivers}</p>
          <p className="text-sm opacity-75 mt-2">89 currently online</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <TrendingUp className="w-8 h-8 mb-3 opacity-90" />
          <p className="opacity-90 mb-2">Avg. Booking Value</p>
          <p className="text-3xl">₹{stats.avgBookingValue}</p>
          <p className="text-sm opacity-75 mt-2">+8% from last month</p>
        </div>
      </div>

      {/* Revenue & Bookings Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-gray-800 mb-6">Revenue & Bookings Trend (2025)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} name="Revenue (₹)" />
            <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} name="Bookings" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-800 mb-6">Vehicle Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {vehicleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {vehicleDistribution.map((vehicle, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vehicle.color }} />
                  <span className="text-gray-700">{vehicle.name}</span>
                </div>
                <span className="text-gray-600">{vehicle.value} bookings</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-800 mb-6">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Total Bookings" />
              <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-gray-800 mb-6">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-sm text-gray-500 mb-1">Booking Completion Rate</p>
            <p className="text-3xl text-gray-800">{stats.completionRate}%</p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }} />
            </div>
          </div>

          <div className="border-l-4 border-green-600 pl-4">
            <p className="text-sm text-gray-500 mb-1">Customer Satisfaction</p>
            <p className="text-3xl text-gray-800">{stats.customerSatisfaction}/5.0</p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(stats.customerSatisfaction / 5) * 100}%` }} />
            </div>
          </div>

          <div className="border-l-4 border-purple-600 pl-4">
            <p className="text-sm text-gray-500 mb-1">Driver Utilization</p>
            <p className="text-3xl text-gray-800">87%</p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '87%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Drivers */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-gray-800 mb-4">Top Performing Drivers (This Month)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600">Rank</th>
                <th className="text-left py-3 px-4 text-gray-600">Driver</th>
                <th className="text-left py-3 px-4 text-gray-600">Trips</th>
                <th className="text-left py-3 px-4 text-gray-600">Revenue</th>
                <th className="text-left py-3 px-4 text-gray-600">Rating</th>
                <th className="text-left py-3 px-4 text-gray-600">Completion %</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: 'Rajesh Kumar', trips: 89, revenue: 45600, rating: 4.9, completion: 98 },
                { rank: 2, name: 'Suresh Patil', trips: 78, revenue: 42300, rating: 4.8, completion: 97 },
                { rank: 3, name: 'Amit Sharma', trips: 72, revenue: 38900, rating: 4.7, completion: 95 },
                { rank: 4, name: 'Vijay Singh', trips: 68, revenue: 35200, rating: 4.8, completion: 96 },
                { rank: 5, name: 'Prakash Yadav', trips: 65, revenue: 33400, rating: 4.6, completion: 94 },
              ].map((driver) => (
                <tr key={driver.rank} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${driver.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      driver.rank === 2 ? 'bg-gray-100 text-gray-700' :
                        driver.rank === 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                      }`}>
                      {driver.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-800">{driver.name}</td>
                  <td className="py-3 px-4 text-gray-600">{driver.trips}</td>
                  <td className="py-3 px-4 text-gray-800">₹{driver.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-600">⭐ {driver.rating}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${driver.completion}%` }} />
                      </div>
                      <span className="text-sm text-gray-600">{driver.completion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}