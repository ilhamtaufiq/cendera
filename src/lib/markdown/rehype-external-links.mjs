/** Tautan eksternal di Markdown dibuka di tab baru dengan rel aman. */
import { visit } from 'unist-util-visit';

export function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = String(node.properties?.href ?? '');
      if (/^https?:\/\//.test(href)) {
        node.properties.target = '_blank';
        node.properties.rel = ['noopener', 'noreferrer'];
      }
    });
  };
}
