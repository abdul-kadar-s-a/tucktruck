import { useState } from 'react';
import { ArrowLeft, Truck, Upload, X, Loader2 } from 'lucide-react';
import { User } from '../../App';

interface SignupDriverProps {
  onSignup: (user: User) => void;
  onBack: () => void;
}

export function SignupDriver({ onSignup, onBack }: SignupDriverProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    alternateContact: '',
    bloodGroup: '',
    vehicleType: '',
    vehicleNo: '',
    vehicleCapacity: '',
    licenseNo: '',
    bankAccount: '',
    bankIFSC: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [vehiclePhoto, setVehiclePhoto] = useState<string | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>(['']);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'vehicle') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setProfilePhoto(reader.result as string);
        } else {
          setVehiclePhoto(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addEmergencyContact = () => {
    if (emergencyContacts.length < 5) {
      setEmergencyContacts([...emergencyContacts, '']);
    }
  };

  const removeEmergencyContact = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const updateEmergencyContact = (index: number, value: string) => {
    const updated = [...emergencyContacts];
    updated[index] = value;
    setEmergencyContacts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters!');
        return;
      }
      setStep(2);
      return;
    }

    setIsLoading(true);

    try {
      const driverData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
        role: 'DRIVER',
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNo,
        vehicleCapacity: formData.vehicleCapacity,
        licenseNumber: formData.licenseNo,
        bankAccount: formData.bankAccount,
        bankIFSC: formData.bankIFSC,
        alternateContact: formData.alternateContact,
        bloodGroup: formData.bloodGroup,
        isOnline: false
      };

      const { api } = await import('../../services/api');
      await api.signup(driverData);

      alert('Account created successfully! Please login.');
      onBack();
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(`Failed to create account: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            onClick={() => step === 1 ? onBack() : setStep(1)}
            type="button"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-600 rounded-full p-3">
              <Truck className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-center text-gray-800 mb-2">Become a Driver Partner</h1>
          <p className="text-center text-gray-500 mb-6">
            Step {step} of 2: {step === 1 ? 'Personal Details' : 'Vehicle & Documents'}
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex gap-2">
              <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-green-600' : 'bg-gray-200'}`} />
              <div className={`flex-1 h-2 rounded ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Confirm password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Alternate Contact</label>
                    <input
                      type="tel"
                      value={formData.alternateContact}
                      onChange={(e) => setFormData({ ...formData, alternateContact: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">Home Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your full address"
                      required
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Blood Group (Optional)</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>


                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Emergency Contacts (up to 5)</label>
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="tel"
                        value={contact}
                        onChange={(e) => updateEmergencyContact(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder={`Emergency contact ${index + 1}`}
                      />
                      {emergencyContacts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmergencyContact(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {emergencyContacts.length < 5 && (
                    <button
                      type="button"
                      onClick={addEmergencyContact}
                      className="text-green-600 hover:text-green-700"
                    >
                      + Add Contact
                    </button>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Vehicle Type</label>
                    <select
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select Vehicle</option>
                      <option value="Tata Ace">Tata Ace</option>
                      <option value="Mahindra Pickup">Mahindra Pickup</option>
                      <option value="Eicher 14 Feet">Eicher 14 Feet</option>
                      <option value="Tata 407">Tata 407</option>
                      <option value="Ashok Leyland Dost">Ashok Leyland Dost</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Vehicle Number</label>
                    <input
                      type="text"
                      value={formData.vehicleNo}
                      onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="MH-12-AB-1234"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Vehicle Capacity (kg)</label>
                    <input
                      type="number"
                      value={formData.vehicleCapacity}
                      onChange={(e) => setFormData({ ...formData, vehicleCapacity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="1000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">License Number</label>
                    <input
                      type="text"
                      value={formData.licenseNo}
                      onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="DL-1234567890"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Bank Account Number</label>
                    <input
                      type="text"
                      value={formData.bankAccount}
                      onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="1234567890"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">IFSC Code</label>
                    <input
                      type="text"
                      value={formData.bankIFSC}
                      onChange={(e) => setFormData({ ...formData, bankIFSC: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="SBIN0001234"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Profile Photo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {profilePhoto ? (
                        <div className="relative">
                          <img src={profilePhoto} alt="Profile" className="w-full h-32 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => setProfilePhoto(null)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'profile')}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Vehicle Photo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {vehiclePhoto ? (
                        <div className="relative">
                          <img src={vehiclePhoto} alt="Vehicle" className="w-full h-32 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => setVehiclePhoto(null)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'vehicle')}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                step === 1 ? 'Next Step' : 'Complete Registration'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
