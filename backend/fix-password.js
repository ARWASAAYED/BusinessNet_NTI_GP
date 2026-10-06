const mongoose = require('mongoose');

async function listUsers() {
  await mongoose.connect('mongodb://localhost:27017/business-network');
  const User = mongoose.connection.collection('users');
  
  const users = await User.find({}).toArray();
  console.log('Total users:', users.length);
  users.forEach(u => {
    console.log(`  - ${u.email} | ${u.username} | ${u.fullName} | role: ${u.role} | hasPassword: ${!!u.password}`);
  });
  
  await mongoose.disconnect();
  process.exit(0);
}

listUsers();
