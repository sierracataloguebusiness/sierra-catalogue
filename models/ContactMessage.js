import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    tel: {
        type: String,
        required: true,
        match: [/^\+232\d{8}$/, 'Invalid phone number format (must be +2329XXXXXXX)']
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;