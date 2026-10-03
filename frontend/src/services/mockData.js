// Seed / mock data. Mirrors the Firestore collection shapes described in the
// backend schema so swapping mock calls for real Firestore/API calls is a
// drop-in replacement (see services/api.js).

export const mockUser = {
  donor: { id: 'don_101', name: 'Green Leaf Bakery', role: 'donor', email: 'donor@greenleaf.com', location: { lat: 12.9716, lng: 77.5946 }, avatar: null, rating: 4.8 },
  ngo: { id: 'ngo_204', name: 'Anna Seva Foundation', role: 'ngo', email: 'contact@annaseva.org', location: { lat: 12.9352, lng: 77.6146 }, avatar: null, rating: 4.9 },
  volunteer: { id: 'vol_309', name: 'Rahul Menon', role: 'volunteer', email: 'rahul@volunteer.com', location: { lat: 12.9611, lng: 77.6387 }, avatar: null, rating: 4.7, deliveries: 42 },
}

export const donations = [
  {
    id: 'FD-2201', foodName: 'Vegetable Biryani', category: 'Cooked Meal', vegType: 'veg',
    quantityKg: 12, meals: 40, expiryTime: minutesFromNow(90), pickupTime: minutesFromNow(30),
    description: 'Freshly prepared, from a wedding event. Packed in sealed containers.',
    image: null, donor: mockUser.donor.name, donorId: 'don_101',
    location: { lat: 12.9716, lng: 77.5946, address: 'MG Road, Bengaluru' },
    contact: '+91 98450 12345', status: 'available', createdAt: minutesAgo(10),
  },
  {
    id: 'FD-2202', foodName: 'Bread & Pastries', category: 'Bakery', vegType: 'veg',
    quantityKg: 8, meals: 25, expiryTime: minutesFromNow(240), pickupTime: minutesFromNow(60),
    description: 'End-of-day surplus, unsold but fresh bakery items.',
    image: null, donor: 'Sunrise Bakers', donorId: 'don_102',
    location: { lat: 12.9789, lng: 77.6008, address: 'Indiranagar, Bengaluru' },
    contact: '+91 98450 22345', status: 'accepted', ngo: mockUser.ngo.name, createdAt: minutesAgo(45),
  },
  {
    id: 'FD-2203', foodName: 'Chicken Curry & Rice', category: 'Cooked Meal', vegType: 'non-veg',
    quantityKg: 20, meals: 60, expiryTime: minutesFromNow(45), pickupTime: minutesFromNow(15),
    description: 'Corporate event surplus, high priority due to short expiry window.',
    image: null, donor: 'Taj Convention Center', donorId: 'don_103',
    location: { lat: 12.9558, lng: 77.6497, address: 'Whitefield, Bengaluru' },
    contact: '+91 98450 32345', status: 'volunteer_assigned', ngo: mockUser.ngo.name,
    volunteer: mockUser.volunteer.name, createdAt: minutesAgo(20),
  },
  {
    id: 'FD-2204', foodName: 'Fresh Produce Crate', category: 'Groceries', vegType: 'veg',
    quantityKg: 30, meals: 80, expiryTime: minutesFromNow(1440), pickupTime: minutesFromNow(120),
    description: 'Slightly imperfect produce, still fresh — surplus from daily stock rotation.',
    image: null, donor: 'FreshMart Supermarket', donorId: 'don_104',
    location: { lat: 12.9165, lng: 77.6224, address: 'Koramangala, Bengaluru' },
    contact: '+91 98450 42345', status: 'delivered', ngo: mockUser.ngo.name,
    volunteer: mockUser.volunteer.name, createdAt: minutesAgo(180),
  },
  {
    id: 'FD-2205', foodName: 'Sweets & Snacks', category: 'Dessert', vegType: 'veg',
    quantityKg: 5, meals: 20, expiryTime: minutesFromNow(20), pickupTime: minutesFromNow(5),
    description: 'Leftover festival sweets — extremely time-sensitive.',
    image: null, donor: 'Krishna Sweets', donorId: 'don_105',
    location: { lat: 12.9698, lng: 77.7500, address: 'Marathahalli, Bengaluru' },
    contact: '+91 98450 52345', status: 'available', createdAt: minutesAgo(5),
  },
]

