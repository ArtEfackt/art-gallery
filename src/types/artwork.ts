export interface Artwork {
  id: number;
  title: string;
  artist_display: string | null;
  date_display: string | null;
  image_id: string | null;
  place_of_origin?: string | null;
  medium_display?: string | null;
  dimensions?: string | null;
  department_title?: string | null;
  artwork_type_title?: string | null;
  description?: string | null;
  thumbnail?: {
    alt_text: string | null;
    lqip?: string | null;
    width?: number;
    height?: number;
  } | null;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
}

export interface ArtworkListResponse {
  pagination: Pagination;
  data: Artwork[];
  config: { iiif_url: string };
}

export interface ArtworkResponse {
  data: Artwork;
  config: { iiif_url: string };
}
