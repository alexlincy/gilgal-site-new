import { useMemo, useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { BackToTop } from "@/components/ui/BackToTop";
import { Youtube, PlayCircle, BookOpen, Sparkles, Loader2, AlertCircle } from "lucide-react";

import { GalleryCollection } from "@/components/gallery/GalleryCollection";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { ResourcesDevotionsTeaser } from "@/components/resources/ResourcesDevotionsTeaser";
import { useGoogleDriveGallery } from "@/hooks/useGoogleDriveGallery";

export default function Media() {
  const { images: allImages, loading, error } = useGoogleDriveGallery();

  const hasAnyImages = allImages.length > 0;

  const mergedCollection = useMemo(() => {
    return {
      id: "media-merged-gallery",
      title: "Gallery",
      description: "Swipe sideways to browse photos and videos.",
      images: allImages,
    };
  }, [allImages]);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const prevLightbox = useCallback(() => {
    if (!allImages.length) return;
    setLightboxIndex((i) => (i - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const nextLightbox = useCallback(() => {
    if (!allImages.length) return;
    setLightboxIndex((i) => (i + 1) % allImages.length);
  }, [allImages.length]);

  return (
    <Layout>
      <BackToTop />
      <HeroBanner
        title="Media"
        subtitle="Access sermons, teachings, and other media resources"
        primaryCta={{ text: "Visit YouTube", link: "https://www.youtube.com/@ipcgilgalshj" }}
      />

      <section className="section-light page-section">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">

            {/* ── Gallery Section ─────────────────────────────────────── */}
            <div className="mt-12">

              {/* Loading state */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <p className="text-sm">Loading gallery from Google Drive…</p>
                </div>
              )}

              {/* Error state */}
              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-destructive">
                  <AlertCircle className="w-8 h-8" />
                  <p className="text-sm font-medium">Could not load gallery</p>
                  <p className="text-xs text-muted-foreground max-w-sm text-center">{error}</p>
                </div>
              )}

              {/* Gallery carousel */}
              {!loading && !error && hasAnyImages && (
                <>
                  <GalleryCollection
                    collection={mergedCollection as any}
                    showViewAllLink={false}
                    onImageClick={openLightbox}
                  />
                  <GalleryLightbox
                    open={lightboxOpen}
                    items={allImages as any}
                    index={lightboxIndex}
                    onClose={closeLightbox}
                    onPrev={prevLightbox}
                    onNext={nextLightbox}
                  />
                </>
              )}

              {/* Empty state */}
              {!loading && !error && !hasAnyImages && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                  <p className="text-sm">No photos found in the gallery folder.</p>
                  <p className="text-xs">Upload images to your Google Drive folder to see them here.</p>
                </div>
              )}

            </div>
            {/* ──────────────────────────────────────────────────────────── */}

            {/* YouTube Channel - Featured */}
            <div className="card-warm mb-10 mt-14 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-destructive/10 rounded-full blur-3xl" />
              <div className="relative flex flex-col md:flex-row gap-8 items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-destructive/20 to-destructive/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Youtube className="w-12 h-12 text-destructive" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                    Our YouTube Channel
                  </h2>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    Visit our YouTube channel to access recorded sermons, teachings, and special programs from IPC
                    Gilgal Church.
                  </p>
                  <a
                    href="https://www.youtube.com/@ipcgilgalshj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold inline-flex items-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Visit YouTube Channel
                  </a>
                </div>
              </div>
            </div>

            {/* Content Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-warm group bg-gradient-to-br from-card via-gold-soft/30 to-card">
                <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-gold-soft rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Sermon Archive</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Browse our collection of recorded sermons and messages from our pastors and guest speakers.
                </p>
              </div>

              <div className="card-warm group bg-gradient-to-br from-card via-dove-light/40 to-card">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/15 to-dove-light rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Bible Teachings</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access Bible study sessions and teaching series designed to help deepen your understanding of
                  Scripture.
                </p>
              </div>
            </div>

            {/* Note */}
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <Sparkles className="w-4 h-4 text-accent" />
                <p className="text-sm">
                  New content is regularly added to our channel. Subscribe to stay updated with the latest uploads.
                </p>
              </div>
            </div>

            {/* Resources & Devotions CTA */}
            <div className="mt-14">
              <ResourcesDevotionsTeaser />
            </div>

          </div>
        </div>
      </section>

      {/* Scripture band */}
      <section className="section-reflective py-14 md:py-16 relative">
        <div className="absolute inset-0 pattern-stars" />
        <div className="section-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-lg md:text-xl italic text-primary-foreground/90 font-serif">
              "Faith comes from hearing the message, and the message is heard through the word about Christ."
            </blockquote>
            <p className="text-sm text-primary-foreground/50 mt-3 tracking-[0.2em] uppercase">Romans 10:17</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}