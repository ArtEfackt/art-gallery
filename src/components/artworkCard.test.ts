import { describe, expect, it } from 'vitest';
import type { Artwork } from '../types/artwork';
import { createArtworkCard } from './artworkCard';

const sample: Artwork = {
  id: 42,
  title: 'Starry Night',
  artist_display: 'Vincent van Gogh\nDutch, 1853-1890',
  date_display: '1889',
  image_id: null,
};

describe('createArtworkCard', () => {
  it('рендерить назву, автора і посилання на деталі', () => {
    const card = createArtworkCard(sample, 'https://iiif.example');
    const link = card.querySelector('a');

    expect(card.querySelector('h3')?.textContent).toBe('Starry Night');
    expect(card.textContent).toContain('Vincent van Gogh');
    expect(link?.getAttribute('href')).toBe('artwork.html?id=42');
  });

  it('ставить no-referrer до завантаження IIIF-зображення', () => {
    const withImage: Artwork = { ...sample, image_id: 'abc-123' };
    const card = createArtworkCard(withImage, 'https://www.artic.edu/iiif/2');
    const img = card.querySelector('img');

    expect(img?.getAttribute('referrerpolicy')).toBe('no-referrer');
    expect(img?.getAttribute('src')).toContain('/abc-123/full/');
  });

  it('зберігає фільтри каталогу в URL картки', () => {
    const card = createArtworkCard(sample, 'https://iiif.example', {
      query: 'night',
      page: 2,
      sort: 'artist',
      type: 'Painting',
      hasImage: true,
    });

    expect(card.querySelector('a')?.getAttribute('href')).toBe(
      'artwork.html?q=night&page=2&sort=artist&type=Painting&hasImage=1&id=42',
    );
  });
});
