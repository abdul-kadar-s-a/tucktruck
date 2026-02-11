import { Phone, AlertTriangle, X, Shield } from 'lucide-react';

interface EmergencyCallProps {
  onClose: () => void;
  driverPhone?: string;
  adminPhone?: string;
}

export function EmergencyCall({ onClose, driverPhone, adminPhone }: EmergencyCallProps) {
  const handleCall = (number: string, type: string) => {
    // In real app, this would initiate a call
    alert(`Calling ${type}: ${number}`);
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-gray-800">Emergency Contact</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-3">
          {driverPhone && (
            <button
              onClick={() => handleCall(driverPhone, 'Driver')}
              className="w-full flex items-center gap-4 p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 transition-all group"
            >
              <div className="bg-green-600 rounded-full p-3 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-800">Call Driver</p>
                <p className="text-sm text-gray-600">{driverPhone}</p>
              </div>
            </button>
          )}

          <button
            onClick={() => handleCall(adminPhone || '+91 1800-123-4567', 'Admin Support')}
            className="w-full flex items-center gap-4 p-4 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-all group"
          >
            <div className="bg-red-600 rounded-full p-3 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-800">Call Admin Support</p>
              <p className="text-sm text-gray-600">{adminPhone || '+91 1800-123-4567'}</p>
            </div>
          </button>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Emergency calls are recorded for quality and safety purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
