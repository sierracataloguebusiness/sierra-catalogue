import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dqu5sc4lm",
  api_key: process.env.CLOUDINARY_API_KEY || "326181741475455",
  api_secret: process.env.CLOUDINARY_API_SECRET, // store this safely in .env
});

export default cloudinary;
