import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Configure Cloudinary if keys exist
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a file (either a File object, a Base64 string, or a Buffer) to Cloudinary or falls back to local storage.
 * @returns The public URL of the uploaded image.
 */
export async function uploadImage(
  file: File | string | Buffer,
  folder = 'vlux_travel'
): Promise<string> {
  // If Cloudinary is configured, upload to Cloudinary
  if (isCloudinaryConfigured) {
    try {
      let uploadContent: string | Buffer;
      
      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        uploadContent = Buffer.from(arrayBuffer);
      } else {
        uploadContent = file;
      }

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url || '');
          }
        );

        if (Buffer.isBuffer(uploadContent)) {
          uploadStream.end(uploadContent);
        } else {
          // Assume base64 or url string
          cloudinary.uploader.upload(uploadContent, { folder })
            .then(res => resolve(res.secure_url))
            .catch(err => reject(err));
        }
      });
    } catch (error) {
      console.error('Cloudinary upload failed, falling back to local:', error);
    }
  }

  // Fallback: Local filesystem storage
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    let buffer: Buffer;
    let fileName = '';

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      // Clean up file name to prevent path traversal
      const ext = path.extname(file.name) || '.jpg';
      fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}${ext}`;
    } else if (Buffer.isBuffer(file)) {
      buffer = file;
      fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}.jpg`;
    } else {
      // Base64 string fallback
      if (file.startsWith('data:')) {
        const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          buffer = Buffer.from(matches[2], 'base64');
          const ext = matches[1].split('/')[1] || 'jpg';
          fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${ext}`;
        } else {
          throw new Error('Invalid base64 format');
        }
      } else {
        // Just return it if it's already an HTTP URL
        if (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('/')) {
          return file;
        }
        throw new Error('Unsupported image input format');
      }
    }

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Local file upload failed:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Deletes an image by its URL or public ID.
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  if (!imageUrl) return false;

  // Cloudinary delete
  if (isCloudinaryConfigured && imageUrl.includes('cloudinary.com')) {
    try {
      // Extract public_id from url
      // e.g., https://res.cloudinary.com/demo/image/upload/v1570534570/vlux_travel/my_image.jpg -> vlux_travel/my_image
      const parts = imageUrl.split('/');
      const filenameWithExtension = parts.pop() || '';
      const filename = filenameWithExtension.split('.')[0];
      
      // Look for the folder structure
      const uploadIndex = parts.indexOf('upload');
      let publicId = filename;
      if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
        // Contains version and folder: parts = [..., 'upload', 'v123456', 'folderName']
        const folderParts = parts.slice(uploadIndex + 2);
        publicId = [...folderParts, filename].join('/');
      }

      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete failed:', error);
      return false;
    }
  }

  // Local filesystem delete
  if (imageUrl.startsWith('/uploads/')) {
    try {
      const localPath = path.join(process.cwd(), 'public', imageUrl);
      if (existsSync(localPath)) {
        await fs.unlink(localPath);
        return true;
      }
    } catch (error) {
      console.error('Local file delete failed:', error);
    }
  }

  return false;
}

/**
 * Replaces an existing image with a new one.
 */
export async function replaceImage(
  oldUrl: string | null | undefined,
  newFile: File | string | Buffer,
  folder = 'vlux_travel'
): Promise<string> {
  if (oldUrl) {
    await deleteImage(oldUrl);
  }
  return uploadImage(newFile, folder);
}
