import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";

export const getProfile = async  (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password -resetToken -resetTokenExp');

    if (!user) {
        throw new AppError('User not found', 404);
    }

    res.status(200).json({
        message: 'User profile found',
        user
    });
}

export const updateProfile = async  (req, res) => {
    const userId = req.user.id;

    let { firstName, lastName, otherNames, tel, address } = req.body;

    if (tel) {
        tel = tel.trim();
        if (/^0\d{8}$/.test(tel)) {
            tel = '+232' + tel.slice(1);
        } else if (!/^\+232\d{8}$/.test(tel)) {
            throw new AppError('Phone number is invalid (099XXXXXX or +2329XXXXXXX)', 400);
        }
    }

    if (tel) {
        const existingUser = await User.findOne({ tel, _id: { $ne: userId}});

        if (existingUser) {
            throw new AppError('Phone number already in use by another account', 400);
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { firstName, lastName, otherNames, tel, address },
        {new: true, runValidators: true, context: 'query'}
    ).select('-password -resetToken -resetTokenExp');

    res.status(200).json({
        message: 'User profile updated',
        user: updatedUser
    })
}

export const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { newPassword, confirmPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
        throw new AppError('Password cannot be the same as old password', 400);
    }

    if (newPassword !== confirmPassword) {
        throw new AppError('Passwords do not match', 400);
    }

    if (newPassword.length < 8) {
        throw new AppError('Password must be at least 8 characters', 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
        message: 'Password changed successfully',
    });
};
