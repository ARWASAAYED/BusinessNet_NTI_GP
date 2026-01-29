const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nti_gp");
        const postsCollection = mongoose.connection.db.collection('posts');

        console.log("Seeding random vote counts...");
        const posts = await postsCollection.find({}).toArray();
        
        for (const post of posts) {
            // Random votes between 0 and 100
            const randomVotes = Math.floor(Math.random() * 100);
            const randomViews = Math.floor(Math.random() * 5000);
            
            await postsCollection.updateOne(
                { _id: post._id },
                { 
                    $set: { 
                        upvotesCount: randomVotes, 
                        impressions: randomViews 
                    } 
                }
            );
        }
        console.log("Seeding Complete. Refresh the page!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
