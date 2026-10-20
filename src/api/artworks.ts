import type { ArtworkListResponse, ArtworkResponse } from '../types/artwork';

const BASE_URL = 'https://api.artic.edu/api/v1';
const DEFAULT_IIIF = 'https://www.artic.edu/iiif/2';
const LIST_FIELDS = [
  'id',
  'title',
  'artist_display',
  'date_display',
  'image_id',
  'thumbnail',
  'artwork_type_title',
];
const DETAIL_FIELDS = [
  ...LIST_FIELDS,
  'place_of_origin',
  'medium_display',
  'dimensions',
  'department_title',
  'description',
];

export interface ListParams {
  query?: string;
  page?: number;
  limit?: number;
  type?: string;
  hasImage?: boolean;
}

async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Помилка сервера: ${response.status}`);
  }
  return (await response.json()) as T;
}

export function buildListUrl(options: ListParams = {}): string {
  const must: object[] = [];

  if (options.type) {
    must.push({ term: { 'artwork_type_title.keyword': options.type } });
  }

  if (options.hasImage) {
    must.push({ exists: { field: 'image_id' } });
  }

  const payload: Record<string, unknown> = {
    page: options.page ?? 1,
    limit: options.limit ?? 12,
    fields: LIST_FIELDS,
  };

  if (options.query) payload.q = options.query;

  if (must.length === 1) {
    payload.query = must[0];
  } else if (must.length > 1) {
    payload.query = { bool: { must } };
  }

  const params = new URLSearchParams({ params: JSON.stringify(payload) });
  return `${BASE_URL}/artworks/search?${params}`;
}

export function listArtworks(
  options: ListParams = {},
  signal?: AbortSignal,
): Promise<ArtworkListResponse> {
  return request<ArtworkListResponse>(buildListUrl(options), signal);
}

export function getArtwork(id: number, signal?: AbortSignal): Promise<ArtworkResponse> {
  const params = new URLSearchParams({ fields: DETAIL_FIELDS.join(',') });
  return request<ArtworkResponse>(`${BASE_URL}/artworks/${id}?${params}`, signal);
}

export function getImageUrl(iiifUrl: string | undefined, imageId: string, width = 843): string {
  const base = (iiifUrl ?? DEFAULT_IIIF).replace(/\/$/, '');
  return `${base}/${imageId}/full/${width},/0/default.jpg`;
}
