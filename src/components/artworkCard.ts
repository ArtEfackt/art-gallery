import type { Artwork } from '../types/artwork';
import { getImageUrl } from '../api/artworks';
import { clearBusy } from './status';
import { getAltText, getArtistName } from '../utils/artwork';
import { artworkUrl, type CatalogState } from '../utils/catalog';

export function createArtworkCard(
  artwork: Artwork,
  iiifUrl: string,
  catalogState?: CatalogState,
): HTMLElement {
  const card = document.createElement('article');
  card.className = 'artwork-card';

  if (artwork.image_id) {
    const img = document.createElement('img');
    const preview = artwork.thumbnail?.lqip;
    img.setAttribute('referrerpolicy', 'no-referrer');
    img.referrerPolicy = 'no-referrer';
    img.alt = getAltText(artwork);
    img.loading = 'lazy';
    img.width = 843;
    img.height = 632;
    if (preview) {
      img.style.backgroundImage = `url("${preview}")`;
      img.style.backgroundSize = 'cover';
    }
    img.addEventListener(
      'error',
      () => {
        if (preview) {
          img.src = preview;
          return;
        }
        img.replaceWith(createPlaceholder());
      },
      { once: true },
    );
    card.append(img);
    img.src = getImageUrl(iiifUrl, artwork.image_id);
  } else {
    card.append(createPlaceholder());
  }

  const body = document.createElement('div');
  body.className = 'artwork-card__body';

  const title = document.createElement('h3');
  const link = document.createElement('a');
  link.href = artworkUrl(artwork.id, catalogState);
  link.textContent = artwork.title;
  title.append(link);

  const artist = document.createElement('p');
  artist.textContent = getArtistName(artwork.artist_display);

  const date = document.createElement('p');
  date.className = 'artwork-card__date';
  date.textContent = artwork.date_display ?? '';

  body.append(title, artist, date);
  card.append(body);
  return card;
}

function createPlaceholder(): HTMLElement {
  const placeholder = document.createElement('div');
  placeholder.className = 'artwork-card__placeholder';
  placeholder.textContent = 'Без зображення';
  return placeholder;
}

export function renderArtworkCards(
  container: HTMLElement,
  artworks: Artwork[],
  iiifUrl: string,
  catalogState?: CatalogState,
): void {
  clearBusy(container);
  container.replaceChildren(
    ...artworks.map((artwork) => createArtworkCard(artwork, iiifUrl, catalogState)),
  );
}
