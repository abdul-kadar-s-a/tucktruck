import { useState } from 'react';
import { Truck, Plus, Edit2, Image as ImageIcon, X, Check } from 'lucide-react';
import { User } from '../../App';

interface DriverVehicleProps {
  user: User;
}

interface Vehicle {
  id: string;
  type: string;
  registrationNumber: string;
  model: string;
  capacity: string;
  ratePerKm: number;
  image: string | null;
  status: 'active' | 'inactive';
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    type: 'Tata Ace',
    registrationNumber: 'TN-01-AB-1234',
    model: '2023',
    capacity: '750 kg',
    ratePerKm: 15,
    image: null,
    status: 'active',
  },
];

export function DriverVehicle({ user }: DriverVehicleProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    // Try to load from driver's profile if available, otherwise mock
    const allDrivers = JSON.parse(localStorage.getItem('drivers') || '[]');
    const currentDriver = allDrivers.find((d: any) => d.id === user.id);
    if (currentDriver && currentDriver.vehicleImage) {
      return [{
        id: '1',
        type: currentDriver.vehicle || 'Tata Ace',
        registrationNumber: currentDriver.vehicleNo || 'TN-01-AB-1234',
        model: '2023',
        capacity: '750 kg',
        ratePerKm: Number(currentDriver.ratePerKm) || 15,
        image: currentDriver.vehicleImage,
        status: 'active'
      }];
    }
    return mockVehicles;
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Validation
    const regNumber = formData.get('registrationNumber') as string;
    const regNumberPattern = /^[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}$/;

    if (!regNumberPattern.test(regNumber)) {
      alert('Invalid registration number format. Use: TN-01-AB-1234');
      return;
    }

    const newVehicle: Vehicle = {
      id: editingVehicle?.id || Math.random().toString(36).substr(2, 9),
      type: formData.get('type') as string,
      registrationNumber: regNumber,
      model: formData.get('model') as string,
      capacity: formData.get('capacity') as string,
      ratePerKm: Number(formData.get('ratePerKm') || 15),
      image: uploadedImage,
      status: 'active',
    };

    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? newVehicle : v));
      alert('Vehicle updated successfully! Image is now visible to users and admin.');
    } else {
      setVehicles([...vehicles, newVehicle]);
      alert('Vehicle added successfully! Image is now visible to users and admin.');
    }

    // PERSIST TO LOCAL STORAGE for User app visibility
    if (user.id) {
      const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
      const updatedDrivers = drivers.map((d: any) => {
        if (d.id === user.id) {
          // Always update driver profile with the primary active vehicle details
          const updates: any = {
            vehicle: formData.get('type'),
            vehicleNo: regNumber,
            ratePerKm: Number(formData.get('ratePerKm') || 15)
          };

          if (uploadedImage) {
            updates.vehicleImage = uploadedImage;
          }

          return { ...d, ...updates };
        }
        return d;
      });
      localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
    }

    setShowAddModal(false);
    setEditingVehicle(null);
    setUploadedImage(null);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setUploadedImage(vehicle.image);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-800 mb-2">My Vehicles</h2>
          <p className="text-gray-600">Manage your vehicle details and images</p>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true);
            setEditingVehicle(null);
            setUploadedImage(null);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      {/* Vehicle List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Vehicle Image */}
            <div className="h-48 bg-gray-100 flex items-center justify-center relative">
              {vehicle.image ? (
                <img
                  src={vehicle.image}
                  alt={vehicle.type}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No image uploaded</p>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-xs ${vehicle.status === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-400 text-white'
                  }`}>
                  {vehicle.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-800">{vehicle.type}</h3>
                  <p className="text-sm text-gray-600">{vehicle.model}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Registration</span>
                  <span className="text-sm text-gray-800 font-medium">{vehicle.registrationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Capacity</span>
                  <span className="text-sm text-gray-800 font-medium">{vehicle.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rate/km</span>
                  <span className="text-sm text-green-600 font-bold">₹{vehicle.ratePerKm}</span>
                </div>
              </div>

              <button
                onClick={() => handleEdit(vehicle)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingVehicle(null);
                  setUploadedImage(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 mb-2">Vehicle Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {uploadedImage ? (
                    <div className="relative">
                      <img
                        src={uploadedImage}
                        alt="Vehicle"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 mb-1">Click to upload vehicle image</span>
                      <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  <Check className="w-3 h-3 inline" /> This image will be visible to users and admin
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Vehicle Type *</label>
                  <select
                    name="type"
                    defaultValue={editingVehicle?.type}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Tata Ace">Tata Ace</option>
                    <option value="Mahindra Bolero Pickup">Mahindra Bolero Pickup</option>
                    <option value="Ashok Leyland Dost">Ashok Leyland Dost</option>
                    <option value="Eicher Pro 1049">Eicher Pro 1049</option>
                    <option value="Force Tempo Traveller">Force Tempo Traveller</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Registration Number *</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    defaultValue={editingVehicle?.registrationNumber}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="TN-01-AB-1234"
                    pattern="[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}"
                    title="Format: TN-01-AB-1234"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Model Year *</label>
                  <input
                    type="number"
                    name="model"
                    defaultValue={editingVehicle?.model}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2023"
                    min="2000"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Capacity *</label>
                  <input
                    type="text"
                    name="capacity"
                    defaultValue={editingVehicle?.capacity}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="750 kg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Rate per km (₹) *</label>
                  <input
                    type="number"
                    name="ratePerKm"
                    defaultValue={editingVehicle?.ratePerKm || 15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15"
                    min="10"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Please ensure all details are correct. Invalid data will show warnings.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingVehicle(null);
                    setUploadedImage(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingVehicle ? 'Update' : 'Add'} Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
