import { useState } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Edit, Save, LogOut, Settings, Bell, Lock, DollarSign } from 'lucide-react';
import { User } from '../../App';
import { getDriverRate, setDriverRate } from '../../utils/pricing';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: '123 Main Street, Mumbai, Maharashtra 400001',
  });
  const [perKmRate, setPerKmRate] = useState(getDriverRate(user.type === 'admin' ? 'GLOBAL' : user.id));
  const [activeSection, setActiveSection] = useState<'profile' | 'settings' | 'notifications' | 'security'>('profile');

  const handleSave = () => {
    // Save updated rate via utility (keeps existing logic)
    if (user.type === 'admin') {
      setDriverRate('GLOBAL', perKmRate);
    } else {
      setDriverRate(user.id, perKmRate);

      // ALSO Sync with 'drivers' object in localStorage for User App visibility
      if (user.type === 'driver') {
        try {
          const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
          const updatedDrivers = drivers.map((d: any) => {
            if (d.id === user.id) {
              return { ...d, ratePerKm: perKmRate };
            }
            return d;
          });
          localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
        } catch (e) {
          console.error("Failed to sync driver rate to main storage", e);
        }
      }
    }

    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className={`p-8 ${user.type === 'customer' ? 'bg-gradient-to-r from-blue-600 to-indigo-700' :
          user.type === 'driver' ? 'bg-gradient-to-r from-green-600 to-emerald-700' :
            'bg-gradient-to-r from-purple-600 to-indigo-700'
          } text-white`}>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <UserIcon className={`w-12 h-12 ${user.type === 'customer' ? 'text-blue-600' :
                  user.type === 'driver' ? 'text-green-600' :
                    'text-purple-600'
                  }`} />
              )}
            </div>
            <div>
              <h2 className="mb-2">{user.name}</h2>
              <p className="opacity-90 capitalize">{user.type} Account</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveSection('profile')}
              className={`px-6 py-4 whitespace-nowrap transition-colors ${activeSection === 'profile'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <UserIcon className="w-5 h-5 inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveSection('settings')}
              className={`px-6 py-4 whitespace-nowrap transition-colors ${activeSection === 'settings'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Settings className="w-5 h-5 inline mr-2" />
              Settings
            </button>
            <button
              onClick={() => setActiveSection('notifications')}
              className={`px-6 py-4 whitespace-nowrap transition-colors ${activeSection === 'notifications'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Bell className="w-5 h-5 inline mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveSection('security')}
              className={`px-6 py-4 whitespace-nowrap transition-colors ${activeSection === 'security'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Lock className="w-5 h-5 inline mr-2" />
              Security
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-800">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    <UserIcon className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800 py-3">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800 py-3">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800 py-3">{profileData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800 py-3">{profileData.address}</p>
                  )}
                </div>
              </div>

              {user.type !== 'customer' && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h4 className="text-gray-800 mb-4">Rate Configuration</h4>
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label className="block text-gray-700 mb-2">
                          <DollarSign className="w-4 h-4 inline mr-2" />
                          Global Per Kilometer Rate
                        </label>
                        <p className="text-sm text-gray-600">Base rate for distance calculations</p>
                      </div>
                    </div>
                    {isEditing ? (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-700">₹</span>
                        <input
                          type="number"
                          min="10"
                          max="100"
                          step="1"
                          value={perKmRate}
                          onChange={(e) => setPerKmRate(Number(e.target.value))}
                          className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <span className="text-gray-700">/km</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-3xl text-green-600">₹{perKmRate}</p>
                        <span className="text-gray-600">/km</span>
                      </div>
                    )}
                    {!isEditing && (
                      <p className="text-sm text-gray-600 mt-3">
                        This rate is currently being used for calculations
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-gray-800 mb-6">App Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-gray-800">Language</p>
                    <p className="text-sm text-gray-600">Select your preferred language</p>
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>English</option>
                    <option>हिंदी</option>
                    <option>मराठी</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-gray-800">Theme</p>
                    <p className="text-sm text-gray-600">Choose light or dark mode</p>
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-gray-800">Location Services</p>
                    <p className="text-sm text-gray-600">Allow app to access your location</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-gray-800 mb-6">Notification Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-gray-800">Booking Updates</p>
                    <p className="text-sm text-gray-600">Get notified about booking status changes</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-gray-800">Promotions & Offers</p>
                    <p className="text-sm text-gray-600">Receive special offers and discounts</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-400">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-gray-800">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via SMS</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-gray-800">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <h3 className="text-gray-800 mb-6">Security Settings</h3>

              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-800 mb-3">Change Password</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Update Password
                  </button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-800 mb-2">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Enable 2FA
                  </button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-800 mb-2">Active Sessions</p>
                  <p className="text-sm text-gray-600 mb-3">Manage devices where you're logged in</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm text-gray-800">Current Device</p>
                        <p className="text-xs text-gray-600">Chrome on Windows • Active now</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-5 h-5" />
              Logout from Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
