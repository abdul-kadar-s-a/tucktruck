import { useState } from 'react';
import { Shield, Plus, Mail, Phone, User as UserIcon, X } from 'lucide-react';
import { User } from '../../App';

interface CreateAdminProps {
  user: User;
}

interface AdminData {
  id: string;
  name: string;
  email: string;
  phone: string;
  uniqueId: string;
  password: string;
  createdBy: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

const mockAdmins: AdminData[] = [
  {
    id: 'ADM001',
    name: 'Super Admin',
    email: 'admin@tucktruck.com',
    phone: '+91 98765 00000',
    uniqueId: 'ADMIN-001',
    password: '******',
    createdBy: 'System',
    createdAt: '2025-01-01',
    status: 'active',
  },
];

const getStoredAdmins = () => {
  const stored = localStorage.getItem('admins');
  return stored ? JSON.parse(stored) : [];
};

export function CreateAdmin({ user }: CreateAdminProps) {
  const [admins, setAdmins] = useState<AdminData[]>(() => {
    const stored = getStoredAdmins();
    return stored.length > 0 ? stored : mockAdmins;
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name should only contain letters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = formData.phone.replace(/\s+/g, '').replace('+91', '');
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation moved to auto-fixed


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Generate unique admin ID
    const uniqueId = `ADMIN-${String(admins.length + 1).padStart(3, '0')}`;

    const newAdmin: AdminData = {
      id: uniqueId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      uniqueId: uniqueId,
      password: 'password123', // Auto-fixed password for admins
      createdBy: user.name,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    const updatedAdmins = [...admins, newAdmin];
    setAdmins(updatedAdmins);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));

    alert(`New admin created successfully!\n\nUnique ID: ${uniqueId}\nEmail: ${formData.email}\nPassword: password123\n\nThe admin can now login using these credentials.`);

    setShowCreateModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-800 mb-2">Admin Management</h2>
          <p className="text-gray-600">Create and manage admin accounts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create New Admin
        </button>
      </div>

      {/* Admin List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Unique ID</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Name</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Email</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Phone</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Created By</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-blue-600">{admin.uniqueId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 rounded-full p-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-800">{admin.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4 text-gray-600">{admin.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{admin.createdBy}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${admin.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                      }`}>
                      {admin.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-gray-800">Create New Admin</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter full name"
                    />
                  </div>
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="admin@tucktruck.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>


              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> A unique admin ID will be auto-generated. The new admin will be able to access the admin dashboard after creation.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
