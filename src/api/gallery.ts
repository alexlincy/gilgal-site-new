/**
 * Google Drive API Integration for Gallery
 * 
 * This module fetches images and videos from a Google Drive folder using the Drive API v3.
 * It requires the GOOGLE_DRIVE_API_KEY environment variable to be set.
 */

export interface GalleryImage {
  id: string;
  name: string;
  mimeType: string;
  thumbnailUrl: string;
  fullImageUrl: string;
}

export interface GalleryAlbum {
  id: string;
  name: string;
  items: GalleryImage[];
}

export interface GalleryAlbumsResponse {
  albums: GalleryAlbum[];
}

// Supported image MIME types
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// Supported video MIME types
const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo', // avi
  'video/x-ms-wmv', // wmv
];

/**
 * Fetches all image and video files from a Google Drive folder
 * @param folderId - The Google Drive folder ID to fetch media from
 * @returns Promise<GalleryImage[]> - Array of media objects with id, name, mimeType, thumbnailUrl, and fullImageUrl
 */
export async function fetchGalleryImages(folderId: string): Promise<GalleryImage[]> {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_DRIVE_API_KEY environment variable is not set');
  }

  if (!folderId) {
    throw new Error('Folder ID is required');
  }

  try {
    // Fetch files from the folder using Google Drive API v3 (both images and videos)
    const imageQuery = `'${folderId}'+in+parents+and+(mimeType+contains+'image/'+or+mimeType+contains+'video/')`;
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${imageQuery}&key=${apiKey}&fields=files(id,name,mimeType,thumbnailLink,webViewLink)&supportsAllDrives=true&includeItemsFromAllDrives=true`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Google Drive API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
      );
    }

    const data = await response.json();

    if (!data.files || !Array.isArray(data.files)) {
      throw new Error('Invalid response from Google Drive API');
    }

    // Filter and map files to GalleryImage format
    const images: GalleryImage[] = data.files
      .filter((file: any) => {
        // Filter by supported image and video types
        const mimeType = file.mimeType?.toLowerCase() || '';
        const isImage = SUPPORTED_IMAGE_TYPES.some(type => mimeType.includes(type));
        const isVideo = SUPPORTED_VIDEO_TYPES.some(type => mimeType.includes(type));
        return isImage || isVideo;
      })
      .map((file: any) => {
        // Generate full URL - using webViewLink or constructing from file ID
        const fullImageUrl = file.webViewLink || 
          `https://drive.google.com/file/d/${file.id}/view`;

        // Use thumbnailLink if available, otherwise construct thumbnail URL
        // For videos, use thumbnailLink; for images, use thumbnailLink
        const thumbnailUrl = file.thumbnailLink || 
          `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`;

        return {
          id: file.id,
          name: file.name || 'Untitled',
          mimeType: file.mimeType || '',
          thumbnailUrl,
          fullImageUrl,
        };
      });

    return images;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to fetch gallery images from Google Drive');
  }
}

/**
 * Lists all subfolders in a parent Google Drive folder
 * @param parentFolderId - The Google Drive folder ID to list subfolders from
 * @returns Promise<Array<{id: string, name: string}>> - Array of folder objects with id and name
 */
export async function listSubfolders(parentFolderId: string): Promise<Array<{id: string, name: string}>> {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_DRIVE_API_KEY environment variable is not set');
  }

  if (!parentFolderId) {
    throw new Error('Parent folder ID is required');
  }

  try {
    // Query for folders only (mimeType = 'application/vnd.google-apps.folder')
    const folderQuery = `'${parentFolderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'`;
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${folderQuery}&key=${apiKey}&fields=files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true&orderBy=name`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Google Drive API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
      );
    }

    const data = await response.json();

    if (!data.files || !Array.isArray(data.files)) {
      throw new Error('Invalid response from Google Drive API');
    }

    return data.files.map((folder: any) => ({
      id: folder.id,
      name: folder.name || 'Untitled',
    }));
  } catch (error) {
    console.error('Error listing subfolders:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to list subfolders from Google Drive');
  }
}

/**
 * Groups files by album name parsed from filenames
 * Parses album name using pattern: Gallery_<ALBUM NAME>_
 * @param files - Array of GalleryImage objects to group
 * @returns Array of GalleryAlbum objects
 */
export function groupFilesByAlbum(files: GalleryImage[]): GalleryAlbum[] {
  const albumMap = new Map<string, GalleryImage[]>();

  files.forEach((file) => {
    // Parse album name from filename using pattern: Gallery_<ALBUM NAME>_
    // Example: "Gallery_Christmas Service_photo1.jpg" → album: "Christmas Service"
    // The album name is everything between "Gallery_" and the next "_"
    const match = file.name.match(/^Gallery_(.+?)_/);
    
    if (match && match[1]) {
      const albumName = match[1].trim();
      if (albumName.length > 0) {
        if (!albumMap.has(albumName)) {
          albumMap.set(albumName, []);
        }
        albumMap.get(albumName)!.push(file);
      } else {
        // Empty album name, treat as uncategorized
        const defaultAlbumName = 'Uncategorized';
        if (!albumMap.has(defaultAlbumName)) {
          albumMap.set(defaultAlbumName, []);
        }
        albumMap.get(defaultAlbumName)!.push(file);
      }
    } else {
      // Files that don't match the pattern go into a default "Uncategorized" album
      const defaultAlbumName = 'Uncategorized';
      if (!albumMap.has(defaultAlbumName)) {
        albumMap.set(defaultAlbumName, []);
      }
      albumMap.get(defaultAlbumName)!.push(file);
    }
  });

  // Convert map to array of albums
  const albums: GalleryAlbum[] = Array.from(albumMap.entries()).map(([name, items], index) => ({
    id: `album-${index}-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    items,
  }));

  return albums;
}

/**
 * Fetches gallery media organized into albums using hybrid logic:
 * - If subfolders exist, treats each folder as an album
 * - Otherwise, groups files by filename-based album names (Gallery_<ALBUM NAME>_)
 * @param parentFolderId - The Google Drive folder ID to fetch media from
 * @returns Promise<GalleryAlbumsResponse> - Object containing albums array
 */
export async function fetchGalleryAlbums(parentFolderId: string): Promise<GalleryAlbumsResponse> {
  try {
    // First, check if subfolders exist
    const subfolders = await listSubfolders(parentFolderId);

    if (subfolders.length > 0) {
      // Subfolders exist → treat each folder as an album
      const albums: GalleryAlbum[] = await Promise.all(
        subfolders.map(async (folder) => {
          const items = await fetchGalleryImages(folder.id);
          return {
            id: folder.id,
            name: folder.name,
            items,
          };
        })
      );

      // Filter out empty albums
      return {
        albums: albums.filter((album) => album.items.length > 0),
      };
    } else {
      // No subfolders → group files by filename-based album names
      const allFiles = await fetchGalleryImages(parentFolderId);
      const albums = groupFilesByAlbum(allFiles);
      
      return {
        albums: albums.filter((album) => album.items.length > 0),
      };
    }
  } catch (error) {
    console.error('Error fetching gallery albums:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to fetch gallery albums from Google Drive');
  }
}

