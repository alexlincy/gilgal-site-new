import { useMemo, useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { BackToTop } from "@/components/ui/BackToTop";
import { Camera, ImageIcon } from "lucide-react";
import { GalleryCollection } from "@/components/gallery/GalleryCollection";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { galleryCollections } from "@/data/galleryData";
import { cn } from "@/lib/utils";

// Type matching the API response structure
interface APIGalleryImage {
  id: string;
  name: string;
  mimeType: string;
  thumbnailUrl: string;
  fullImageUrl: string;
}

// Type for album structure from API
interface Album {
  id: string;
  name: string;
  items: APIGalleryImage[];
}

interface AlbumsResponse {
  albums: Album[];
}

// Transform API GalleryImage to component GalleryImage format
function transformAPIImageToComponentImage(apiImage: APIGalleryImage): any {
  const isVideo = apiImage.mimeType?.startsWith("video/") || false;
  
  return {
    id: apiImage.id,
    mimeType: apiImage.mimeType,
    src: isVideo ? apiImage.fullImageUrl : apiImage.thumbnailUrl,
    poster: isVideo ? apiImage.thumbnailUrl : undefined,
    alt: apiImage.name,
    caption: apiImage.name,
    thumbnailUrl: apiImage.thumbnailUrl,
    fullImageUrl: apiImage.fullImageUrl,
  };
}

export default function Gallery() {
  const [searchParams] = useSearchParams();
  // Get folderId from URL parameter or environment variable (if needed in future)
  const folderId = searchParams.get("folderId") || import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID || undefined;

  // Albums state from API
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state - track displayed count per album
  const PAGE_SIZE = 12;
  const PAGINATION_THRESHOLD = 20;
  const [displayedCount, setDisplayedCount] = useState<Record<string, number>>({});

  // TEMPORARY: Disabled for static hosting - Gallery API calls are disabled
  // To re-enable: Uncomment the useEffect below and remove the static placeholder section
  // Fetch albums from API on page load
  // useEffect(() => {
  //   const fetchAlbums = async () => {
  //     // If no folderId, skip API call and use existing galleryCollections data
  //     if (!folderId) {
  //       return;
  //     }

  //     setIsLoading(true);
  //     setError(null);
      
  //     try {
  //       console.log('[Gallery] Fetching albums from API with folderId:', folderId);
  //       const response = await fetch(`/api/gallery?folderId=${encodeURIComponent(folderId)}`);
        
  //       if (!response.ok) {
  //         const errorText = await response.text();
  //         console.error('[Gallery] API error response:', response.status, errorText);
  //         throw new Error(`Failed to fetch gallery: ${response.status} ${response.statusText}`);
  //       }
        
  //       const data: AlbumsResponse = await response.json();
  //       console.log('[Gallery] API response received:', { albumCount: data.albums?.length || 0, albums: data.albums });
        
  //       if (data.albums && data.albums.length > 0) {
  //         console.log('[Gallery] Setting albums:', data.albums.map(a => ({ name: a.name, itemCount: a.items.length })));
  //         setAlbums(data.albums);
  //         // Set first album as default
  //         setActiveAlbumId(data.albums[0].id);
  //       } else {
  //         console.warn('[Gallery] No albums returned from API, falling back to placeholders');
  //         setAlbums([]);
  //         setActiveAlbumId(null);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching gallery albums:", err);
  //       setError(err instanceof Error ? err.message : "Failed to load gallery");
  //       setAlbums([]);
  //       setActiveAlbumId(null);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchAlbums();
  // }, [folderId]);

  // Reset pagination when album changes
  useEffect(() => {
    if (activeAlbumId) {
      // Initialize or reset pagination for this album
      setDisplayedCount((prev) => {
        // Only initialize if not already set
        if (!prev[activeAlbumId]) {
          return {
            ...prev,
            [activeAlbumId]: PAGE_SIZE,
          };
        }
        return prev;
      });
    }
  }, [activeAlbumId]);

  // Get active album items (all items)
  const activeAlbumItemsAll = useMemo(() => {
    if (!activeAlbumId || albums.length === 0) return [];
    const album = albums.find((a) => a.id === activeAlbumId);
    return album ? album.items.map(transformAPIImageToComponentImage) : [];
  }, [albums, activeAlbumId]);

  // Get paginated items for active album
  const activeAlbumItems = useMemo(() => {
    // Only paginate if album has more than threshold items
    const album = albums.find((a) => a.id === activeAlbumId);
    const shouldPaginate = album ? album.items.length > PAGINATION_THRESHOLD : false;
    
    if (shouldPaginate && activeAlbumId && displayedCount[activeAlbumId]) {
      return activeAlbumItemsAll.slice(0, displayedCount[activeAlbumId]);
    }
    // Show all items if pagination not needed or not initialized
    return activeAlbumItemsAll;
  }, [activeAlbumId, activeAlbumItemsAll, displayedCount, albums]);

  // Check if pagination should be enabled for current album
  const shouldShowPagination = useMemo(() => {
    if (!activeAlbumId || albums.length === 0) return false;
    const album = albums.find((a) => a.id === activeAlbumId);
    return album ? album.items.length > PAGINATION_THRESHOLD : false;
  }, [albums, activeAlbumId]);

  // Check if there are more items to load
  const hasMoreItems = useMemo(() => {
    if (!activeAlbumId || !displayedCount[activeAlbumId]) return false;
    return activeAlbumItemsAll.length > displayedCount[activeAlbumId];
  }, [activeAlbumId, activeAlbumItemsAll.length, displayedCount]);

  // Load more items
  const handleLoadMore = useCallback(() => {
    if (!activeAlbumId) return;
    setDisplayedCount((prev) => ({
      ...prev,
      [activeAlbumId]: (prev[activeAlbumId] || PAGE_SIZE) + PAGE_SIZE,
    }));
  }, [activeAlbumId]);

  // Fallback to existing galleryCollections if no API data
  const hasCollections = albums.length > 0 ? albums.length > 0 : galleryCollections.length > 0;

  // Use API albums if available, otherwise use existing galleryCollections
  const allImages = useMemo(() => {
    if (albums.length > 0 && activeAlbumId) {
      return activeAlbumItems;
    }
    
    // Fallback to existing data
    return galleryCollections.flatMap((collection) =>
      collection.images
        .filter((img) => !!img.src)
        .map((img) => ({
          ...img,
          category: collection.title,
        })),
    );
  }, [albums, activeAlbumId, activeAlbumItems]);

  const hasAnyImages = allImages.length > 0;

  // Filter chips - use albums if available, otherwise use categories
  const categories = useMemo(() => {
    if (albums.length > 0) {
      return albums.map((album) => album.name);
    }
    const set = new Set<string>();
    galleryCollections.forEach((c) => set.add(c.title));
    return ["All", ...Array.from(set)];
  }, [albums]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Update selectedCategory when activeAlbumId changes (for album-based view)
  useEffect(() => {
    if (albums.length > 0 && activeAlbumId) {
      const activeAlbum = albums.find((a) => a.id === activeAlbumId);
      if (activeAlbum) {
        setSelectedCategory(activeAlbum.name);
      }
    }
  }, [albums, activeAlbumId]);

  const filteredImages = useMemo(() => {
    if (albums.length > 0) {
      // Album-based view: return items from active album
      return activeAlbumItems;
    }
    // Category-based view (fallback to existing logic)
    if (selectedCategory === "All" || selectedCategory === null) return allImages;
    return allImages.filter((img: any) => img.category === selectedCategory);
  }, [albums, activeAlbumItems, selectedCategory, allImages]);

  const mergedCollection = useMemo(() => {
    // Use active album name if available, otherwise default title
    const activeAlbum = albums.find((a) => a.id === activeAlbumId);
    const title = activeAlbum ? activeAlbum.name : "Gallery";
    
    return {
      id: activeAlbumId || "merged-gallery",
      title,
      description: "Swipe sideways to browse photos and videos.",
      images: filteredImages,
    };
  }, [filteredImages, albums, activeAlbumId]);

  // ✅ Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const prevLightbox = useCallback(() => {
    if (!filteredImages.length) return;
    setLightboxIndex((i) => (i - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  const nextLightbox = useCallback(() => {
    if (!filteredImages.length) return;
    setLightboxIndex((i) => (i + 1) % filteredImages.length);
  }, [filteredImages.length]);

  // Update lightbox to use all items (not just paginated ones) for navigation
  const allFilteredImages = useMemo(() => {
    if (albums.length > 0 && activeAlbumId) {
      // Use all items from active album for lightbox navigation
      return activeAlbumItemsAll;
    }
    // Category-based view (fallback to existing logic)
    if (selectedCategory === "All" || selectedCategory === null) return allImages;
    return allImages.filter((img: any) => img.category === selectedCategory);
  }, [albums, activeAlbumItemsAll, activeAlbumId, selectedCategory, allImages]);

  return (
    <Layout>
      <BackToTop />
      <HeroBanner title="Gallery" subtitle="Glimpses of our church life and community gatherings" />

      <section className="section-light page-section">
        <div className="section-container">
          {/* TEMPORARY: Static placeholder for static hosting - Gallery API disabled */}
          {/* To re-enable dynamic gallery: Uncomment the useEffect above and restore the gallery content below */}
          <div className="py-16">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h2 className="text-h3 font-heading font-semibold text-foreground mb-3">Gallery</h2>
              <p className="text-muted-foreground">
                Our photo gallery is being updated. Please check back soon.
              </p>
            </div>
          </div>

          {/* TEMPORARY: Gallery content below is disabled for static hosting */}
          {/* 
          {isLoading && (
            <div className="py-16">
              <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-10 h-10 text-muted-foreground/40 animate-pulse" />
                </div>
                <h2 className="text-h3 font-heading font-semibold text-foreground mb-3">Loading Gallery</h2>
                <p className="text-muted-foreground">Fetching photos and videos...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-10 max-w-3xl">
              <div className="flex items-center gap-4 px-5 py-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Error Loading Gallery</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && hasCollections && !hasAnyImages && (
            <div className="mb-10 max-w-3xl">
              <div className="flex items-center gap-4 px-5 py-4 bg-muted/40 border border-border/40 rounded-xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Photo Gallery Coming Soon</p>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    We're preparing beautiful photos from our church events and gatherings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && !hasCollections && (
            <div className="py-16">
              <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h2 className="text-h3 font-heading font-semibold text-foreground mb-3">Gallery Coming Soon</h2>
                <p className="text-muted-foreground">
                  We're preparing a beautiful collection of photos from our church activities and events. Check back
                  soon for updates.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && hasCollections && hasAnyImages && (
            <div className="mt-6">
              {albums.length > 0 && (
                <div className="mb-6">
                  <div className="hidden md:flex border-b border-border">
                    {albums.map((album) => (
                      <button
                        key={album.id}
                        onClick={() => setActiveAlbumId(album.id)}
                        className={cn(
                          "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                          activeAlbumId === album.id
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                        )}
                      >
                        {album.name}
                      </button>
                    ))}
                  </div>
                  <div className="md:hidden overflow-x-auto -mx-4 px-4 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex gap-2 min-w-max">
                      {albums.map((album) => (
                        <button
                          key={album.id}
                          onClick={() => setActiveAlbumId(album.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm whitespace-nowrap",
                            activeAlbumId === album.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {album.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {albums.length === 0 && categories.length > 0 && (
                <div className="mb-6">
                  <div className="hidden md:flex border-b border-border">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCategory(c)}
                        className={cn(
                          "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                          selectedCategory === c
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="md:hidden overflow-x-auto -mx-4 px-4 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex gap-2 min-w-max">
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedCategory(c)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm whitespace-nowrap",
                            selectedCategory === c
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <GalleryCollection
                collection={mergedCollection as any}
                showViewAllLink={false}
              />

              {shouldShowPagination && hasMoreItems && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 text-sm font-medium bg-background border border-border hover:bg-muted rounded-lg transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}

              <GalleryLightbox
                open={lightboxOpen}
                items={allFilteredImages as any}
                index={lightboxIndex}
                onClose={closeLightbox}
                onPrev={prevLightbox}
                onNext={nextLightbox}
              />
            </div>
          )}
          */}
        </div>
      </section>
    </Layout>
  );
}
