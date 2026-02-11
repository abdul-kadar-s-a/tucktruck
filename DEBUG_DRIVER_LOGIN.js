// DEBUG SCRIPT FOR DRIVER LOGIN
// Copy and paste this into your browser console to add a test driver

console.log('🔧 TUCKTRUCK Driver Login Debug Script');
console.log('=====================================\n');

// Create a test driver with all required fields
const testDriver = {
    id: 'DR-TEST-001',
    name: 'Test Driver',
    email: 'driver@test.com',
    phone: '9876543210',
    password: 'password123',
    type: 'driver',
    status: 'online',
    approved: true,
    rating: 5.0,
    trips: 0,
    zone: 'Chennai',
    vehicle: 'Tata Ace',
    vehicleNo: 'TN-01-AB-1234',
    vehicleType: 'Tata Ace',
    vehicleCapacity: '750',
    address: 'Test Address, Chennai, Tamil Nadu',
    licenseNo: 'TN-1234567890',
    bankAccount: '1234567890',
    bankIFSC: 'SBIN0001234',
    alternateContact: '9876543211',
    bloodGroup: 'O+',
    emergencyContacts: ['9876543212', '9876543213']
};

// Get existing drivers
const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');

// Check if test driver already exists
const exists = drivers.some(d => d.email === testDriver.email);

if (exists) {
    console.log('⚠️  Test driver already exists!');
    console.log('📧 Email: driver@test.com');
    console.log('🔑 Password: password123\n');
} else {
    // Add test driver
    drivers.push(testDriver);
    localStorage.setItem('drivers', JSON.stringify(drivers));

    console.log('✅ Test driver added successfully!');
    console.log('📧 Email: driver@test.com');
    console.log('🔑 Password: password123\n');
}

// Display all drivers
console.log('📋 All Drivers in localStorage:');
console.table(drivers.map(d => ({
    ID: d.id,
    Name: d.name,
    Email: d.email,
    Vehicle: d.vehicle || d.vehicleType,
    Status: d.status,
    'Has Password': d.password ? '✅ Yes' : '❌ No'
})));

console.log('\n🎯 Next Steps:');
console.log('1. Go to login page');
console.log('2. Select "Driver" user type');
console.log('3. Enter email: driver@test.com');
console.log('4. Enter password: password123');
console.log('5. Click "Sign In"');
console.log('\n✨ You should be logged in as a driver!');
