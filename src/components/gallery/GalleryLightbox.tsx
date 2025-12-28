import { useEffect, useMemo, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/components/gallery/GalleryCollection";

type Props = {
  open: boolean;
  items: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function GalleryLightbox({ open, items, index, onClose, onPrev, onNext }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const item = items[index];
  // Detect video from mimeType or type field
  const isVideo = item?.mimeType?.startsWith("video/") || (item?.type ?? "image") === "video";
  const caption = item?.caption ?? "";

  const safeIndexText = useMemo(() => {
    if (!items?.length) return "";
    return `${index + 1} / ${items.length}`;
  }, [items?.length, index]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKeyDown);

    // focus overlay for accessibility
    setTimeout(() => overlayRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open || !item) return null;

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 outline-none"
      role="dialog"
      aria-modal="true"
    >
      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Container */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 text-white/80">

          <span className="text-sm font-medium">{safeIndexText}</span>

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Media stage */}
        <div className="flex-1 relative flex items-center justify-center px-4 pb-4 overflow-hidden">

          {/* Prev/Next */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full h-11 w-11 bg-white/10 hover:bg-white/20 transition"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full h-11 w-11 bg-white/10 hover:bg-white/20 transition"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}

          {/* Media */}
          <div
            className="max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo ? (
              <video
                key={item.id || item.src}
                src={(item as any).fullImageUrl || item.src}
                poster={item.poster}
                controls
                autoPlay
                preload="auto"
                className="max-w-full max-h-[80vh] rounded-lg"
              />
            ) : (
              <img
                key={item.id || item.src}
                src={(item as any).fullImageUrl || item.src}
                alt={item.alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                loading="eager"
              />
            )}
          </div>

        </div>

        {/* Caption bar */}
        {caption && (
          <div className="px-4 pb-4 text-center">

            <p className="text-white/70 text-sm">{caption}</p>

          </div>

        )}
      </div>

    </div>

  );
}
