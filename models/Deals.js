import mongoose from 'mongoose';

const dealsSchema = new mongoose.Schema({
    title: String,
    description: String,
    discountPercentage: Number,
    startDate: Date,
    endDate: Date,
    listingIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true
        }
    ],
    createdAt: Date,
});

const Deals = mongoose.model('Deals', dealsSchema);

export default Deals;