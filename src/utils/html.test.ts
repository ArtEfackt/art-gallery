import { describe, expect, it } from 'vitest';
import { stripHtml } from './html';

describe('stripHtml', () => {
  it('прибирає теги і зайві пробіли', () => {
    expect(stripHtml('<p>Hello <em>world</em></p>')).toBe('Hello world');
    expect(stripHtml('  <p>A</p>\n<p>B</p>  ')).toBe('A B');
  });

  it('повертає порожній рядок для порожніх значень', () => {
    expect(stripHtml(null)).toBe('');
    expect(stripHtml(undefined)).toBe('');
    expect(stripHtml('')).toBe('');
  });
});
