const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'Admin',
    email: 'admin@etender.com',
    password: hashed,
    role: 'admin'
  });
  console.log('Admin created!');
  process.exit();
};

createAdmin();