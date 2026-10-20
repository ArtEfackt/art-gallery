import type { Artwork } from '../types/artwork';

export function getArtistName(artistDisplay: string | null): string {
  if (!artistDisplay) return 'Невідомий автор';
  // API віддає кілька рядків: імʼя, роки життя, країну. Беремо перший.
  return artistDisplay.split('\n')[0].split('(')[0].trim();
}

export function getAltText(artwork: Artwork): string {
  return artwork.thumbnail?.alt_text ?? artwork.title;
}
