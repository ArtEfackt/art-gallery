export function showLoading(container: HTMLElement): void {
  container.setAttribute('aria-busy', 'true');

  const message = document.createElement('p');
  message.className = 'status';
  message.setAttribute('role', 'status');
  message.textContent = 'Завантаження…';
  container.replaceChildren(message);
}

export function showMessage(container: HTMLElement, text: string): void {
  container.removeAttribute('aria-busy');

  const message = document.createElement('p');
  message.className = 'status';
  message.setAttribute('role', 'status');
  message.textContent = text;
  container.replaceChildren(message);
}

export function showError(
  container: HTMLElement,
  text: string,
  onRetry: () => void,
  retryLabel = 'Спробувати ще',
): void {
  container.removeAttribute('aria-busy');

  const box = document.createElement('div');
  box.className = 'status status--error';
  box.setAttribute('role', 'alert');

  const message = document.createElement('p');
  message.textContent = text;

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = retryLabel;
  button.addEventListener('click', onRetry);

  box.append(message, button);
  container.replaceChildren(box);
}

export function clearBusy(container: HTMLElement): void {
  container.removeAttribute('aria-busy');
}
