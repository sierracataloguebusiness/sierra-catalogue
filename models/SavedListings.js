import mongoose from 'mongoose';

const savedListingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true
        }
    ],
    createdAt: Date,
});

const SavedListings = mongoose.model('SavedListings', savedListingsSchema);

export default SavedListings;