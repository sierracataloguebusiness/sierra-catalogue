import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import {hashPassword} from "../utils/hashPassword.js";
import bcrypt from "bcryptjs";
import AppError from '../utils/AppError.js';

export const signup = async (formData) => {
    const {
        firstName,
        lastName,
        otherNames,
        email,
        address,
        password,
        confirmPassword,
    } = formData;

    let { tel } = formData;

    if (/^0\d{8}$/.test(tel)) {
        tel = '+232' + tel.slice(1);
    }

    const emailExists = await User.findOne({email});
    if (emailExists) {
        throw new AppError('This email is already registered. Please log in.', 400);
    }

    const telExists = await User.findOne({tel});
    if (telExists) {
        throw new AppError('This phone number is already registered. Please log in.', 400);
    }

    if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters long.', 400);
    }

    if (password !== confirmPassword) {
        throw new AppError('Passwords do not match.', 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
        firstName,
        lastName,
        otherNames,
        email,
        tel,
        address,
        password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    return {
        message: 'Signup successful',
        user: {
            id: newUser._id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
        },
        token,
    };
};

export const login = async (formData) => {
    const { email, password } = formData;

    let { tel } = formData;

    if (/^0\d{8}$/.test(tel)) {
        tel = '+232' + tel.slice(1);
    }

    const existingUser = await User.findOne({ $or: [{email}, {tel}] });
    if (!existingUser) {
        throw new AppError('No account found with this email or phone number.', 404);
    }

    if(!existingUser.isActive){
        throw new AppError('This account has been blocked. ContactMessage support.', 403);
    }

    const checkPassword = await bcrypt.compare(password, existingUser.password);
    if (!checkPassword) {
        throw new AppError('Invalid password', 401);
    }

    const token = generateToken(existingUser._id);
    return {
        message: 'Login successful',
        user:{
            id: existingUser._id,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            otherNames: existingUser.otherNames,
            role: existingUser.role,
            tel: existingUser.tel,
            address: existingUser.address,
        },
        token,
    };

};
