import { Truck, Package, MapPin, Clock, Shield, IndianRupee } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                TUCK<span className="text-blue-600">TRUCK</span>
              </h1>
              <p className="text-xs text-gray-600">Commercial Vehicle Booking</p>
            </div>
          </div>
          <Button onClick={onGetStarted} variant="default" className="bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Book Commercial Vehicles
          <br />
          <span className="text-blue-600">Anytime, Anywhere</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with verified drivers for light and medium commercial vehicles. 
          Fast, reliable, and affordable transport solutions for your business.
        </p>
        <Button 
          onClick={onGetStarted} 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
        >
          Book Your Vehicle Now
        </Button>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose TUCKTRUCK?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Real-Time Tracking</h4>
            <p className="text-gray-600">
              Track your shipment in real-time with our 7-stage delivery tracking system from pickup to delivery.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Verified Drivers</h4>
            <p className="text-gray-600">
              All our drivers are verified with proper documentation and vehicle inspection for your safety.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <IndianRupee className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Cash on Delivery</h4>
            <p className="text-gray-600">
              Pay in cash after successful delivery. No online payment required. Simple and convenient.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Multiple Vehicle Types</h4>
            <p className="text-gray-600">
              Choose from various light and medium commercial vehicles based on your cargo requirements.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Distance-Based Pricing</h4>
            <p className="text-gray-600">
              Transparent pricing based on distance, driver's per km rate, and toll charges. No hidden fees.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 text-teal-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">24/7 Availability</h4>
            <p className="text-gray-600">
              Book vehicles round the clock. Emergency transport needs? We've got you covered anytime.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Book Vehicle</h4>
              <p className="text-gray-600">Select vehicle type and enter pickup & drop locations</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Driver Assigned</h4>
              <p className="text-gray-600">Get matched with a nearby verified driver instantly</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Track Delivery</h4>
              <p className="text-gray-600">Monitor your shipment in real-time through all stages</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h4 className="text-lg font-semibold mb-2">Pay on Delivery</h4>
              <p className="text-gray-600">Pay cash to driver after successful delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied customers using TUCKTRUCK for their transport needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onGetStarted} 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
            >
              Book as Customer
            </Button>
            <Button 
              onClick={onGetStarted} 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8"
            >
              Join as Driver
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Truck className="w-6 h-6" />
            <span className="text-xl font-bold">TUCKTRUCK</span>
          </div>
          <p className="text-gray-400 mb-2">Commercial Vehicle Booking System</p>
          <p className="text-gray-500 text-sm">© 2026 TUCKTRUCK. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
