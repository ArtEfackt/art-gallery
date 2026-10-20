export const ARTWORK_TYPES = [
  { value: 'Painting', label: 'Живопис' },
  { value: 'Photograph', label: 'Фотографія' },
  { value: 'Sculpture', label: 'Скульптура' },
  { value: 'Print', label: 'Графіка' },
  { value: 'Drawing and Watercolor', label: 'Рисунок і акварель' },
] as const;

export type ArtworkType = (typeof ARTWORK_TYPES)[number]['value'];

export function isArtworkType(value: string | null): value is ArtworkType {
  return ARTWORK_TYPES.some((type) => type.value === value);
}
