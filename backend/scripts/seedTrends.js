
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Keyword = require('../src/models/keyword');
const Trend = require('../src/models/Trend');
const Business = require('../src/models/business');
const User = require('../src/models/User'); // Assuming User model exists
const PromotedTrend = require('../src/models/promotedTrend');

const path = require('path');
// Load env vars from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to DB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nti_gp');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Failed to connect to DB', err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        console.log('Clearing existing trend/keyword data...');
        // Optional: Clear detailed collections
        // await Keyword.deleteMany({});
        // await Trend.deleteMany({});
        // await PromotedTrend.deleteMany({});
        
        // 1. Create a Dummy User and Business (needed for promoted trends)
        console.log('Ensuring dummy business exists...');
        let user = await User.findOne({ email: 'seed_business@test.com' });
        if (!user) {
            user = await User.create({
                username: 'GlobalTech_Seed',
                email: 'seed_business@test.com',
                password: 'hashedpassword123', // Dummy hash
                fullName: 'Global Tech Corp',
                accountType: 'business'
            });
        }

        let business = await Business.findOne({ userId: user._id });
        if (!business) {
            business = await Business.create({
                userId: user._id,
                name: 'Global Tech Corp',
                type: 'company',
                industry: 'Technology',
                description: 'Leading the future of AI'
            });
        }

        // 2. Define Keywords with Categories
        const keywordsData = [
            { word: 'GenerativeAI', category: 'Technology', frequency: 8500, growthRate: 12.5 },
            { word: 'RemoteWork', category: 'Business', frequency: 6200, growthRate: 5.2 },
            { word: 'CryptoMarkets', category: 'Finance', frequency: 7800, growthRate: -2.1 },
            { word: 'SustainableDesign', category: 'Design', frequency: 4100, growthRate: 8.9 },
            { word: 'StartupFunding', category: 'Business', frequency: 5300, growthRate: 15.0 },
            { word: 'QuantumComputing', category: 'Technology', frequency: 3200, growthRate: 25.4 },
            { word: 'GreenEnergy', category: 'Technology', frequency: 4900, growthRate: 6.7 },
            { word: 'UXTrends2026', category: 'Design', frequency: 2800, growthRate: 30.1 }
        ];

        console.log('Creating Keywords...');
        const keywordDocs = [];
        for (const k of keywordsData) {
            // Upsert keywords
            let keyword = await Keyword.findOne({ word: k.word });
            if (!keyword) {
                keyword = await Keyword.create(k);
            } else {
                // Update stats
                keyword.frequency = k.frequency;
                keyword.growthRate = k.growthRate;
                keyword.category = k.category;
                await keyword.save();
            }
            keywordDocs.push(keyword);
        }

        // 3. Create Trends linking to these keywords
        console.log('Creating Trends...');
        for (const kDoc of keywordDocs) {
            let trend = await Trend.findOne({ keywordId: kDoc._id });
            if (!trend) {
                await Trend.create({
                    keywordId: kDoc._id,
                    score: kDoc.frequency * 1.5, // Dummy algo
                    velocity: kDoc.growthRate,
                    status: kDoc.growthRate > 20 ? 'hot' : 'rising',
                });
            }
        }

        // 4. Create a Promoted Trend (e.g., QuantumComputing)
        const promoKeyword = keywordDocs.find(k => k.word === 'QuantumComputing');
        if (promoKeyword) {
            const trendToPromote = await Trend.findOne({ keywordId: promoKeyword._id });
            if (trendToPromote) {
                console.log('Creating Promoted Trend for:', promoKeyword.word);
                
                // Check if already promoted
                const existingPromo = await PromotedTrend.findOne({ trendId: trendToPromote._id, active: true });
                
                if (!existingPromo) {
                    const promo = await PromotedTrend.create({
                        trendId: trendToPromote._id,
                        businessId: business._id,
                        startAt: new Date(),
                        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
                        active: true,
                        adPackage: 'boost'
                    });

                    // Update trend
                    trendToPromote.promotedTrendId = promo._id;
                    trendToPromote.sourceType = 'promoted';
                    await trendToPromote.save();
                }
            }
        }

        console.log('Seed Complete! Created/Updated 8 keywords and trends.');
        process.exit(0);

    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedData();
