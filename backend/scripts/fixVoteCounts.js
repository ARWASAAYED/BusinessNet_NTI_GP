const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nti_gp");
        console.log("MongoDB Connected");

        const postsCollection = mongoose.connection.db.collection('posts');

        // 1. Force Clean Corrupt Data
        // We set upvotes/downvotes to empty arrays to fix the CastErrors
        console.log("Cleaning corrupt upvotes/downvotes data...");
        await postsCollection.updateMany(
            {}, 
            { 
                $set: { 
                    upvotes: [], 
                    downvotes: [],
                    upvotesCount: 0,
                    impressions: 0
                } 
            }
        );
        console.log("Data cleaned.");

        // 2. Seed a 'Top Post' for testing
        // Find one post and give it 10 fake votes and 100 views
        const onePost = await postsCollection.findOne({});
        if (onePost) {
            console.log(`Boosting post ${onePost._id} for testing...`);
            // We can't add real ObjectIds without real users, but for count sorting, 
            // we mainly rely on upvotesCount. 
            // However, our code updates upvotesCount based on array length.
            // So we need valid ObjectIds in the array if we use the API.
            // But for now, we just set the count high to demonstrate the SORTING.
            // The API will overwrite this on next vote, but it proves the concept.
            
            await postsCollection.updateOne(
                { _id: onePost._id },
                { 
                    $set: { 
                        upvotesCount: 50, 
                        impressions: 1000 
                    } 
                }
            );
        }

        console.log("Migration and Seeding Complete!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
