import { useState } from 'react';
import { Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
  userType: 'customer' | 'driver' | 'admin';
}

type Step = 'email' | 'otp' | 'newPassword' | 'success';

export function ForgotPassword({ onBack, userType }: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    // Simulate API call to send OTP
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      alert(`OTP sent to ${email}`);
    }, 1500);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    // Simulate API call to verify OTP
    setTimeout(() => {
      setLoading(false);
      // Mock verification (in real app, verify with backend)
      if (otpValue === '123456') {
        setStep('newPassword');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    // Simulate API call to reset password
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const getUserTypeLabel = () => {
    return userType === 'customer' ? 'User' : userType.charAt(0).toUpperCase() + userType.slice(1);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-gray-800 mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been updated successfully. You can now login with your new password.
          </p>
          <button
            onClick={onBack}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (step === 'newPassword') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <button
            onClick={() => setStep('otp')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="text-center mb-8">
            <h2 className="text-gray-800 mb-2">Create New Password</h2>
            <p className="text-gray-600">
              Enter your new password for {getUserTypeLabel()} account
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <button
            onClick={() => setStep('email')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="text-center mb-8">
            <h2 className="text-gray-800 mb-2">Enter OTP</h2>
            <p className="text-gray-600">
              We've sent a 6-digit code to<br />
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => alert('OTP resent successfully!')}
                className="text-green-600 hover:text-green-700"
              >
                Resend OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Email step
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <h2 className="text-gray-800 mb-2">Forgot Password</h2>
          <p className="text-gray-600">
            Enter your registered email to receive OTP
          </p>
        </div>

        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}