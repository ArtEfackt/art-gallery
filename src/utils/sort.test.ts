import { describe, expect, it } from 'vitest';
import type { Artwork } from '../types/artwork';
import { isSortKey, sortArtworks } from './sort';

function artwork(overrides: Partial<Artwork>): Artwork {
  return {
    id: 1,
    title: 'Untitled',
    artist_display: 'Unknown',
    date_display: '1900',
    image_id: null,
    ...overrides,
  };
}

describe('isSortKey', () => {
  it('приймає лише відомі ключі', () => {
    expect(isSortKey('title')).toBe(true);
    expect(isSortKey('artist')).toBe(true);
    expect(isSortKey('date')).toBe(true);
    expect(isSortKey('color')).toBe(false);
    expect(isSortKey(null)).toBe(false);
  });
});

describe('sortArtworks', () => {
  const items = [
    artwork({
      id: 1,
      title: 'Water Lilies',
      artist_display: 'Monet\n1840-1926',
      date_display: '1906',
    }),
    artwork({
      id: 2,
      title: 'The Bedroom',
      artist_display: 'Van Gogh (1853–1890)',
      date_display: '1889',
    }),
    artwork({
      id: 3,
      title: 'American Gothic',
      artist_display: 'Grant Wood',
      date_display: '1930',
    }),
  ];

  it('сортує за назвою без мутації вхідного масиву', () => {
    const original = [...items];
    const sorted = sortArtworks(items, 'title');
    expect(sorted.map((item) => item.title)).toEqual([
      'American Gothic',
      'The Bedroom',
      'Water Lilies',
    ]);
    expect(items).toEqual(original);
  });

  it('сортує за коротким іменем автора', () => {
    const sorted = sortArtworks(items, 'artist');
    expect(sorted.map((item) => item.id)).toEqual([3, 1, 2]);
  });

  it('сортує за датою як за рядком', () => {
    const sorted = sortArtworks(items, 'date');
    expect(sorted.map((item) => item.date_display)).toEqual(['1889', '1906', '1930']);
  });
});
