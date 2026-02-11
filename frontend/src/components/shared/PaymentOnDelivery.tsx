import { useState } from 'react';
import { DollarSign, CreditCard, Smartphone, CheckCircle, X } from 'lucide-react';

interface PaymentOnDeliveryProps {
  totalAmount: number;
  onConfirm: (method: 'cod' | 'card' | 'upi', details: any) => void;
  onCancel: () => void;
}

type PaymentMethod = 'cod' | 'card' | 'upi';

export function PaymentOnDelivery({ totalAmount, onConfirm, onCancel }: PaymentOnDeliveryProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cod');
  const [upiId, setUpiId] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    setError('');

    if (selectedMethod === 'upi') {
      // Validate UPI ID
      const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
      if (!upiId) {
        setError('Please enter your UPI ID');
        return;
      }
      if (!upiRegex.test(upiId)) {
        setError('Invalid UPI ID format (e.g., username@upi)');
        return;
      }
      onConfirm('upi', { upiId });
    } else if (selectedMethod === 'card') {
      // Validate cardholder name
      if (!cardholderName.trim()) {
        setError('Please enter cardholder name');
        return;
      }
      if (cardholderName.length < 3) {
        setError('Cardholder name must be at least 3 characters');
        return;
      }
      if (!/^[a-zA-Z\s]+$/.test(cardholderName)) {
        setError('Cardholder name should only contain letters');
        return;
      }
      onConfirm('card', { cardholderName });
    } else {
      onConfirm('cod', {});
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-gray-800 mb-1">Select Payment Method</h3>
            <p className="text-sm text-gray-600">Payment will be collected on delivery</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Total Amount */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Total Amount to Pay</p>
          <p className="text-3xl text-gray-800">₹{totalAmount.toFixed(2)}</p>
        </div>

        {/* Payment Method Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => {
              setSelectedMethod('cod');
              setError('');
            }}
            className={`p-6 border-2 rounded-xl transition-all text-center ${
              selectedMethod === 'cod'
                ? 'border-green-600 bg-green-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`rounded-full p-4 mx-auto mb-3 w-fit ${
              selectedMethod === 'cod' ? 'bg-green-600' : 'bg-gray-200'
            }`}>
              <DollarSign className={`w-8 h-8 ${
                selectedMethod === 'cod' ? 'text-white' : 'text-gray-600'
              }`} />
            </div>
            <p className={`font-medium mb-1 ${
              selectedMethod === 'cod' ? 'text-green-600' : 'text-gray-800'
            }`}>
              Cash on Delivery
            </p>
            <p className="text-xs text-gray-600">Pay with cash when driver arrives</p>
          </button>

          <button
            onClick={() => {
              setSelectedMethod('card');
              setError('');
            }}
            className={`p-6 border-2 rounded-xl transition-all text-center ${
              selectedMethod === 'card'
                ? 'border-blue-600 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`rounded-full p-4 mx-auto mb-3 w-fit ${
              selectedMethod === 'card' ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
              <CreditCard className={`w-8 h-8 ${
                selectedMethod === 'card' ? 'text-white' : 'text-gray-600'
              }`} />
            </div>
            <p className={`font-medium mb-1 ${
              selectedMethod === 'card' ? 'text-blue-600' : 'text-gray-800'
            }`}>
              Card on Delivery
            </p>
            <p className="text-xs text-gray-600">Pay with card/POS at delivery</p>
          </button>

          <button
            onClick={() => {
              setSelectedMethod('upi');
              setError('');
            }}
            className={`p-6 border-2 rounded-xl transition-all text-center ${
              selectedMethod === 'upi'
                ? 'border-purple-600 bg-purple-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`rounded-full p-4 mx-auto mb-3 w-fit ${
              selectedMethod === 'upi' ? 'bg-purple-600' : 'bg-gray-200'
            }`}>
              <Smartphone className={`w-8 h-8 ${
                selectedMethod === 'upi' ? 'text-white' : 'text-gray-600'
              }`} />
            </div>
            <p className={`font-medium mb-1 ${
              selectedMethod === 'upi' ? 'text-purple-600' : 'text-gray-800'
            }`}>
              UPI on Delivery
            </p>
            <p className="text-xs text-gray-600">Pay via UPI at delivery</p>
          </button>
        </div>

        {/* Payment Method Details */}
        <div className="mb-6">
          {selectedMethod === 'cod' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                <strong>Cash on Delivery:</strong> Please keep exact change ready. Driver will collect ₹{totalAmount.toFixed(2)} in cash at the time of delivery.
              </p>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  <strong>Card on Delivery:</strong> Driver will carry a POS machine. You can pay with Credit/Debit card at delivery.
                </p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Cardholder Name (Optional)</label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter cardholder name"
                />
                <p className="text-xs text-gray-500 mt-1">This helps driver verify your identity</p>
              </div>
            </div>
          )}

          {selectedMethod === 'upi' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  <strong>UPI on Delivery:</strong> Driver will share QR code or UPI ID. You can pay via any UPI app (PhonePe, GPay, Paytm, etc.).
                </p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Your UPI ID *</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="username@upi"
                  required={selectedMethod === 'upi'}
                />
                <p className="text-xs text-gray-500 mt-1">We'll share this with driver for payment verification</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Important Note */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Payment will be collected after successful delivery. Driver will confirm payment receipt before completing the trip.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-6 py-3 text-white rounded-lg transition-colors ${
              selectedMethod === 'cod' ? 'bg-green-600 hover:bg-green-700' :
              selectedMethod === 'card' ? 'bg-blue-600 hover:bg-blue-700' :
              'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
