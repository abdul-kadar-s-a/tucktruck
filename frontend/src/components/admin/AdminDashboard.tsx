import { useState } from 'react';
import { Home, Package, Users, Truck, TrendingUp, UserPlus, Menu, X, Settings, LogOut } from 'lucide-react';
import { User } from '../../App';
import { AdminHome } from './AdminHome';
import { ManageBookings } from './ManageBookings';
import { ManageDrivers } from './ManageDrivers';
import { ManageUsers } from './ManageUsers';
import { Analytics } from './Analytics';
import { CreateAdmin } from './CreateAdmin';
import { Profile } from '../shared/Profile';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'drivers' | 'users' | 'analytics' | 'create-admin' | 'profile'>('home');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 rounded-full p-2">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-800">TUCKTRUCK Admin</h1>
                <p className="text-sm text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 mt-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Home className="w-5 h-5 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'drivers' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Truck className="w-5 h-5 inline mr-2" />
              Drivers
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Customers
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('create-admin')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'create-admin' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              Create Admin
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 ml-auto"
            >
              <LogOut className="w-5 h-5 inline mr-2" />
              Logout
            </button>
          </nav>

          {/* Mobile Navigation */}
          {menuOpen && (
            <nav className="lg:hidden border-t border-gray-200 mt-4 pt-2">
              <button
                onClick={() => { setActiveTab('home'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left ${activeTab === 'home' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}
              >
                <Home className="w-5 h-5 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => { setActiveTab('bookings'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left ${activeTab === 'bookings' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}
              >
                <Package className="w-5 h-5 inline mr-2" />
                Bookings
              </button>
              <button
                onClick={() => { setActiveTab('drivers'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left ${activeTab === 'drivers' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}
              >
                <Truck className="w-5 h-5 inline mr-2" />
                Drivers
              </button>
              <button
                onClick={() => { setActiveTab('users'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left ${activeTab === 'users' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Customers
              </button>
              <button
                onClick={() => { setActiveTab('analytics'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left ${activeTab === 'analytics' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}
              >
                <TrendingUp className="w-5 h-5 inline mr-2" />
                Analytics
              </button>
              <button
                onClick={() => { setActiveTab('create-admin'); setMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left ${activeTab === 'create-admin' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}
              >
                <UserPlus className="w-5 h-5 inline mr-2" />
                Create Admin
              </button>
              <button
                onClick={onLogout}
                className="w-full px-4 py-3 text-left text-red-600 border-t border-gray-100"
              >
                <LogOut className="w-5 h-5 inline mr-2" />
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {activeTab === 'home' && <AdminHome user={user} />}
        {activeTab === 'bookings' && <ManageBookings user={user} />}
        {activeTab === 'drivers' && <ManageDrivers user={user} />}
        {activeTab === 'users' && <ManageUsers user={user} />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'create-admin' && <CreateAdmin user={user} />}
        {activeTab === 'profile' && <Profile user={user} onLogout={onLogout} />}
      </main>
    </div>
  );
}