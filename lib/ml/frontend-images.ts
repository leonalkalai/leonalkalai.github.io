import fs from "node:fs";
import path from "node:path";

export type FrontendImageItem = {
  cover: string | null;
  images: string[];
  updatedAt?: string;
};

const filePath = path.join(process.cwd(), "data", "ml", "frontend-images.json");

export function readFrontendImages(): Record<string, FrontendImageItem> {
  if (!fs.existsSync(filePath)) return {};

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

export function getProjectFrontendImages(
  slug: string,
  fallbackImages: string[] = [],
) {
  const map = readFrontendImages();
  const item = map[slug];

  const images =
    item?.images && item.images.length > 0
      ? item.images
      : fallbackImages;

  return {
    cover: item?.cover || images[0] || fallbackImages[0] || null,
    images,
  };
}
