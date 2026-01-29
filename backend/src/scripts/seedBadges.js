const mongoose = require('mongoose');
const Badge = require('../models/badge');
require('dotenv').config();

const badges = [
  {
    name: 'First Post',
    description: 'Created your first post',
    ruleKey: 'first_post',
    rarity: 'common',
    imageUrl: '🎉'
  },
  {
    name: 'Content Creator',
    description: 'Created 10 posts',
    ruleKey: 'content_creator',
    rarity: 'common',
    imageUrl: '✍️'
  },
  {
    name: 'Prolific Poster',
    description: 'Created 50 posts',
    ruleKey: 'prolific_poster',
    rarity: 'rare',
    imageUrl: '📝'
  },
  {
    name: 'Viral Hit',
    description: 'Got 100+ upvotes on a post',
    ruleKey: 'viral_hit',
    rarity: 'rare',
    imageUrl: '🔥'
  },
  {
    name: 'Mega Viral',
    description: 'Got 1000+ upvotes on a post',
    ruleKey: 'mega_viral',
    rarity: 'legendary',
    imageUrl: '💥'
  },
  {
    name: 'First Comment',
    description: 'Made your first comment',
    ruleKey: 'first_comment',
    rarity: 'common',
    imageUrl: '💬'
  },
  {
    name: 'Discussion Master',
    description: 'Made 50+ comments',
    ruleKey: 'discussion_master',
    rarity: 'rare',
    imageUrl: '🗣️'
  },
  {
    name: 'Popular User',
    description: 'Got 10+ followers',
    ruleKey: 'popular_user',
    rarity: 'common',
    imageUrl: '⭐'
  },
  {
    name: 'Influencer',
    description: 'Got 100+ followers',
    ruleKey: 'influencer',
    rarity: 'epic',
    imageUrl: '👑'
  },
  {
    name: 'Celebrity',
    description: 'Got 1000+ followers',
    ruleKey: 'celebrity',
    rarity: 'legendary',
    imageUrl: '🏆'
  }
];

const seedBadges = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding badges...');

    // Clear existing badges
    await Badge.deleteMany({});
    console.log('Cleared existing badges');

    // Insert new badges
    const createdBadges = await Badge.insertMany(badges);
    console.log(`✅ Successfully seeded ${createdBadges.length} badges!`);

    // Display badge summary
    console.log('\n📋 Badge Summary:');
    createdBadges.forEach(badge => {
      console.log(`  ${badge.imageUrl} ${badge.name} (${badge.rarity}) - ${badge.description}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding badges:', error);
    process.exit(1);
  }
};

seedBadges();
