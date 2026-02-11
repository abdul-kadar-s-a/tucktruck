import { useState } from 'react';
import { CreditCard, Smartphone, Wallet, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface PaymentDetailsProps {
  paymentMethod: 'upi' | 'card' | 'wallet';
  onBack: () => void;
  onProceed: () => void;
  amount: number;
}

export function PaymentDetails({ paymentMethod, onBack, onProceed, amount }: PaymentDetailsProps) {
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [walletNumber, setWalletNumber] = useState('');
  const [walletPin, setWalletPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      onProceed();
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Details</h2>
          <p className="text-gray-600">Complete your payment to confirm booking</p>
        </div>

        {/* Amount Display */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">₹{amount.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* UPI Payment */}
          {paymentMethod === 'upi' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">UPI Payment</h3>
                  <p className="text-sm text-gray-600">Test UPI for demo purposes</p>
                </div>
              </div>

              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  required
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">Enter any test UPI ID (e.g., test@paytm)</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a test payment. No actual transaction will be processed.
                </p>
              </div>
            </div>
          )}

          {/* Card Payment */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Debit/Credit Card</h3>
                  <p className="text-sm text-gray-600">Test Card for demo purposes</p>
                </div>
              </div>

              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '');
                    if (value.length <= 16 && /^\d*$/.test(value)) {
                      setCardNumber(value.replace(/(\d{4})/g, '$1 ').trim());
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={19}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">Use: 4111 1111 1111 1111 (test card)</p>
              </div>

              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Name on card"
                  required
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setCardExpiry(value);
                    }}
                    placeholder="MM/YY"
                    required
                    maxLength={5}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="cardCVV">CVV</Label>
                  <Input
                    id="cardCVV"
                    type="password"
                    value={cardCVV}
                    onChange={(e) => {
                      if (e.target.value.length <= 3 && /^\d*$/.test(e.target.value)) {
                        setCardCVV(e.target.value);
                      }
                    }}
                    placeholder="123"
                    required
                    maxLength={3}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a test payment. Use card: 4111 1111 1111 1111
                </p>
              </div>
            </div>
          )}

          {/* Wallet Payment */}
          {paymentMethod === 'wallet' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <Wallet className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Digital Wallet</h3>
                  <p className="text-sm text-gray-600">Test Wallet for demo purposes</p>
                </div>
              </div>

              <div>
                <Label htmlFor="walletNumber">Wallet Phone Number</Label>
                <Input
                  id="walletNumber"
                  type="tel"
                  value={walletNumber}
                  onChange={(e) => {
                    if (e.target.value.length <= 10 && /^\d*$/.test(e.target.value)) {
                      setWalletNumber(e.target.value);
                    }
                  }}
                  placeholder="9876543210"
                  required
                  maxLength={10}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">Enter any 10-digit number (test wallet)</p>
              </div>

              <div>
                <Label htmlFor="walletPin">Wallet PIN</Label>
                <Input
                  id="walletPin"
                  type="password"
                  value={walletPin}
                  onChange={(e) => {
                    if (e.target.value.length <= 4 && /^\d*$/.test(e.target.value)) {
                      setWalletPin(e.target.value);
                    }
                  }}
                  placeholder="****"
                  required
                  maxLength={4}
                  className="mt-2"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a test payment. No actual transaction will be processed.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
          >
            Pay ₹{amount.toFixed(2)} & Confirm Booking
          </Button>
        </form>
      </div>
    </div>
  );
}
