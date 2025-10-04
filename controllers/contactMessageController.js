import ContactMessage from "../models/ContactMessage.js";
import AppError from "../utils/AppError.js";

export const createMessage = async (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    let { tel } = req.body;

    if (!email || !tel || !message) {
        throw new AppError("Email, phone number and message are required", 400);
    }

    if (tel) {
        tel = tel.trim();
        if (/^0\d{8}$/.test(tel)) {
            tel = '+232' + tel.slice(1);
        } else if (!/^\+232\d{8}$/.test(tel)) {
            throw new AppError('Phone number is invalid (099XXXXXX or +2329XXXXXXX)', 400);
        }
    }

    const newMessage = await ContactMessage.create({
        firstName,
        lastName,
        email,
        tel,
        message,
    });

    res.status(201).json({
        message: "Message sent successfully",
        data: newMessage,
    });
};

export const getMessages = async (req, res) => {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ messages });
};