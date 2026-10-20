import '../styles/main.css';
import { listArtworks } from '../api/artworks';
import { renderArtworkCards } from '../components/artworkCard';
import { showError, showLoading, showMessage } from '../components/status';
import { ARTWORK_TYPES } from '../utils/artworkTypes';
import { catalogUrl, parseCatalogState } from '../utils/catalog';
import { isSortKey, sortArtworks } from '../utils/sort';

const list = document.querySelector<HTMLElement>('#catalog-list');
const meta = document.querySelector<HTMLElement>('#results-meta');
const pagination = document.querySelector<HTMLElement>('#pagination');
const searchForm = document.querySelector<HTMLFormElement>('.search-form');
const searchInput = document.querySelector<HTMLInputElement>('#search-input');
const sortSelect = document.querySelector<HTMLSelectElement>('#sort-select');
const typeSelect = document.querySelector<HTMLSelectElement>('#type-select');
const hasImageInput = document.querySelector<HTMLInputElement>('#has-image');

let activeRequest: AbortController | null = null;

function fillTypeOptions(): void {
  if (!typeSelect || typeSelect.options.length > 1) return;

  for (const type of ARTWORK_TYPES) {
    const option = document.createElement('option');
    option.value = type.value;
    option.textContent = type.label;
    typeSelect.append(option);
  }
}

function createPageControl(
  label: string,
  href: string,
  disabled: boolean,
  ariaLabel: string,
): HTMLElement {
  if (disabled) {
    const span = document.createElement('span');
    span.className = 'pagination__disabled';
    span.textContent = label;
    span.setAttribute('aria-disabled', 'true');
    span.setAttribute('aria-label', ariaLabel);
    return span;
  }

  const link = document.createElement('a');
  link.textContent = label;
  link.href = href;
  link.setAttribute('aria-label', ariaLabel);
  return link;
}

function renderPagination(
  current: number,
  total: number,
  state: ReturnType<typeof parseCatalogState>,
): void {
  if (!pagination) return;
  pagination.replaceChildren();
  if (total <= 1) return;

  const prev = createPageControl(
    'Назад',
    catalogUrl({ ...state, page: Math.max(1, current - 1) }),
    current <= 1,
    'Попередня сторінка',
  );
  const status = document.createElement('p');
  status.textContent = `Сторінка ${current} з ${total}`;
  status.setAttribute('aria-current', 'page');
  const next = createPageControl(
    'Далі',
    catalogUrl({ ...state, page: Math.min(total, current + 1) }),
    current >= total,
    'Наступна сторінка',
  );

  pagination.append(prev, status, next);
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

async function loadCatalog(): Promise<void> {
  if (!list) return;

  fillTypeOptions();
  const state = parseCatalogState(location.search);
  if (searchInput) searchInput.value = state.query;
  if (sortSelect) sortSelect.value = state.sort;
  if (typeSelect) typeSelect.value = state.type;
  if (hasImageInput) hasImageInput.checked = state.hasImage;

  activeRequest?.abort();
  activeRequest = new AbortController();

  showLoading(list);
  if (meta) meta.textContent = '';
  pagination?.replaceChildren();

  try {
    const response = await listArtworks(
      {
        query: state.query || undefined,
        page: state.page,
        limit: 12,
        type: state.type || undefined,
        hasImage: state.hasImage,
      },
      activeRequest.signal,
    );

    const artworks = sortArtworks(response.data, state.sort);

    if (artworks.length === 0) {
      showMessage(list, 'Нічого не знайдено. Спробуйте інший запит або зніміть фільтри.');
      return;
    }

    renderArtworkCards(list, artworks, response.config.iiif_url, state);

    if (meta) {
      const total = response.pagination.total.toLocaleString('uk-UA');
      meta.textContent = state.query
        ? `Знайдено ${total} творів за запитом «${state.query}».`
        : `У добірці ${total} творів.`;
    }

    renderPagination(response.pagination.current_page, response.pagination.total_pages, state);
  } catch (error) {
    if (isAbortError(error)) return;
    showError(list, 'Не вдалося завантажити каталог. Перевірте зʼєднання.', loadCatalog);
  }
}

function applyFilters(overrides: Partial<ReturnType<typeof parseCatalogState>>): void {
  const state = parseCatalogState(location.search);
  location.assign(catalogUrl({ ...state, page: 1, ...overrides }));
}

searchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  applyFilters({ query: searchInput?.value.trim() ?? '' });
});

sortSelect?.addEventListener('change', () => {
  applyFilters({ sort: isSortKey(sortSelect.value) ? sortSelect.value : 'title' });
});

typeSelect?.addEventListener('change', () => {
  applyFilters({ type: typeSelect.value });
});

hasImageInput?.addEventListener('change', () => {
  applyFilters({ hasImage: hasImageInput.checked });
});

void loadCatalog();
