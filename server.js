import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactMessageRoutes from "./routes/contactMessageRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import vendorApplicationRoutes from "./routes/vendorApplicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import savedListingsRoutes from "./routes/savedListingsRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------
// ✅ SECURE + FLEXIBLE CORS CONFIG
// ------------------------------
const allowedOrigins = [
    'http://localhost:5173',
    'https://sierra-catalogue.onrender.com',
    'https://www.sierracatalogue.com',
    'https://sierracatalogue.com',
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(`🚫 Blocked by CORS: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// ------------------------------
// Middleware
// ------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------
// API ROUTES
// ------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/messages', contactMessageRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/vendorApplication', vendorApplicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRoutes);
app.use("/api/saved", savedListingsRoutes);

// ------------------------------
// Static files (images, etc.)
// ------------------------------
app.use("/listings", express.static(path.join(__dirname, "listings")));

// ------------------------------
// FRONTEND BUILD SERVING
// ------------------------------
const clientDistPath = path.join(__dirname, 'client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientDistPath, 'index.html'));
    } else {
        next();
    }
});

// ------------------------------
// CONNECT DB + START SERVER
// ------------------------------
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
});
