import { describe, expect, it } from 'vitest';
import { buildListUrl, getImageUrl } from './artworks';

describe('getImageUrl', () => {
  it('будує IIIF URL потрібної ширини', () => {
    expect(getImageUrl('https://www.artic.edu/iiif/2', 'abc-123', 400)).toBe(
      'https://www.artic.edu/iiif/2/abc-123/full/400,/0/default.jpg',
    );
  });

  it('прибирає слеш і підставляє базовий IIIF', () => {
    expect(getImageUrl('https://www.artic.edu/iiif/2/', 'id')).toBe(
      'https://www.artic.edu/iiif/2/id/full/843,/0/default.jpg',
    );
    expect(getImageUrl(undefined, 'id', 100)).toBe(
      'https://www.artic.edu/iiif/2/id/full/100,/0/default.jpg',
    );
  });
});

describe('buildListUrl', () => {
  it('кодує пошук і фільтри в params', () => {
    const url = new URL(
      buildListUrl({ query: 'monet', page: 2, type: 'Painting', hasImage: true }),
    );
    const payload = JSON.parse(url.searchParams.get('params') ?? '{}') as {
      q: string;
      page: number;
      query: { bool: { must: object[] } };
    };

    expect(url.origin + url.pathname).toBe('https://api.artic.edu/api/v1/artworks/search');
    expect(payload.q).toBe('monet');
    expect(payload.page).toBe(2);
    expect(payload.query.bool.must).toEqual([
      { term: { 'artwork_type_title.keyword': 'Painting' } },
      { exists: { field: 'image_id' } },
    ]);
  });
});
