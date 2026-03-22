import { useState, useEffect } from "react";

interface DriveImage {
    src: string;
    alt: string;
    category: string;
}
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || "";
const FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID || "1oBnwDww18siNzNnKIpE9M9krWHxi5Uo9";


export function useGoogleDriveGallery() {
    const [images, setImages] = useState<DriveImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchImages() {
            try {
                const query = encodeURIComponent(
                    `'${FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`
                );
                const fields = encodeURIComponent("files(id,name)");
                const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&key=${API_KEY}&pageSize=100&orderBy=createdTime desc`;

                const res = await fetch(url);
                const data = await res.json();

                console.log("📦 Drive response:", data);

                if (!res.ok) {
                    throw new Error(data?.error?.message || "Failed to fetch Drive folder");
                }

                const mapped: DriveImage[] = (data.files || []).map((file: any) => ({
                    src: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000&authuser=0`,
                    alt: file.name.replace(/\.[^/.]+$/, ""),
                    category: "Gallery",
                }));

                console.log("🖼️ Images mapped:", mapped.length);
                setImages(mapped);
            } catch (err: any) {
                console.error("❌ Gallery error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchImages();
    }, []);

    return { images, loading, error };
}