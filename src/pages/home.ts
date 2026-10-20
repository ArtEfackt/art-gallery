import '../styles/main.css';
import { listArtworks } from '../api/artworks';
import { renderArtworkCards } from '../components/artworkCard';
import { showError, showLoading, showMessage } from '../components/status';

const list = document.querySelector<HTMLElement>('#featured-list');

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

async function loadFeatured(): Promise<void> {
  if (!list) return;

  showLoading(list);
  try {
    const { data, config } = await listArtworks({
      query: 'impressionism',
      page: 1,
      limit: 8,
      hasImage: true,
    });

    if (data.length === 0) {
      showMessage(list, 'Творів не знайдено.');
      return;
    }

    renderArtworkCards(list, data, config.iiif_url);
  } catch (error) {
    if (isAbortError(error)) return;
    showError(list, 'Не вдалося завантажити твори. Перевірте зʼєднання.', loadFeatured);
  }
}

void loadFeatured();
