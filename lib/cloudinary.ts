import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export const generateSignedUrl = (publicId: string, expiresIn = 1800) => {
  return cloudinary.url(publicId, {
    sign_url: true,
    secure: true,
    expires_at: Math.round(Date.now() / 1000) + expiresIn,
  });
};

export const getSignedImageUrl = (imageUrl: string | null | undefined) => {
  if (!imageUrl) return "";
  const urlParts = imageUrl.split("/");
  const uploadIndex = urlParts.findIndex((part) => part === "upload");
  if (uploadIndex === -1) return imageUrl;
  const publicIdParts = urlParts.slice(uploadIndex + 2);
  const publicId = publicIdParts.join("/").replace(/\.[^/.]+$/, "");
  if (!publicId) return imageUrl;
  return generateSignedUrl(publicId);
};
