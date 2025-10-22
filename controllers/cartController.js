import Listing from "../models/Listing.js";
import AppError from "../utils/AppError.js";
import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
    const { listingId, quantity = 1 } = req.body;
    const userId = req.user.id;

    const listing = await Listing.findById(listingId);
    if (!listing) {
        throw new AppError('Item not found', 404);
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
        item => item.listingId.toString() === listingId
    );

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ listingId, quantity });
    }

    cart.updatedAt = new Date();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
        .populate("items.listingId", "title price images");

    res.status(200).json({
        message: 'Item added to cart',
        cart: populatedCart
    });
};

export const removeFromCart = async (req, res) => {
    const { listingId } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    cart.items = cart.items.filter(
        item => item.listingId.toString() !== listingId
    );

    cart.updatedAt = new Date();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
        .populate("items.listingId", "title price images");

    res.status(200).json({
        message: 'Item removed from cart',
        cart: populatedCart
    });
};

export const updateQuantity = async (req, res) => {
    const { listingId, quantity } = req.body;
    const userId = req.user.id;

    if (quantity <= 0) {
        throw new AppError('Quantity must be greater than 0', 400);
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    const item = cart.items.find(
        item => item.listingId.toString() === listingId
    );
    if (!item) {
        throw new AppError('Item not found in cart', 404);
    }

    item.quantity = quantity;
    cart.updatedAt = new Date();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
        .populate("items.listingId", "title price images");

    res.status(200).json({
        message: 'Item updated in cart',
        cart: populatedCart
    });
};

export const getCart = async (req, res) => {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId })
        .populate("items.listingId", "title price images");
    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    res.status(200).json({ cart });
};

export const clearCart = async (req, res) => {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
        .populate("items.listingId", "title price images");

    res.status(200).json({
        message: 'Items cleared from cart',
        cart: populatedCart
    });
};