export const ngos = [
  { id: 'ngo_204', name: 'Anna Seva Foundation', location: { lat: 12.9352, lng: 77.6146 }, capacity: 200, rating: 4.9 },
  { id: 'ngo_205', name: 'Bengaluru Food Relief', location: { lat: 12.9611, lng: 77.5750 }, capacity: 150, rating: 4.6 },
  { id: 'ngo_206', name: 'Hope Kitchen Trust', location: { lat: 12.9950, lng: 77.6900 }, capacity: 100, rating: 4.8 },
]

export const volunteers = [
  { id: 'vol_309', name: 'Rahul Menon', location: { lat: 12.9611, lng: 77.6387 }, available: true, rating: 4.7, deliveries: 42 },
  { id: 'vol_310', name: 'Priya Nair', location: { lat: 12.9350, lng: 77.6100 }, available: true, rating: 4.9, deliveries: 78 },
  { id: 'vol_311', name: 'Arjun Iyer', location: { lat: 12.9800, lng: 77.6300 }, available: false, rating: 4.5, deliveries: 30 },
]

export const notifications = [
  { id: 1, title: 'Donation accepted', body: 'Anna Seva Foundation accepted your Vegetable Biryani donation.', time: minutesAgo(4), read: false, type: 'success' },
  { id: 2, title: 'Volunteer assigned', body: 'Rahul Menon is on the way to pick up Chicken Curry & Rice.', time: minutesAgo(18), read: false, type: 'info' },
  { id: 3, title: 'Expiring soon', body: 'Sweets & Snacks expires in 20 minutes — high priority.', time: minutesAgo(2), read: false, type: 'warning' },
  { id: 4, title: 'Delivery completed', body: 'Fresh Produce Crate delivered successfully to Anna Seva Foundation.', time: minutesAgo(190), read: true, type: 'success' },
]

export const analytics = {
  mealsSaved: 48210,
  peopleFed: 16070,
  foodSavedKg: 24105,
  co2ReducedKg: 60262,
  registeredDonors: 842,
  registeredNgos: 96,
  registeredVolunteers: 1310,
  monthly: {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    mealsSaved: [4200, 5100, 6300, 7200, 8100, 9400],
    foodWasteKg: [2100, 2550, 3150, 3600, 4050, 4700],
  },
  categoryBreakdown: { labels: ['Cooked Meal', 'Bakery', 'Groceries', 'Dessert', 'Beverages'], values: [42, 21, 18, 12, 7] },
  topDonors: [ { name: 'Taj Convention Center', meals: 3200 }, { name: 'FreshMart Supermarket', meals: 2650 }, { name: 'Green Leaf Bakery', meals: 1980 } ],
  topNgos: [ { name: 'Anna Seva Foundation', meals: 9100 }, { name: 'Hope Kitchen Trust', meals: 6400 }, { name: 'Bengaluru Food Relief', meals: 5200 } ],
  topVolunteers: [ { name: 'Priya Nair', deliveries: 78 }, { name: 'Rahul Menon', deliveries: 42 }, { name: 'Arjun Iyer', deliveries: 30 } ],
}

export const statusFlow = ['available', 'accepted', 'volunteer_assigned', 'picked_up', 'in_transit', 'delivered']

export const statusLabels = {
  available: 'Available', accepted: 'Accepted', volunteer_assigned: 'Volunteer Assigned',
  picked_up: 'Picked Up', in_transit: 'In Transit', delivered: 'Delivered',
  expired: 'Expired', cancelled: 'Cancelled',
}

function minutesFromNow(m) { return new Date(Date.now() + m * 60000).toISOString() }
function minutesAgo(m) { return new Date(Date.now() - m * 60000).toISOString() }
