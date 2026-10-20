export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  const documentTree = new DOMParser().parseFromString(html, 'text/html');
  return (documentTree.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}
