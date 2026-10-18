import { API_BASE_URL } from './databaseConfig';

export interface UploadResponse {
  success: boolean;
  url?: string;
  public_id?: string;
  format?: string;
  error?: string;
}

/**
 * Uploads an image or media asset to Cloudinary via the Django backend upload endpoint.
 *
 * @param file The image or video File from an <input type="file">
 * @param folder Cloudinary destination folder (default: 'sain_logistics')
 * @returns UploadResponse containing the secure Cloudinary CDN URL or error message
 */
export async function uploadMediaToCloudinary(
  file: File,
  folder: string = 'sain_logistics'
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/upload/`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.success && data.url) {
      return {
        success: true,
        url: data.url,
        public_id: data.public_id,
        format: data.format,
      };
    }

    return {
      success: false,
      error: data.error || `Upload failed with HTTP status ${res.status}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Unable to connect to the backend upload service.',
    };
  }
}
