import { useState, useEffect } from 'react';
import { Splash } from './components/Splash';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/auth/Login';
import { SignupCustomer } from './components/auth/SignupCustomer';
import { SignupDriver } from './components/auth/SignupDriver';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import { SocketProvider } from './contexts/SocketContext';
import { ToastProvider } from './components/ui/toast';

export type UserType = 'customer' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  profilePhoto?: string;
  address?: string;
  status?: string;
  approved?: boolean;
  rating?: number;
  trips?: number;
  zone?: string;
}

function App() {
  // Enable splash screen for production-like feel
  const [showSplash, setShowSplash] = useState(true);
  const [showLanding, setShowLanding] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup-customer' | 'signup-driver' | 'forgot-password' | 'admin-login' | 'dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [forgotPasswordUserType, setForgotPasswordUserType] = useState<UserType>('customer');

  useEffect(() => {
    // Show splash for 4 seconds (currently disabled for development)
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setShowLanding(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Check if URL contains /admin for direct admin access
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#/admin') {
      setCurrentScreen('admin-login');
    }
  }, []);

  const handleLogin = (user: User) => {
    console.log('📱 App.handleLogin called with user:', user);
    setCurrentUser(user);
    setCurrentScreen('dashboard');
    console.log('📱 Screen changed to: dashboard');
  };

  const handleForgotPassword = (userType: UserType) => {
    console.log('📱 App.handleForgotPassword called for:', userType);
    setForgotPasswordUserType(userType);
    setCurrentScreen('forgot-password');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  if (showSplash) {
    return <Splash />;
  }

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (currentScreen === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onSignupCustomer={() => {
          console.log('📱 Navigating to signup-customer');
          setCurrentScreen('signup-customer');
        }}
        onSignupDriver={() => {
          console.log('📱 Navigating to signup-driver');
          setCurrentScreen('signup-driver');
        }}
        onForgotPassword={() => handleForgotPassword('customer')}
      />
    );
  }

  if (currentScreen === 'signup-customer') {
    return (
      <SignupCustomer
        onSignup={handleLogin}
        onBack={() => setCurrentScreen('login')}
      />
    );
  }

  if (currentScreen === 'signup-driver') {
    return (
      <SignupDriver
        onSignup={handleLogin}
        onBack={() => setCurrentScreen('login')}
      />
    );
  }

  if (currentScreen === 'forgot-password') {
    return (
      <ForgotPassword
        onBack={() => setCurrentScreen('login')}
        userType={forgotPasswordUserType}
      />
    );
  }

  if (currentScreen === 'dashboard' && currentUser) {
    if (currentUser.type === 'customer') {
      return <CustomerDashboard user={currentUser} onLogout={handleLogout} />;
    }
    if (currentUser.type === 'driver') {
      return <DriverDashboard user={currentUser} onLogout={handleLogout} />;
    }
    if (currentUser.type === 'admin') {
      return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
    }
  }

  return <Login onLogin={handleLogin} onSignupCustomer={() => setCurrentScreen('signup-customer')} onSignupDriver={() => setCurrentScreen('signup-driver')} onForgotPassword={() => handleForgotPassword('customer')} />;
}

function AppWithProvider() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <ToastProvider>
      <LanguageProvider>
        <SocketProvider user={currentUser}>
          <App />
        </SocketProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}

export default AppWithProvider;