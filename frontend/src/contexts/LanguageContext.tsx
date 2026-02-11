import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ta' | 'hi' | 'te';

interface Translations {
  [key: string]: {
    en: string;
    ta: string;
    hi: string;
    te: string;
  };
}

const translations: Translations = {
  // Common
  welcome: { en: 'Welcome', ta: 'வரவேற்கிறோம்', hi: 'स्वागत है', te: 'స్వాగతం' },
  home: { en: 'Home', ta: 'முகப்பு', hi: 'होम', te: 'హోమ్' },
  bookVehicle: { en: 'Book Vehicle', ta: 'வாகனம் பதிவு செய்யவும்', hi: 'वाहन बुक करें', te: 'వాహనం బుక్ చేయండి' },
  myBookings: { en: 'My Bookings', ta: 'எனது பதிவுகள்', hi: 'मेरी बुकिंग', te: 'నా బుకింగ్‌లు' },
  profile: { en: 'Profile', ta: 'சுயவிவரம்', hi: 'प्रोफ़ाइल', te: 'ప్రొఫైల్' },
  savedAddresses: { en: 'Saved Addresses', ta: 'சேமித்த முகவரிகள்', hi: 'सहेजे गए पते', te: 'సేవ్ చేసిన చిరునామాలు' },
  
  // Stats
  activeBookings: { en: 'Active Bookings', ta: 'செயலில் உள்ள பதிவுகள்', hi: 'सक्रिय बुकिंग', te: 'క్రియాశీల బుకింగ్‌లు' },
  totalBookings: { en: 'Total Bookings', ta: 'மொத்த பதிவுகள்', hi: 'कुल बुकिंग', te: 'మొత్తం బుకింగ్‌లు' },
  todayEarnings: { en: "Today's Earnings", ta: 'இன்றைய வருமானம்', hi: 'आज की कमाई', te: 'నేటి సంపాదన' },
  totalTrips: { en: 'Total Trips', ta: 'மொத்த பயணங்கள்', hi: 'कुल यात्राएं', te: 'మొత్తం ప్రయాణాలు' },
  
  // Booking
  pickupAddress: { en: 'Pickup Address', ta: 'எடுத்துச் செல்லும் முகவரி', hi: 'पिकअप पता', te: 'పికప్ చిరునామా' },
  dropoffAddress: { en: 'Drop-off Address', ta: 'இறக்கும் முகவரி', hi: 'ड्रॉप-ऑफ पता', te: 'డ్రాప్-ఆఫ్ చిరునామా' },
  estimatedFare: { en: 'Estimated Fare', ta: 'மதிப்பீட்டு கட்டணம்', hi: 'अनुमानित किराया', te: 'అంచనా ఛార్జీ' },
  confirmBooking: { en: 'Confirm Booking', ta: 'பதிவை உறுதிப்படுத்தவும்', hi: 'बुकिंग की पुष्टि करें', te: 'బుకింగ్‌ను నిర్ధారించండి' },
  
  // Payment
  cashOnDelivery: { en: 'Cash on Delivery', ta: 'பணம் செலுத்துதல்', hi: 'कैश ऑन डिलीवरी', te: 'క్యాష్ ఆన్ డెలివరీ' },
  cardOnDelivery: { en: 'Card on Delivery', ta: 'கார்டு செலுத்துதல்', hi: 'कार्ड ऑन डिलीवरी', te: 'కార్డ్ ఆన్ డెలివరీ' },
  upiOnDelivery: { en: 'UPI on Delivery', ta: 'UPI செலுத்துதல்', hi: 'UPI ऑन डिलीवरी', te: 'UPI ఆన్ డెలివరీ' },
  
  // Driver
  acceptBooking: { en: 'Accept Booking', ta: 'பதிவை ஏற்கவும்', hi: 'बुकिंग स्वीकार करें', te: 'బుకింగ్‌ను అంగీకరించండి' },
  rejectBooking: { en: 'Reject Booking', ta: 'பதிவை நிராகரிக்கவும்', hi: 'बुकिंग अस्वीकार करें', te: 'బుకింగ్‌ను తిరస్కరించండి' },
  reachedPickup: { en: 'Reached Pickup', ta: 'எடுக்கும் இடத்தை அடைந்தது', hi: 'पिकअप पर पहुंचे', te: 'పికప్‌కు చేరుకున్నాను' },
  pickedUp: { en: 'Picked Up', ta: 'எடுத்துச் செல்லப்பட்டது', hi: 'उठा लिया', te: 'తీసుకున్నాను' },
  inTransit: { en: 'In Transit', ta: 'போக்குவரத்தில்', hi: 'यात्रा में', te: 'రవాణాలో' },
  reachedDropoff: { en: 'Reached Drop-off', ta: 'இறக்கும் இடத்தை அடைந்தது', hi: 'ड्रॉप-ऑफ पर पहुंचे', te: 'డ్రాప్-ఆఫ్‌కు చేరుకున్నాను' },
  delivered: { en: 'Delivered', ta: 'வழங்கப்பட்டது', hi: 'डिलीवर किया', te: 'డెలివర్ చేశాను' },
  moneyReceived: { en: 'Money Received', ta: 'பணம் பெறப்பட்டது', hi: 'पैसे प्राप्त हुए', te: 'డబ్బు అందుకున్నాను' },
  
  // Actions
  call: { en: 'Call', ta: 'அழை', hi: 'कॉल करें', te: 'కాల్ చేయండి' },
  cancel: { en: 'Cancel', ta: 'ரத்து செய்', hi: 'रद्द करें', te: 'రద్దు చేయండి' },
  modify: { en: 'Modify', ta: 'மாற்று', hi: 'संशोधित करें', te: 'మార్చండి' },
  track: { en: 'Track', ta: 'கண்காணி', hi: 'ट्रैक करें', te: 'ట్రాక్ చేయండి' },
  emergency: { en: 'Emergency', ta: 'அவசரம்', hi: 'आपातकाल', te: 'అత్యవసరం' },
  logout: { en: 'Logout', ta: 'வெளியேறு', hi: 'लॉगआउट', te: 'లాగ్అవుట్' },
  
  // Admin
  dashboard: { en: 'Dashboard', ta: 'டாஷ்போர்டு', hi: 'डैशबोर्ड', te: 'డాష్‌బోర్డ్' },
  manageDrivers: { en: 'Manage Drivers', ta: 'இயக்குநர்களை நிர்வகி', hi: 'ड्राइवरों को प्रबंधित करें', te: 'డ్రైవర్‌లను నిర్వహించండి' },
  manageBookings: { en: 'Manage Bookings', ta: 'பதிவுகளை நிர்வகி', hi: 'बुकिंग प्रबंधित करें', te: 'బుకింగ్‌లను నిర్వహించండి' },
  totalDrivers: { en: 'Total Drivers', ta: 'மொத்த இயக்குநர்கள்', hi: 'कुल ड्राइवर', te: 'మొత్తం డ్రైవర్లు' },
  todayRevenue: { en: "Today's Revenue", ta: 'இன்றைய வருவாய்', hi: 'आज का राजस्व', te: 'నేటి ఆదాయం' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
