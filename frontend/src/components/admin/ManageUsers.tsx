import { useState } from 'react';
import { Search, Filter, UserX, UserCheck, Eye, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EmptyState } from '../ui/empty-state';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { User } from '../../App';

interface ManageUsersProps {
  user: User;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'blocked';
  joinedDate: string;
  address?: string;
  password?: string;
}

const getStoredCustomers = () => {
  const stored = localStorage.getItem('users');
  return stored ? JSON.parse(stored).map((u: any) => ({
    ...u,
    totalBookings: 0,
    totalSpent: 0,
    status: 'active',
    joinedDate: new Date().toISOString().split('T')[0] // Default to today/signup date if not stored
  })) : [];
};

const mockCustomers: Customer[] = [
  {
    id: 'CU001',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@example.com',
    phone: '+91 9876543210',
    totalBookings: 24,
    totalSpent: 12450,
    status: 'active',
    joinedDate: '2025-01-15',
  },
  {
    id: 'CU002',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    phone: '+91 9876543211',
    totalBookings: 18,
    totalSpent: 8920,
    status: 'active',
    joinedDate: '2025-01-20',
  },
  {
    id: 'CU003',
    name: 'Amit Patel',
    email: 'amit.p@example.com',
    phone: '+91 9876543212',
    totalBookings: 32,
    totalSpent: 16780,
    status: 'active',
    joinedDate: '2025-01-10',
  },
  {
    id: 'CU004',
    name: 'Sneha Reddy',
    email: 'sneha.r@example.com',
    phone: '+91 9876543213',
    totalBookings: 5,
    totalSpent: 2340,
    status: 'blocked',
    joinedDate: '2025-02-01',
  },
];

export function ManageUsers({ user }: ManageUsersProps) {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    return getStoredCustomers();
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'block' | 'unblock' | 'delete';
    customerId: string;
  }>({ isOpen: false, type: 'block', customerId: '' });
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleBlockUser = (customerId: string) => {
    const updatedCustomers = customers.map((c) =>
      c.id === customerId ? { ...c, status: 'blocked' as const } : c
    );
    setCustomers(updatedCustomers);
    localStorage.setItem('users', JSON.stringify(updatedCustomers));
  };

  const handleUnblockUser = (customerId: string) => {
    const updatedCustomers = customers.map((c) =>
      c.id === customerId ? { ...c, status: 'active' as const } : c
    );
    setCustomers(updatedCustomers);
    localStorage.setItem('users', JSON.stringify(updatedCustomers));
  };

  const handleDeleteUser = (customerId: string) => {
    const updatedCustomers = customers.filter((c) => c.id !== customerId);
    setCustomers(updatedCustomers);
    localStorage.setItem('users', JSON.stringify(updatedCustomers));
  };

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === 'active').length,
    blocked: customers.filter((c) => c.status === 'blocked').length,
  };

  const togglePasswordVisibility = (customerId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">👥 Manage Customers</h2>
        <p className="text-gray-600">View and manage all registered customers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100">
          <p className="text-gray-500 mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-100">
          <p className="text-gray-500 mb-1">Active Customers</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-red-100">
          <p className="text-gray-500 mb-1">Blocked Customers</p>
          <p className="text-3xl font-bold text-red-600">{stats.blocked}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              className={statusFilter === 'all' ? 'bg-blue-600' : ''}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('active')}
              className={statusFilter === 'active' ? 'bg-green-600' : ''}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'blocked' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('blocked')}
              className={statusFilter === 'blocked' ? 'bg-red-600' : ''}
            >
              Blocked
            </Button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No customers found"
            description="Try adjusting your search or filter criteria"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Password</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bookings</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Spent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">{customer.name}</p>
                        <p className="text-sm text-gray-500">ID: {customer.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-800">{customer.email}</p>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 truncate max-w-xs" title={customer.address}>
                        {customer.address || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {customer.password ? (
                        <div className="flex items-center gap-2 group">
                          <span className="text-sm font-mono text-gray-600">
                            {visiblePasswords[customer.id] ? customer.password : '••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(customer.id)}
                            className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{customer.totalBookings}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-green-600">₹{customer.totalSpent.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${customer.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {customer.status === 'active' ? '✓ Active' : '✗ Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {customer.status === 'active' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setConfirmDialog({
                                isOpen: true,
                                type: 'block',
                                customerId: customer.id,
                              })
                            }
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Block
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setConfirmDialog({
                                isOpen: true,
                                type: 'unblock',
                                customerId: customer.id,
                              })
                            }
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Unblock
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setConfirmDialog({
                              isOpen: true,
                              type: 'delete',
                              customerId: customer.id,
                            })
                          }
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={() => {
          if (confirmDialog.type === 'block') {
            handleBlockUser(confirmDialog.customerId);
          } else if (confirmDialog.type === 'unblock') {
            handleUnblockUser(confirmDialog.customerId);
          } else if (confirmDialog.type === 'delete') {
            handleDeleteUser(confirmDialog.customerId);
          }
        }}
        title={
          confirmDialog.type === 'block'
            ? 'Block Customer'
            : confirmDialog.type === 'unblock'
              ? 'Unblock Customer'
              : 'Delete Customer'
        }
        description={
          confirmDialog.type === 'block'
            ? 'Are you sure you want to block this customer? They will not be able to make bookings.'
            : confirmDialog.type === 'unblock'
              ? 'Are you sure you want to unblock this customer? They will be able to make bookings again.'
              : 'Are you sure you want to delete this customer? This action cannot be undone.'
        }
        confirmText={
          confirmDialog.type === 'block'
            ? 'Block'
            : confirmDialog.type === 'unblock'
              ? 'Unblock'
              : 'Delete'
        }
        variant={confirmDialog.type === 'delete' ? 'danger' : 'warning'}
      />
    </div>
  );
}
