import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            listingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Listing',
                required: true
            },
            quantity: Number,
        },
    ],
    updatedAt: Date
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;