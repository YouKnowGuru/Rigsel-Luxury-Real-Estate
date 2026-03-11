import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Upload image to Cloudinary
export async function uploadImage(
  file: string,
  folder: string = "phojaa-realestate"
): Promise<{ url: string; publicId: string }> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "image",
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

// Delete image from Cloudinary
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
}

// Get optimized image URL
export function getOptimizedImageUrl(
  url: string,
  width: number,
  height?: number
): string {
  if (!url.includes("cloudinary.com")) return url;

  const transformations = [`w_${width}`, "q_auto:good", "f_auto", "c_fill"];
  if (height) transformations.push(`h_${height}`);

  return url.replace(
    "/upload/",
    `/upload/${transformations.join(",")}/`
  );
}
