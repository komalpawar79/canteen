import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Canteen from './models/Canteen.js';

dotenv.config();

const canteens = [
  {
    name: 'Main Canteen',
    location: {
      building: 'Central Campus',
      floor: 'Ground Floor'
    },
    description: 'The main campus canteen serving all types of meals',
    operatingHours: {
      open: '07:00',
      close: '22:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    cuisines: ['Indian', 'Chinese', 'Continental'],
    isActive: true,
    serviceTypes: {
      dineIn: true,
      takeaway: true,
      delivery: true
    }
  },
  {
    name: 'Food Court',
    location: {
      building: 'Near Hostels',
      floor: '1st Floor'
    },
    description: 'Quick service food court with multiple counters',
    operatingHours: {
      open: '08:00',
      close: '23:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    cuisines: ['Fast Food', 'Snacks', 'Beverages'],
    isActive: true,
    serviceTypes: {
      dineIn: true,
      takeaway: true,
      delivery: false
    }
  },
  {
    name: 'Quick Bites',
    location: {
      building: 'Library Building',
      floor: 'Ground Floor'
    },
    description: 'Quick snacks and beverages for students',
    operatingHours: {
      open: '09:00',
      close: '20:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    cuisines: ['Snacks', 'Beverages', 'Sandwiches'],
    isActive: true,
    serviceTypes: {
      dineIn: false,
      takeaway: true,
      delivery: false
    }
  },
  {
    name: 'Cafe Coffee',
    location: {
      building: 'Student Center',
      floor: '2nd Floor'
    },
    description: 'Premium coffee and light meals',
    operatingHours: {
      open: '08:00',
      close: '21:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    cuisines: ['Coffee', 'Bakery', 'Light Meals'],
    isActive: true,
    serviceTypes: {
      dineIn: true,
      takeaway: true,
      delivery: false
    }
  }
];

const seedCanteens = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickbite');
    console.log('✅ MongoDB connected');

    // Clear existing canteens
    await Canteen.deleteMany({});
    console.log('🗑️  Cleared existing canteens');

    // Insert new canteens
    const created = await Canteen.insertMany(canteens);
    console.log(`✅ Created ${created.length} canteens:`);
    
    created.forEach((canteen, i) => {
      console.log(`   ${i + 1}. ${canteen.name} (ID: ${canteen._id})`);
    });

    console.log('\n✅ Canteen seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedCanteens();
