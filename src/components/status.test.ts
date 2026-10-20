import { describe, expect, it, vi } from 'vitest';
import { showError, showLoading, showMessage } from './status';

describe('status', () => {
  it('показує loading з aria-busy', () => {
    const root = document.createElement('div');
    showLoading(root);

    expect(root.getAttribute('aria-busy')).toBe('true');
    expect(root.querySelector('[role="status"]')?.textContent).toBe('Завантаження…');
  });

  it('показує порожній результат без busy', () => {
    const root = document.createElement('div');
    showMessage(root, 'Нічого не знайдено.');

    expect(root.hasAttribute('aria-busy')).toBe(false);
    expect(root.textContent).toBe('Нічого не знайдено.');
  });

  it('дає повторити запит з error-стану', () => {
    const root = document.createElement('div');
    const onRetry = vi.fn();
    showError(root, 'Не вдалося завантажити.', onRetry);

    expect(root.querySelector('[role="alert"]')).not.toBeNull();
    root.querySelector('button')?.click();
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
