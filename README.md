# Віртуальна галерея мистецтва

Вебзастосунок для пошуку та перегляду творів з колекції [Art Institute of Chicago](https://www.artic.edu/). Формат: MPA з трьома сторінками — головна, каталог, деталі твору.

Жива версія після увімкнення GitHub Pages: [https://artefackt.github.io/art-gallery/](https://artefackt.github.io/art-gallery/)

## Технології

- HTML5 (семантична розмітка, skip-link, landmarks)
- CSS (змінні, Flexbox, Grid, responsive)
- TypeScript + модулі
- Vite + npm
- REST API Art Institute of Chicago
- Vitest, ESLint, Prettier

## API

Базовий URL: `https://api.artic.edu/api/v1`

- `GET /artworks/search` — список і пошук. Складні фільтри передаються JSON-ом у параметрі `params` (Query DSL Elasticsearch).
- `GET /artworks/{id}` — деталі твору.
- Зображення: IIIF `https://www.artic.edu/iiif/2/{image_id}/full/{width},/0/default.jpg`

Ключ API не потрібен.

## Запуск локально

```bash
npm install
npm run dev
```

Інші команди:

```bash
npm test          # unit-тести
npm run lint      # ESLint
npm run build     # production-збірка у dist/
npm run preview   # перегляд збірки
```

Потрібні Node.js 22+ і npm.

## Основна функціональність

Інтерактивні сценарії:

1. Пошук з головної сторінки (запит потрапляє в каталог як `?q=`).
2. Пошук у каталозі.
3. Фільтр за типом твору (живопис, фото, скульптура, графіка, рисунок).
4. Фільтр «лише з зображенням».
5. Сортування поточної сторінки за назвою, автором або датою.
6. Пагінація результатів.
7. Відкриття детальної картки твору; повернення в каталог зберігає пошук і фільтри.

Також є loading-стан, повідомлення про порожній результат і error-стан з повторною спробою.

## Структура проєкту

```text
index.html, catalog.html, artwork.html  — сторінки MPA
src/pages/        — логіка кожної сторінки
src/api/          — запити до REST API
src/components/   — картка твору і статуси
src/types/        — типи відповіді API
src/utils/        — сортування, фільтри, URL, sanitization HTML
src/styles/       — спільні стилі
```

## Короткий технічний звіт

- Дані з API мапляться на типи `Artwork`, `ArtworkListResponse`. Для списку запитуються лише потрібні `fields`, щоб відповідь була легшою.
- Фільтри типу й наявності зображення виконуються **на сервері API** через `term` і `exists`, тому пагінація рахує вже відфільтровану колекцію.
- Сортування навмисно клієнтське і діє на поточну сторінку (12 творів): API не дає стабільного sort за автором/назвою в тому ж запиті без окремого індексу.
- Картки й деталі рендеряться через DOM API, без `innerHTML` для даних з API. Опис твору очищається `DOMParser`, щоб не вставляти HTML музею як розмітку.
- Стан каталогу зберігається в URL (`q`, `page`, `sort`, `type`, `hasImage`) — сторінку можна поділити посиланням.
- Доступність: `lang="uk"`, skip-link, підписи полів, `aria-current`, `aria-live`, `aria-busy`, `role="status"|"alert"`, видимий `:focus-visible`, `alt` з thumbnail або назви.
- Адаптив: CSS Grid `auto-fill`, гнучкий хедер, на вузьких екранах метадані деталі стають в одну колонку.
- Деплой: GitHub Actions збирає `dist/` і публікує на GitHub Pages. `base: './'` у Vite, щоб відносні посилання працювали і локально, і в підкаталозі `/art-gallery/`.
