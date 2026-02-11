import { useState } from 'react';
import { ArrowLeft, Truck } from 'lucide-react';
import { User } from '../../App';

interface SignupCustomerProps {
  onSignup: (user: User) => void;
  onBack: () => void;
}

export function SignupCustomer({ onSignup, onBack }: SignupCustomerProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();



    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: 'customer',
      address: formData.address,
    };

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Save to localStorage for persistence
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    localStorage.setItem('users', JSON.stringify([...existingUsers, { ...newUser, password: formData.password }]));

    alert('Account created successfully!');

    // Also save current session
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    onSignup(newUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 rounded-full p-3">
              <Truck className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-center text-gray-800 mb-2">Create Customer Account</h1>
          <p className="text-center text-gray-500 mb-6">Join TUCKTRUCK today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 9876543210"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm password"
                required
              />
            </div>



            <div>
              <label className="block text-gray-700 mb-2">Home Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full address"
                required
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
