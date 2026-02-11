import { useState } from 'react';
import { Eye, EyeOff, Truck, User, UserCircle, Shield, Loader2 } from 'lucide-react';
import { User as UserType, UserType as UserTypeEnum } from '../../App';

interface LoginProps {
  onLogin: (user: UserType) => void;
  onSignupCustomer: () => void;
  onSignupDriver: () => void;
  onForgotPassword: (userType: UserTypeEnum) => void;
}

export function Login({ onLogin, onSignupCustomer, onSignupDriver, onForgotPassword }: LoginProps) {
  const [userType, setUserType] = useState<UserTypeEnum>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Use Backend API
      const { api } = await import('../../services/api');
      const response = await api.login(email, password);

      const authenticatedUser: UserType = {
        id: response.id.toString(), // Ensure string
        name: response.name || 'User',
        email: response.email,
        phone: response.phone || '',
        type: response.role.toLowerCase() as UserTypeEnum,
        // Add default/missing fields
        profilePhoto: `https://ui-avatars.com/api/?name=${response.name || 'User'}&background=random`,
        address: '',
        status: response.role === 'DRIVER' ? 'offline' : undefined,
        approved: true
      };

      // Store in localStorage for persistence (mock session)
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));

      onLogin(authenticatedUser);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(`Login failed: ${err.message || 'Invalid credentials'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (type: UserTypeEnum) => {
    setUserType(type);

    // Admin handling
    if (type === 'admin') {
      setEmail('admin@tucktruck.com');
      setPassword('password123');
      return;
    }

    // Customer & Driver handling
    const storageKey = type === 'customer' ? 'users' : 'drivers';
    const storedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (storedItems.length > 0) {
      // Use the first available user
      const user = storedItems[0];
      setEmail(user.email);
      setPassword(user.password || '');
    } else {
      setEmail('');
      setPassword('');
      setError(`No ${type} accounts found. Please sign up first.`);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure? This will remove all users, drivers, admins, and bookings from this browser.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 rounded-full p-3">
              <Truck className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-center text-gray-800 mb-2">
            Welcome to <span className="text-blue-600">TUCKTRUCK</span>
          </h1>
          <p className="text-center text-gray-500 mb-6">Sign in to continue</p>

          {/* User Type Selection */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              type="button"
              onClick={() => setUserType('customer')}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${userType === 'customer'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <User className={`w-6 h-6 ${userType === 'customer' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-sm ${userType === 'customer' ? 'text-blue-600' : 'text-gray-600'}`}>
                Customer
              </span>
            </button>

            <button
              type="button"
              onClick={() => setUserType('driver')}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${userType === 'driver'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <UserCircle className={`w-6 h-6 ${userType === 'driver' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-sm ${userType === 'driver' ? 'text-blue-600' : 'text-gray-600'}`}>
                Driver
              </span>
            </button>

            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${userType === 'admin'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <Shield className={`w-6 h-6 ${userType === 'admin' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-sm ${userType === 'admin' ? 'text-blue-600' : 'text-gray-600'}`}>
                Admin
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => onForgotPassword(userType)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Don't have an account?</p>
            <div className="flex gap-2">
              <button
                onClick={onSignupCustomer}
                className="flex-1 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Sign Up as Customer
              </button>
              <button
                onClick={onSignupDriver}
                className="flex-1 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                Sign Up as Driver
              </button>
            </div>
          </div>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400 uppercase tracking-widest font-semibold mb-3">
            Quick Demo Access
          </p>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleDemoFill('customer')}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-600 rounded-md transition-colors"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('driver')}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-600 rounded-md transition-colors"
            >
              Driver
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-600 rounded-md transition-colors"
            >
              Admin
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleClearData}
              className="text-xs text-red-500 hover:text-red-700 underline"
            >
              Clear All App Data
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}