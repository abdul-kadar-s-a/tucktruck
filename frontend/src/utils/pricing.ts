// Tamil Nadu Cities and their aliases for location matching
const cityMap: { [key: string]: string[] } = {
  chennai: ['madras', 'tambaram', 'guindy', 'velachery', 'porur', 'anna nagar'],
  trichy: ['tiruchirappalli', 'tiruverumbur', 'thiruverumbur', 'srirangam', 'ponmalai'],
  madurai: ['thirumangalam', 'tirumangalam', 'melur', 'vadipatti'],
  coimbatore: ['kovai', 'tiruppur', 'pollachi', 'mettupalayam'],
  salem: ['yercaud', 'attur', 'sankagiri'],
  thanjavur: ['tanjore', 'kumbakonam', 'papanasam'],
  vellore: ['arcot', 'ranipet', 'katpadi'],
  tirunelveli: ['palayamkottai', 'tenkasi', 'ambasamudram'],
  thoothukudi: ['tuticorin', 'kovilpatti'],
  nagercoil: ['kanyakumari', 'cape comorin'],
  erode: ['bhavani', 'gobichettipalayam', 'perundurai'],
  namakkal: ['rasipuram', 'tiruchengode'],
  nagapattinam: ['mayiladuthurai', 'karaikal', 'vedaranyam'],
  karur: ['kulithalai', 'aravakurichi'],
  dindigul: ['palani', 'oddanchatram', 'natham'],
  kanchipuram: ['kanchi', 'chengalpattu'],
  cuddalore: ['chidambaram', 'neyveli'],
  tiruvannamalai: ['arani', 'polur'],
  hosur: ['krishnagiri', 'denkanikottai'],
  ramanathapuram: ['rameswaram', 'paramakudi'],
};

// Exact distances for Tamil Nadu routes (in kilometers)
const routeDistances: { [key: string]: number } = {
  // Chennai routes
  'chennai-trichy': 330,
  'trichy-chennai': 330,
  'chennai-madurai': 460,
  'madurai-chennai': 460,
  'chennai-coimbatore': 500,
  'coimbatore-chennai': 500,
  'chennai-salem': 340,
  'salem-chennai': 340,
  'chennai-vellore': 140,
  'vellore-chennai': 140,
  'chennai-kanchipuram': 75,
  'kanchipuram-chennai': 75,
  'chennai-tirunelveli': 630,
  'tirunelveli-chennai': 630,
  'chennai-nagercoil': 710,
  'nagercoil-chennai': 710,
  'chennai-thanjavur': 350,
  'thanjavur-chennai': 350,
  'chennai-cuddalore': 185,
  'cuddalore-chennai': 185,
  'chennai-hosur': 340,
  'hosur-chennai': 340,

  // Trichy routes
  'trichy-madurai': 135,
  'madurai-trichy': 135,
  'trichy-thanjavur': 57,
  'thanjavur-trichy': 57,
  'trichy-salem': 165,
  'salem-trichy': 165,
  'trichy-coimbatore': 210,
  'coimbatore-trichy': 210,
  'trichy-karur': 75,
  'karur-trichy': 75,
  'trichy-dindigul': 105,
  'dindigul-trichy': 105,
  'trichy-nagapattinam': 150,
  'nagapattinam-trichy': 150,
  'trichy-namakkal': 95,
  'namakkal-trichy': 95,

  // Namakkal to Nagapattinam (User's specific request)
  'namakkal-nagapattinam': 185,
  'nagapattinam-namakkal': 185,

  // Madurai routes
  'madurai-tirunelveli': 160,
  'tirunelveli-madurai': 160,
  'madurai-dindigul': 65,
  'dindigul-madurai': 65,
  'madurai-ramanathapuram': 120,
  'ramanathapuram-madurai': 120,
  'madurai-coimbatore': 215,
  'coimbatore-madurai': 215,

  // Coimbatore routes
  'coimbatore-salem': 165,
  'salem-coimbatore': 165,
  'coimbatore-erode': 90,
  'erode-coimbatore': 90,
  'coimbatore-tiruppur': 50,
  'tiruppur-coimbatore': 50,
  'coimbatore-pollachi': 40,
  'pollachi-coimbatore': 40,

  // Salem routes
  'salem-erode': 85,
  'erode-salem': 85,
  'salem-namakkal': 55,
  'namakkal-salem': 55,
  'salem-hosur': 120,
  'hosur-salem': 120,

  // Thanjavur routes
  'thanjavur-nagapattinam': 95,
  'nagapattinam-thanjavur': 95,
  'thanjavur-kumbakonam': 40,
  'kumbakonam-thanjavur': 40,

  // Tirunelveli routes
  'tirunelveli-nagercoil': 80,
  'nagercoil-tirunelveli': 80,
  'tirunelveli-thoothukudi': 40,
  'thoothukudi-tirunelveli': 40,

  // Other important routes
  'vellore-tiruvannamalai': 95,
  'tiruvannamalai-vellore': 95,
  'erode-namakkal': 50,
  'namakkal-erode': 50,
  'karur-dindigul': 70,
  'dindigul-karur': 70,
  'cuddalore-chidambaram': 25,
  'chidambaram-cuddalore': 25,

  // Local routes (within city)
  'trichy-thiruverumbur': 13,
  'thiruverumbur-trichy': 13,
  'trichy-srirangam': 8,
  'srirangam-trichy': 8,
  'madurai-thirumangalam': 20,
  'thirumangalam-madurai': 20,
};

