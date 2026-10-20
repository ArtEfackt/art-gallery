import { describe, expect, it } from 'vitest';
import { artworkUrl, catalogUrl, parseCatalogState } from './catalog';

describe('parseCatalogState', () => {
  it('читає валідні параметри з URL', () => {
    expect(parseCatalogState('?q=Monet&page=3&sort=artist&type=Painting&hasImage=1')).toEqual({
      query: 'Monet',
      page: 3,
      sort: 'artist',
      type: 'Painting',
      hasImage: true,
    });
  });

  it('відкидає некоректні значення', () => {
    expect(parseCatalogState('page=-2&sort=color&type=Cars&hasImage=yes')).toEqual({
      query: '',
      page: 1,
      sort: 'title',
      type: '',
      hasImage: false,
    });
  });
});

describe('catalogUrl', () => {
  it('не додає параметри за замовчуванням', () => {
    expect(catalogUrl({ query: '', page: 1, sort: 'title', type: '', hasImage: false })).toBe(
      'catalog.html',
    );
  });

  it('збирає лише змінені фільтри', () => {
    expect(
      catalogUrl({
        query: 'cats',
        page: 2,
        sort: 'date',
        type: 'Photograph',
        hasImage: true,
      }),
    ).toBe('catalog.html?q=cats&page=2&sort=date&type=Photograph&hasImage=1');
  });
});

describe('artworkUrl', () => {
  it('додає лише id, якщо фільтрів немає', () => {
    expect(artworkUrl(42)).toBe('artwork.html?id=42');
  });

  it('прокидає стан каталогу, щоб можна було повернутися', () => {
    expect(
      artworkUrl(42, {
        query: 'cats',
        page: 2,
        sort: 'date',
        type: 'Photograph',
        hasImage: true,
      }),
    ).toBe('artwork.html?q=cats&page=2&sort=date&type=Photograph&hasImage=1&id=42');
  });

  it('ігнорує id при розборі стану каталогу', () => {
    expect(parseCatalogState('id=42&q=cats&page=2')).toEqual({
      query: 'cats',
      page: 2,
      sort: 'title',
      type: '',
      hasImage: false,
    });
  });
});
