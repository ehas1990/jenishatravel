'use server';

import { uploadImage } from "@/lib/cloudinary";

/**
 * Server action to handle image uploads from client-side file pickers.
 */
export async function uploadImageAction(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    return { error: 'No file provided' };
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { error: 'File must be an image' };
  }

  // Validate size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { error: 'Image must be smaller than 5MB' };
  }

  try {
    const url = await uploadImage(file);
    return { success: true, url };
  } catch (error) {
    console.error('Upload action error:', error);
    return { error: 'Failed to upload image. Please try again.' };
  }
}