// Toll charges for specific routes (both directions included)
const routeTolls: { [key: string]: number } = {
  // Chennai routes (major highways)
  'chennai-trichy': 280,
  'trichy-chennai': 280,
  'chennai-madurai': 380,
  'madurai-chennai': 380,
  'chennai-coimbatore': 420,
  'coimbatore-chennai': 420,
  'chennai-salem': 300,
  'salem-chennai': 300,
  'chennai-vellore': 120,
  'vellore-chennai': 120,
  'chennai-tirunelveli': 500,
  'tirunelveli-chennai': 500,
  'chennai-nagercoil': 580,
  'nagercoil-chennai': 580,
  'chennai-thanjavur': 290,
  'thanjavur-chennai': 290,
  'chennai-hosur': 280,
  'hosur-chennai': 280,

  // Trichy routes
  'trichy-madurai': 180,
  'madurai-trichy': 180,
  'trichy-salem': 140,
  'salem-trichy': 140,
  'trichy-coimbatore': 200,
  'coimbatore-trichy': 200,
  'trichy-nagapattinam': 100,
  'nagapattinam-trichy': 100,
  'trichy-namakkal': 80,
  'namakkal-trichy': 80,

  // Namakkal to Nagapattinam (User's specific request)
  'namakkal-nagapattinam': 150,
  'nagapattinam-namakkal': 150,

  // Madurai routes
  'madurai-tirunelveli': 140,
  'tirunelveli-madurai': 140,
  'madurai-coimbatore': 220,
  'coimbatore-madurai': 220,

  // Coimbatore routes
  'coimbatore-salem': 140,
  'salem-coimbatore': 140,
  'coimbatore-erode': 60,
  'erode-coimbatore': 60,

  // Salem routes
  'salem-erode': 60,
  'erode-salem': 60,
  'salem-namakkal': 40,
  'namakkal-salem': 40,
  'salem-hosur': 100,
  'hosur-salem': 100,

  // Thanjavur routes
  'thanjavur-nagapattinam': 60,
  'nagapattinam-thanjavur': 60,

  // Tirunelveli routes
  'tirunelveli-nagercoil': 50,
  'nagercoil-tirunelveli': 50,

  // Other routes
  'vellore-tiruvannamalai': 70,
  'tiruvannamalai-vellore': 70,
  'erode-namakkal': 30,
  'namakkal-erode': 30,
};

function normalizeLocation(address: string): string {
  const lowerAddr = address.toLowerCase().trim();

  // Direct city match from our map
  for (const [city, aliases] of Object.entries(cityMap)) {
    if (lowerAddr.includes(city)) return city;
    for (const alias of aliases) {
      if (lowerAddr.includes(alias)) return city; // Return main city for consistency
    }
  }

  // Extract first part before comma
  const firstPart = lowerAddr.split(',')[0].trim();

  // Try again with first part
  for (const [city, aliases] of Object.entries(cityMap)) {
    if (firstPart === city) return city;
    for (const alias of aliases) {
      if (firstPart === alias) return city;
    }
  }

  return firstPart;
}

export function calculateDistance(pickup: string, dropoff: string): number {
  const p = normalizeLocation(pickup);
  const d = normalizeLocation(dropoff);

  // Same location
  if (p === d) return Math.floor(Math.random() * 10) + 5;

  const key1 = `${p}-${d}`;
  const key2 = `${d}-${p}`;

  // Check specific routes
  if (routeDistances[key1]) return routeDistances[key1];
  if (routeDistances[key2]) return routeDistances[key2];

  // Fallback for unknown routes
  return Math.floor(Math.random() * 150) + 50;
}

function calculateTollCharges(pickup: string, dropoff: string): number {
  const p = normalizeLocation(pickup);
  const d = normalizeLocation(dropoff);

  // Same location - no toll
  if (p === d) return 0;

  const key1 = `${p}-${d}`;
  const key2 = `${d}-${p}`;

  // Check if toll exists for this route
  if (routeTolls[key1]) return routeTolls[key1];
  if (routeTolls[key2]) return routeTolls[key2];

  // For routes without specific toll data, estimate based on distance
  const distance = calculateDistance(pickup, dropoff);
  if (distance > 100) {
    // Long distance routes likely have tolls
    return Math.floor(distance * 0.8); // Approx ₹0.8 per km for toll
  } else if (distance > 50) {
    return Math.floor(distance * 0.5); // Approx ₹0.5 per km for medium routes
  }

  return 0; // No toll for short routes
}

export interface TripCostBreakdown {
  distance: number;
  baseRate: number;
  baseFare: number;
  tollCharges: number;
  handlingFee: number;
  total: number;
}

export function calculateTripCost(
  pickup: string,
  dropoff: string,
  perKmRate: number,
  isFragile: boolean = false
): TripCostBreakdown {
  const distance = calculateDistance(pickup, dropoff);
  const baseFare = distance * perKmRate;

  // Calculate toll charges (both up and down included in the toll data)
  const tollCharges = calculateTollCharges(pickup, dropoff);

  const handlingFee = isFragile ? 150 : 0;

  const total = baseFare + tollCharges + handlingFee;

  return {
    distance,
    baseRate: perKmRate,
    baseFare,
    tollCharges,
    handlingFee,
    total,
  };
}

const getStoredRates = (): { [driverId: string]: number } => {
  const stored = localStorage.getItem('driverRates');
  return stored ? JSON.parse(stored) : {};
};

export function getDriverRate(driverId: string): number {
  const rates = getStoredRates();
  return rates[driverId] || 20; // Default ₹20/km
}

export function setDriverRate(driverId: string, rate: number): void {
  const rates = getStoredRates();
  rates[driverId] = rate;
  localStorage.setItem('driverRates', JSON.stringify(rates));
}
