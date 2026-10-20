import { isArtworkType } from './artworkTypes';
import { isSortKey, type SortKey } from './sort';

export interface CatalogState {
  query: string;
  page: number;
  sort: SortKey;
  type: string;
  hasImage: boolean;
}

export function parseCatalogState(search: string): CatalogState {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const page = Number(params.get('page') ?? '1');
  const sortParam = params.get('sort');
  const typeParam = params.get('type');

  return {
    query: (params.get('q') ?? '').trim(),
    page: Number.isInteger(page) && page > 0 ? page : 1,
    sort: isSortKey(sortParam) ? sortParam : 'title',
    type: isArtworkType(typeParam) ? typeParam : '',
    hasImage: params.get('hasImage') === '1',
  };
}

export function catalogSearch(state: CatalogState): string {
  const params = new URLSearchParams();
  if (state.query) params.set('q', state.query);
  if (state.page > 1) params.set('page', String(state.page));
  if (state.sort !== 'title') params.set('sort', state.sort);
  if (state.type) params.set('type', state.type);
  if (state.hasImage) params.set('hasImage', '1');
  return params.toString();
}

export function catalogUrl(state: CatalogState): string {
  const search = catalogSearch(state);
  return search ? `catalog.html?${search}` : 'catalog.html';
}

export function artworkUrl(id: number, state?: CatalogState): string {
  const params = new URLSearchParams(state ? catalogSearch(state) : '');
  params.set('id', String(id));
  return `artwork.html?${params}`;
}
