import { useState } from 'react';
import { DollarSign, TrendingUp, Wallet, ArrowDownToLine, Clock, CheckCircle2, X } from 'lucide-react';
import { User } from '../../App';

interface DriverEarningsProps {
  user: User;
}

interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  description: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'earning', amount: 450, date: '2026-01-17', status: 'completed', description: 'Trip #TT1234' },
  { id: '2', type: 'earning', amount: 680, date: '2026-01-17', status: 'completed', description: 'Trip #TT1235' },
  { id: '3', type: 'withdrawal', amount: 500, date: '2026-01-16', status: 'completed', description: 'Bank Transfer' },
  { id: '4', type: 'earning', amount: 920, date: '2026-01-16', status: 'completed', description: 'Trip #TT1236' },
  { id: '5', type: 'earning', amount: 550, date: '2026-01-15', status: 'completed', description: 'Trip #TT1237' },
];

export function DriverEarnings({ user }: DriverEarningsProps) {
  const [totalEarnings] = useState(3000);
  const [withdrawnAmount] = useState(500);
  const [perKmRate, setPerKmRate] = useState(15);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('XXXX-XXXX-1234');
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const availableBalance = totalEarnings - withdrawnAmount;
  const todayEarnings = transactions
    .filter(t => t.type === 'earning' && t.date === '2026-01-17')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);

    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > availableBalance) {
      alert('Insufficient balance');
      return;
    }

    // Simulate withdrawal
    alert(`₹${amount} withdrawal request submitted. Amount will be transferred to ${bankAccount} within 24 hours.`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const handleUpdateRate = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Per km rate updated to ₹${perKmRate}. This rate will be visible to users and admin.`);
    setShowRateModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-800 mb-2">Earnings & Withdrawals</h2>
        <p className="text-gray-600">Manage your earnings and withdrawal requests</p>
      </div>

      {/* Earnings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-90">Available</span>
          </div>
          <p className="text-3xl mb-1">₹{availableBalance.toLocaleString()}</p>
          <p className="text-sm opacity-90">Current Balance</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-90">Today</span>
          </div>
          <p className="text-3xl mb-1">₹{todayEarnings.toLocaleString()}</p>
          <p className="text-sm opacity-90">Today's Earnings</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-90">Total</span>
          </div>
          <p className="text-3xl mb-1">₹{totalEarnings.toLocaleString()}</p>
          <p className="text-sm opacity-90">Total Earnings</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="flex items-center justify-center gap-3 bg-white border-2 border-green-600 text-green-600 p-4 rounded-xl hover:bg-green-50 transition-all shadow-sm hover:shadow-md"
        >
          <ArrowDownToLine className="w-6 h-6" />
          <div className="text-left">
            <p className="font-medium">Withdraw Money</p>
            <p className="text-sm opacity-80">Transfer to bank account</p>
          </div>
        </button>

        <button
          onClick={() => setShowRateModal(true)}
          className="flex items-center justify-center gap-3 bg-white border-2 border-blue-600 text-blue-600 p-4 rounded-xl hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
        >
          <DollarSign className="w-6 h-6" />
          <div className="text-left">
            <p className="font-medium">Update Per Km Rate</p>
            <p className="text-sm opacity-80">Current: ₹{perKmRate}/km</p>
          </div>
        </button>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-gray-800 mb-4">Transaction History</h3>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-3 ${
                  transaction.type === 'earning' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {transaction.type === 'earning' ? (
                    <TrendingUp className={`w-5 h-5 ${
                      transaction.type === 'earning' ? 'text-green-600' : 'text-orange-600'
                    }`} />
                  ) : (
                    <ArrowDownToLine className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {new Date(transaction.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-medium ${
                  transaction.type === 'earning' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {transaction.type === 'earning' ? '+' : '-'}₹{transaction.amount}
                </p>
                <div className="flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-gray-500 capitalize">{transaction.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800">Withdraw Money</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                <p className="text-2xl text-green-600">₹{availableBalance.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter amount"
                    min="1"
                    max={availableBalance}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Bank Account</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter bank account"
                  required
                />
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Withdrawal requests are processed within 24 hours. Amount will be transferred to your registered bank account.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Per Km Rate Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800">Update Per Km Rate</h3>
              <button
                onClick={() => setShowRateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUpdateRate} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Per Kilometer Rate</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={perKmRate}
                    onChange={(e) => setPerKmRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter rate"
                    min="1"
                    step="0.5"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">/km</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This rate will be visible to users and admin. It will be used for calculating trip fares.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRateModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
