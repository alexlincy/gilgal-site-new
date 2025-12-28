import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Image as ImageIcon, Camera, ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Backward-compatible:
 * - Existing data uses `images: [{ src, alt, caption }]`
 * - You can now add videos too by adding:
 *   { type:"video", src:"...", poster:"...", alt:"...", caption:"..." }
 */
export interface GalleryImage {
  id?: string;
  type?: "image" | "video"; // Legacy field for backward compatibility
  mimeType?: string; // New field from API (e.g., "image/jpeg", "video/mp4")
  src: string; // For images: thumbnailUrl, for videos: fullImageUrl
  poster?: string; // For videos: thumbnailUrl
  alt: string;
  caption?: string;
  // API response fields (when coming from Google Drive API)
  thumbnailUrl?: string;
  fullImageUrl?: string;
}

export interface GalleryCollectionData {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
}

interface GalleryCollectionProps {
  collection: GalleryCollectionData;
  maxImages?: number;
  showViewAllLink?: boolean;
  /** If true, hides the collection title/description header (useful when embedding on Media page) */
  hideHeader?: boolean;
}

export function GalleryCollection({
  collection,
  maxImages,
  showViewAllLink = true,
  hideHeader = false,
}: GalleryCollectionProps) {
  const displayImages = useMemo(() => {
    const list = (collection.images || []).map((m, idx) => {
      // Determine type from mimeType if available, otherwise use type field
      let mediaType: "image" | "video" = m.type ?? "image";
      if (m.mimeType) {
        mediaType = m.mimeType.startsWith("video/") ? "video" : "image";
      }
      
      // If coming from API with thumbnailUrl/fullImageUrl, map to src/poster
      let src = m.src;
      let poster = m.poster;
      
      if (m.thumbnailUrl || m.fullImageUrl) {
        if (mediaType === "video") {
          // For videos: thumbnailUrl is used as poster for preview
          // fullImageUrl is used as video src in video elements (lightbox and fallback)
          poster = m.thumbnailUrl || m.poster;
          // Keep src as fullImageUrl for video elements (when no poster)
          src = m.fullImageUrl || m.src;
        } else {
          // For images: thumbnailUrl for preview, fullImageUrl for full view in lightbox
          src = m.thumbnailUrl || m.src;
        }
      }
      
      return {
        ...m,
        type: mediaType,
        src,
        poster,
        _idx: idx,
        // Preserve API fields for lightbox (fullImageUrl for videos, fullImageUrl for images in lightbox)
        thumbnailUrl: m.thumbnailUrl,
        fullImageUrl: m.fullImageUrl,
      };
    });
    return typeof maxImages === "number" ? list.slice(0, maxImages) : list;
  }, [collection.images, maxImages]);

  const count = displayImages.length;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    if (!displayImages[index]?.src) return;
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevLightbox = () => setLightboxIndex((i) => (i - 1 + count) % count);
  const nextLightbox = () => setLightboxIndex((i) => (i + 1) % count);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Keyboard controls for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
      if (e.key === "ArrowRight") nextLightbox();
    };

    document.addEventListener("keydown", onKeyDown);
    // prevent background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, count]);

  const scrollTo = (index: number) => api?.scrollTo(index);

  const currentCaption = displayImages[current]?.caption || displayImages[current]?.alt || "";

  return (
    <section className="py-8 md:py-10">
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-start justify-between gap-6 mb-5">
          <div>
            <h2 className="text-foreground text-2xl md:text-3xl font-semibold">{collection.title}</h2>
            <p className="text-muted-foreground mt-1">{collection.description}</p>
          </div>

          {/* NOTE: If you remove Gallery from the menu, this should go to /media */}
          {showViewAllLink && (
            <Link
              to="/media"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              View all
            </Link>
          )}
        </div>
      )}

      {/* Empty / coming soon */}
      {count === 0 && (
        <div className="card-warm bg-muted/10 border border-border/40 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Camera className="w-7 h-7 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Gallery coming soon</h3>
          <p className="text-muted-foreground">We’re preparing beautiful photos and videos from our gatherings.</p>
        </div>
      )}

      {count > 0 && (
        <>
          {/* Main carousel */}
          <div className="relative">
            {/* Desktop arrows */}
            {count > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur border border-border shadow hover:bg-background"
                  onClick={() => api?.scrollPrev()}
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur border border-border shadow hover:bg-background"
                  onClick={() => api?.scrollNext()}
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <Carousel
                setApi={setApi}
                opts={{
                  align: "center",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-0">
                  {displayImages.map((media, index) => {
                    // Detect video from mimeType or type field
                    const isVideo = media.mimeType?.startsWith("video/") || media.type === "video";
                    const hasSrc = Boolean(media.src);

                    return (
                      <CarouselItem key={media.id ?? `${collection.id}-${index}`} className="pl-0">
                        <div className="relative aspect-[16/9] bg-muted">
                          {/* Click target opens lightbox */}
                          <button
                            type="button"
                            onClick={() => openLightbox(index)}
                            className={cn(
                              "absolute inset-0 w-full h-full",
                              hasSrc ? "cursor-zoom-in" : "cursor-default",
                            )}
                            aria-label={
                              hasSrc ? `Open ${isVideo ? "video" : "image"} in full screen` : "Media placeholder"
                            }
                          >
                            <span className="sr-only">Open</span>
                          </button>

                          {!hasSrc ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
                                <ImageIcon className="w-8 h-8" />
                                <span className="text-sm">Media coming soon</span>
                              </div>
                            </div>
                          ) : isVideo ? (
                            <div className="absolute inset-0">
                              {/* Preview uses poster/thumbnail; actual video playback with fullImageUrl happens in lightbox */}
                              {media.poster ? (
                                <img
                                  src={media.poster}
                                  alt={media.alt}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <video
                                  src={(media as any).fullImageUrl || media.src}
                                  className="w-full h-full object-cover"
                                  muted
                                  playsInline
                                  preload="none"
                                />
                              )}

                              <div className="absolute inset-0 bg-black/20" />
                              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Play className="w-3 h-3" />
                                Video
                              </div>
                            </div>
                          ) : (
                            <img
                              src={media.src}
                              alt={media.alt || collection.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}

                          {/* Slide counter */}
                          {count > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                              {current + 1}/{count}
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>

              {/* Caption */}
              {currentCaption && (
                <div className="px-4 py-3 bg-muted/30 border-t border-border/30">
                  <p className="text-body-small text-muted-foreground italic text-center">{currentCaption}</p>
                </div>
              )}
            </div>
          </div>

          {/* Dots - mobile */}
          {count > 1 && (
            <div className="flex justify-center gap-2 mt-4 md:hidden">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    current === index ? "bg-primary w-5" : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Thumbnails - desktop */}
          {count > 1 && (
            <div className="hidden md:flex justify-start gap-2 mt-4 max-w-4xl overflow-x-auto pb-1">
                  {displayImages.map((media, index) => {
                    const isVideo = media.mimeType?.startsWith("video/") || media.type === "video";
                    return (
                      <button
                        key={media.id ?? `${collection.id}-thumb-${index}`}
                        onClick={() => scrollTo(index)}
                        className={cn(
                          "flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200",
                          current === index
                            ? "border-primary ring-2 ring-primary/20 shadow-md"
                            : "border-border/40 opacity-60 hover:opacity-100 hover:border-border",
                        )}
                        aria-label={`View item ${index + 1}: ${media.alt || collection.title}`}
                      >
                        {media.src ? (
                          isVideo ? (
                            <>
                              {media.poster ? (
                                <img src={media.poster} alt="" loading="lazy" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <Play className="w-4 h-4 text-muted-foreground/50" />
                                </div>
                              )}
                            </>
                          ) : (
                            <img src={media.src} alt="" loading="lazy" className="w-full h-full object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-muted-foreground/30" />
                          </div>
                        )}
                      </button>
                    );
                  })}
            </div>
          )}

          {/* Lightbox */}
          {lightboxOpen && count > 0 && (
            <div className="fixed inset-0 z-[9999] bg-black/90">
              {/* Close */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Counter */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6 text-white/80 text-sm">
                {lightboxIndex + 1} / {count}
              </div>

              {/* Prev/Next */}
              {count > 1 && (
                <>
                  <button
                    onClick={prevLightbox}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextLightbox}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Media */}
              <div className="absolute inset-0 flex items-center justify-center px-4 py-16 md:py-20">
                <div className="w-full max-w-5xl">
                  <div className="bg-black/30 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <div className="relative bg-black aspect-[16/10] flex items-center justify-center">
                      {(() => {
                        const currentMedia = displayImages[lightboxIndex];
                        const isVideo = currentMedia?.mimeType?.startsWith("video/") || currentMedia?.type === "video";
                        const videoSrc = currentMedia?.fullImageUrl || currentMedia?.src;
                        const imageSrc = currentMedia?.fullImageUrl || currentMedia?.src;
                        
                        return isVideo ? (
                          <video
                            src={videoSrc}
                            poster={currentMedia?.poster}
                            controls
                            autoPlay
                            playsInline
                            preload="auto"
                            className="w-full h-full object-contain bg-black"
                          />
                        ) : (
                          <img
                            src={imageSrc}
                            alt={currentMedia?.alt || collection.title}
                            className="w-full h-full object-contain bg-black"
                            loading="eager"
                          />
                        );
                      })()}
                    </div>

                    {/* Caption */}
                    {(displayImages[lightboxIndex]?.caption || displayImages[lightboxIndex]?.alt) && (
                      <div className="px-4 py-3 text-center text-white/85 text-sm bg-black/40">
                        {displayImages[lightboxIndex]?.caption || displayImages[lightboxIndex]?.alt}
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-center text-white/40 text-xs">
                    Tip: Use ← → arrow keys to navigate, Esc to close.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Divider */}
      <div className="mt-10 border-b border-border/30 last:hidden" />
    </section>
  );
}
