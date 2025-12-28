/**
 * Vercel Serverless Function for Gallery API
 * 
 * This endpoint fetches images and videos from a Google Drive folder using hybrid album logic.
 * Access at: /api/gallery?folderId=YOUR_FOLDER_ID
 * 
 * Query parameters:
 * - folderId (required): The Google Drive folder ID
 * - format (optional): 'albums' (default) or 'flat' - 'flat' returns plain array for backward compatibility
 * 
 * Returns (format=albums, default):
 * {
 *   albums: [
 *     {
 *       id: string,
 *       name: string,
 *       items: GalleryImage[]
 *     }
 *   ]
 * }
 * 
 * Returns (format=flat, backward compatible):
 * GalleryImage[]
 */

import { fetchGalleryAlbums, fetchGalleryImages } from '../src/api/gallery';

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers (adjust as needed for your domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const { folderId, format } = req.query;

    if (!folderId || typeof folderId !== 'string') {
      return res.status(400).json({ 
        error: 'folderId query parameter is required' 
      });
    }

    // Backward compatibility: if format=flat, return plain array
    if (format === 'flat') {
      const images = await fetchGalleryImages(folderId);
      return res.status(200).json(images);
    }

    // Default: return albums format using hybrid logic
    const albumsResponse = await fetchGalleryAlbums(folderId);
    return res.status(200).json(albumsResponse);
  } catch (error) {
    console.error('Gallery API error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Internal server error';

    return res.status(500).json({ 
      error: errorMessage 
    });
  }
}

