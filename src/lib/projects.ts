import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

export type Project = CollectionEntry<'projects'>;

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}

// Every image inside src/content/projects/<folder>/images/ is shown in that project's gallery,
// in filename order (01.jpg, 02.jpg, ...). Just drop new photos in the folder.
const galleryFiles = import.meta.glob<{ default: ImageMetadata }>('/src/content/projects/*/images/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}', {
  eager: true,
});

export function getGallery(id: string): ImageMetadata[] {
  return Object.entries(galleryFiles)
    .filter(([p]) => p.split('/')[4] === id)
    .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
    .map(([, m]) => m.default);
}

export const pad2 = (n: number) => String(n).padStart(2, '0');

/** Turn a YouTube or Vimeo link into an id */
export function youtubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null;
}
export function vimeoId(url: string): string | null {
  const m = url?.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}
