import { useState } from 'react';
import { MapPin, Home, Briefcase, Plus, Edit2, Trash2, X } from 'lucide-react';
import { User } from '../../App';

interface SavedAddressesProps {
  user: User;
}

interface Address {
  id: string;
  label: string;
  type: 'home' | 'work' | 'other';
  address: string;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    label: 'Home',
    type: 'home',
    address: 'Trichy Central Bus Stand, Trichy - 620001, Tamil Nadu',
  },
  {
    id: '2',
    label: 'Office',
    type: 'work',
    address: 'Tech Park, Anna Salai, Chennai - 600002, Tamil Nadu',
  },
  {
    id: '3',
    label: 'Warehouse',
    type: 'other',
    address: 'Industrial Area, Coimbatore - 641001, Tamil Nadu',
  },
];

export function SavedAddresses({ user }: SavedAddressesProps) {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'home':
        return Home;
      case 'work':
        return Briefcase;
      default:
        return MapPin;
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-800 mb-2">Saved Addresses</h2>
          <p className="text-gray-600">Manage your frequently used addresses</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Address
        </button>
      </div>

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => {
          const Icon = getIcon(address.type);
          return (
            <div
              key={address.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-full p-3 ${
                  address.type === 'home' ? 'bg-green-100' :
                  address.type === 'work' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    address.type === 'home' ? 'text-green-600' :
                    address.type === 'work' ? 'text-blue-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-800 mb-1">{address.label}</h3>
                  <p className="text-gray-600 text-sm mb-4">{address.address}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingAddress(address)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Address Modal */}
      {(showAddForm || editingAddress) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAddress(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newAddress: Address = {
                  id: editingAddress?.id || Math.random().toString(36).substr(2, 9),
                  label: formData.get('label') as string,
                  type: formData.get('type') as 'home' | 'work' | 'other',
                  address: formData.get('address') as string,
                };

                if (editingAddress) {
                  setAddresses(addresses.map(addr =>
                    addr.id === editingAddress.id ? newAddress : addr
                  ));
                } else {
                  setAddresses([...addresses, newAddress]);
                }

                setShowAddForm(false);
                setEditingAddress(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 mb-2">Address Label</label>
                <input
                  type="text"
                  name="label"
                  defaultValue={editingAddress?.label}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Home, Office, Warehouse"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Address Type</label>
                <select
                  name="type"
                  defaultValue={editingAddress?.type || 'other'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Full Address</label>
                <textarea
                  name="address"
                  defaultValue={editingAddress?.address}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter complete address with pincode"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingAddress ? 'Update' : 'Add'} Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
