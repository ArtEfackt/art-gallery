import type { Artwork } from '../types/artwork';
import { getArtistName } from './artwork';

export type SortKey = 'title' | 'artist' | 'date';

export function isSortKey(value: string | null): value is SortKey {
  return value === 'title' || value === 'artist' || value === 'date';
}

export function sortArtworks(items: Artwork[], key: SortKey): Artwork[] {
  const valueOf = (artwork: Artwork): string => {
    if (key === 'artist') return getArtistName(artwork.artist_display);
    if (key === 'date') return artwork.date_display ?? '';
    return artwork.title;
  };

  return [...items].sort((left, right) =>
    valueOf(left).localeCompare(valueOf(right), 'uk', { sensitivity: 'base' }),
  );
}
