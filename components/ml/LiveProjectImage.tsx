"use client";

import { useEffect, useState } from "react";

type FrontendImageItem = {
  cover: string | null;
  images: string[];
  updatedAt?: string;
};

type FrontendImagesResponse = {
  images: Record<string, FrontendImageItem>;
};

type LiveProjectImageProps = {
  slug: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  role?: "cover" | "slide";
  slideIndex?: number;
};

async function safeFetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function LiveProjectImage({
  slug,
  fallbackSrc,
  alt,
  className,
  role = "cover",
  slideIndex = 0,
}: LiveProjectImageProps) {
  const [images, setImages] = useState<Record<string, FrontendImageItem>>({});

  useEffect(() => {
    let active = true;

    async function load() {
      const data = await safeFetchJson<FrontendImagesResponse>(
        "/api/ml/frontend-images",
        { images: {} },
      );

      if (!active) return;
      setImages(data.images || {});
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const item = images[slug];

  const mlSrc =
    role === "cover"
      ? item?.cover
      : item?.images?.[slideIndex] || item?.cover;

  return (
    <img
      src={mlSrc || fallbackSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      data-ml-project-image="true"
      data-ml-project-slug={slug}
    />
  );
}
