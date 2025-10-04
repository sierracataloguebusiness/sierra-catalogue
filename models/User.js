import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    otherNames: String,
    role: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        default: 'customer'
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    tel: {
        type: String,
        unique: true,
        match: [/^\+232\d{8}$/, 'Invalid phone number format (must be +2329XXXXXXX)']
    },
    address: { type: String, required: true },
    password: { type: String, required: true },
    isActive: {
        type: Boolean,
        default: true
    },
    resetToken: String,
    resetTokenExp: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;