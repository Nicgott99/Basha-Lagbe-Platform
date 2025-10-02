import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Import User model
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'hasibullah.khan.alvie@g.bracu.ac.bd' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      
      // Update password
      const hashedPassword = bcryptjs.hashSync('admin123456', 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      existingAdmin.isEmailVerified = true;
      existingAdmin.isActive = true;
      await existingAdmin.save();
      
      console.log('✅ Admin user updated successfully');
      console.log('📧 Email:', existingAdmin.email);
      console.log('🔑 Password: admin123456');
      console.log('👤 Role:', existingAdmin.role);
    } else {
      // Create new admin user
      const hashedPassword = bcryptjs.hashSync('admin123456', 10);
      
      const adminUser = new User({
        fullName: 'Hasibullah Khan Alvie',
        email: 'hasibullah.khan.alvie@g.bracu.ac.bd',
        password: hashedPassword,
        mobileNumber: '+8801234567890',
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
      });

      await adminUser.save();
      
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: hasibullah.khan.alvie@g.bracu.ac.bd');
      console.log('🔑 Password: admin123456');
      console.log('👤 Role: admin');
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdminUser();
