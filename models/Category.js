import mongoose from 'mongoose';

const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    description: String
}, {timestamps: true});

const Category = mongoose.model('Category', categoriesSchema);

export default Category;