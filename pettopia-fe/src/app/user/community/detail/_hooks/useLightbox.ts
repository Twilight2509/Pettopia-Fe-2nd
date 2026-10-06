"use client";

import { useEffect, useState } from "react";

interface LightboxState {
  isOpen: boolean;
  currentIndex: number;
}

export function useLightbox(images?: string[]) {
  const [lightbox, setLightbox] = useState<LightboxState>({ isOpen: false, currentIndex: 0 });

  const openLightbox = (index: number) => {
    setLightbox({ isOpen: true, currentIndex: index });
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, currentIndex: 0 });
  };

  const goToPrevImage = () => {
    if (!images) return;
    setLightbox((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex > 0 ? prev.currentIndex - 1 : images.length - 1,
    }));
  };

  const goToNextImage = () => {
    if (!images) return;
    setLightbox((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex < images.length - 1 ? prev.currentIndex + 1 : 0,
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox.isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevImage();
      if (e.key === "ArrowRight") goToNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.isOpen, images]);

  return { lightbox, openLightbox, closeLightbox, goToPrevImage, goToNextImage };
}
