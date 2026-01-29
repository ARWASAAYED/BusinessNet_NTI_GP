const mongoose = require('mongoose');
const Badge = require('../models/badge');
const Community = require('../models/community');
require('dotenv').config();

const badges = [
    {
        name: 'First Word',
        description: 'Created your first post on the platform.',
        ruleKey: 'first_post',
        rarity: 'common',
        imageUrl: '/badges/first_post.png'
    },
    {
        name: 'Thought Leader',
        description: 'Shared 10 high-quality professional posts.',
        ruleKey: 'content_creator',
        rarity: 'rare',
        imageUrl: '/badges/creator.png'
    },
    {
        name: 'Going Viral',
        description: 'Received over 100 upvotes on a single post.',
        ruleKey: 'viral_hit',
        rarity: 'epic',
        imageUrl: '/badges/viral.png'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Seed Badges
        await Badge.deleteMany({});
        await Badge.insertMany(badges);
        console.log('Badges seeded successfully!');

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
