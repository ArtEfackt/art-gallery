import '../styles/main.css';
import { getArtwork, getImageUrl } from '../api/artworks';
import { clearBusy, showError, showLoading } from '../components/status';
import { getAltText, getArtistName } from '../utils/artwork';
import { catalogUrl, parseCatalogState } from '../utils/catalog';
import { stripHtml } from '../utils/html';
import type { Artwork } from '../types/artwork';

const root = document.querySelector<HTMLElement>('#artwork-root');

function readArtworkId(): number | null {
  const raw = new URLSearchParams(location.search).get('id');
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function addMeta(dl: HTMLDListElement, term: string, value: string | null | undefined): void {
  if (!value) return;
  const dt = document.createElement('dt');
  dt.textContent = term;
  const dd = document.createElement('dd');
  dd.textContent = value;
  dl.append(dt, dd);
}

function renderArtwork(artwork: Artwork, iiifUrl: string): HTMLElement {
  const article = document.createElement('article');
  article.className = 'artwork-meta';
  article.setAttribute('aria-labelledby', 'artwork-title');

  const figure = document.createElement('figure');
  figure.className = 'artwork-hero';

  if (artwork.image_id) {
    const img = document.createElement('img');
    const preview = artwork.thumbnail?.lqip;
    img.setAttribute('referrerpolicy', 'no-referrer');
    img.referrerPolicy = 'no-referrer';
    img.alt = getAltText(artwork);
    if (preview) {
      img.style.backgroundImage = `url("${preview}")`;
      img.style.backgroundSize = 'contain';
      img.style.backgroundRepeat = 'no-repeat';
      img.style.backgroundPosition = 'center';
    }
    img.addEventListener(
      'error',
      () => {
        if (preview) img.src = preview;
      },
      { once: true },
    );
    figure.append(img);
    img.src = getImageUrl(iiifUrl, artwork.image_id, 1686);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'artwork-card__placeholder';
    placeholder.textContent = 'Зображення недоступне';
    figure.append(placeholder);
  }

  const title = document.createElement('h1');
  title.id = 'artwork-title';
  title.textContent = artwork.title;

  const artist = document.createElement('p');
  artist.textContent = getArtistName(artwork.artist_display);

  const dl = document.createElement('dl');
  addMeta(dl, 'Дата', artwork.date_display);
  addMeta(dl, 'Походження', artwork.place_of_origin);
  addMeta(dl, 'Матеріал', artwork.medium_display);
  addMeta(dl, 'Розмір', artwork.dimensions);
  addMeta(dl, 'Відділ', artwork.department_title);
  addMeta(dl, 'Тип', artwork.artwork_type_title);

  const museumLink = document.createElement('p');
  const link = document.createElement('a');
  link.href = `https://www.artic.edu/artworks/${artwork.id}`;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Сторінка в музеї';
  museumLink.append(link);

  article.append(figure, title, artist, dl, museumLink);

  const description = stripHtml(artwork.description);
  if (description) {
    const text = document.createElement('p');
    text.textContent = description;
    article.append(text);
  }

  document.title = `${artwork.title} — Віртуальна галерея мистецтва`;
  return article;
}

function catalogHref(): string {
  return catalogUrl(parseCatalogState(location.search));
}

function syncCatalogLinks(): void {
  const href = catalogHref();
  document.querySelectorAll<HTMLAnchorElement>('.back-link, .nav-list a').forEach((link) => {
    if (link.getAttribute('href')?.startsWith('catalog.html')) {
      link.href = href;
    }
  });
}

async function loadArtwork(): Promise<void> {
  if (!root) return;

  syncCatalogLinks();

  const id = readArtworkId();
  if (id === null) {
    showError(
      root,
      'Не вказано ідентифікатор твору.',
      () => {
        location.assign(catalogHref());
      },
      'До каталогу',
    );
    return;
  }

  showLoading(root);
  try {
    const { data, config } = await getArtwork(id);
    clearBusy(root);
    root.replaceChildren(renderArtwork(data, config.iiif_url));
  } catch {
    showError(root, 'Не вдалося завантажити твір. Можливо, його немає в API.', loadArtwork);
  }
}

void loadArtwork();
