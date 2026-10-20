import { describe, expect, it } from 'vitest';
import { getAltText, getArtistName } from './artwork';

describe('getArtistName', () => {
  it('бере перший рядок і відкидає роки в дужках', () => {
    expect(getArtistName('Vincent van Gogh\nDutch, 1853-1890')).toBe('Vincent van Gogh');
    expect(getArtistName('Claude Monet (1840-1926)')).toBe('Claude Monet');
  });

  it('повертає запасний текст, якщо автора немає', () => {
    expect(getArtistName(null)).toBe('Невідомий автор');
  });
});

describe('getAltText', () => {
  it('надає перевагу alt з thumbnail', () => {
    expect(
      getAltText({
        id: 1,
        title: 'Water Lilies',
        artist_display: null,
        date_display: null,
        image_id: 'abc',
        thumbnail: { alt_text: 'Painting of a pond' },
      }),
    ).toBe('Painting of a pond');
  });

  it('підставляє назву, якщо alt немає', () => {
    expect(
      getAltText({
        id: 1,
        title: 'Water Lilies',
        artist_display: null,
        date_display: null,
        image_id: null,
      }),
    ).toBe('Water Lilies');
  });
});
