import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactMessageRoutes from "./routes/contactMessageRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';


// Resolve dirname (for ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://sierra-catalogue.onrender.com'],
    credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/messages', contactMessageRoutes);
app.use('/api/blogs', blogRoutes);


// Serve frontend
app.use(express.static(path.join(__dirname, 'client/dist')));
console.log(path.join(__dirname, 'client/dist/index.html'))

// Catch-all route for SPA
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Connect DB and start server
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});