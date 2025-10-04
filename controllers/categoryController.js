import Category from "../models/Category.js";
import AppError from "../utils/AppError.js";

export const createCategory = async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new AppError('Category name is required', 404);
    }

    const existingCategory = await Category.findOne({name});
    if (existingCategory) {
        throw new AppError('Category already exists', 400);
    }

    const newCategory = await Category.create({
        name,
        description,
    })

    res.status(201).json({
        message: 'Category created',
        category: newCategory,
    });
}

export const updateCategory = async (req, res) => {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
        throw new AppError('Category not found', 404);
    }

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();

    res.status(200).json({
        message: 'Category updated',
        category
    });
}

export const deleteCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    await category.deleteOne();

    res.status(200).json({message: 'Category deleted'})
}

export const getCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        throw new AppError('Category not found', 404);
    }

    res.status(200).json({category});
}

export const getCategories = async (req, res) => {
    const categories = await Category.find().sort({createdAt: -1});

    res.status(200).json({categories});
}