require('dotenv').config();
const dns = require('node:dns');
if (process.platform === 'win32') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}
const connectDB = require('../config/db');
const Keyword = require('../models/keyword');

const categoryMap = {
  ai: 'Technology',
  machinelearning: 'Technology',
  webdev: 'Technology',
  react: 'Technology',
  nextjs: 'Technology',
  cybersecurity: 'Technology',
  cloudnative: 'Technology',
  devops: 'Technology',
  python: 'Technology',
  fintech: 'Finance',
  marketing: 'Business',
  startup: 'Business',
  entrepreneurship: 'Business',
  sustainability: 'Business',
  uidesign: 'Design',
  design: 'Design',
  crypto: 'Finance',
  banking: 'Finance',
  venture: 'Finance',
  investing: 'Finance',
  b2b: 'Business'
};

async function fix() {
  await connectDB();
  for (const [word, category] of Object.entries(categoryMap)) {
    const res = await Keyword.updateOne({ word }, { category });
    if (res.matchedCount > 0) {
      console.log('Updated', word, '->', category);
    }
  }
  const keywords = await Keyword.find().select('word category');
  console.log('All keywords now:', keywords.map(k => `${k.word}:${k.category}`));
  process.exit(0);
}

fix().catch(err => {
  console.error(err);
  process.exit(1);
});
