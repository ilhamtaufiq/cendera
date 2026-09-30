/**
 * rehype-figures
 * - Semua <img> di Markdown diberi loading="lazy" + decoding="async".
 * - Gambar yang berdiri sendiri dalam paragraf dan punya title
 *   (`![alt](/img.webp "Keterangan")`) diubah menjadi <figure> + <figcaption>.
 * - Tabel dibungkus <div class="table-wrap"> agar bisa di-scroll horizontal di layar kecil.
 * - <iframe> (embed video) dibungkus <div class="video-embed"> dengan rasio 16:9.
 */
import { visit, SKIP } from 'unist-util-visit';

const isWhitespace = (n) => n.type === 'text' && !n.value.trim();

export function rehypeFigures() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'img') {
        node.properties.loading ??= 'lazy';
        node.properties.decoding ??= 'async';
      }

      if (node.tagName === 'p' && parent && index != null) {
        const kids = node.children.filter((c) => !isWhitespace(c));
        if (kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'img') {
          const img = kids[0];
          img.properties.loading = 'lazy';
          img.properties.decoding = 'async';
          const caption = img.properties.title;
          delete img.properties.title;
          parent.children[index] = {
            type: 'element',
            tagName: 'figure',
            properties: {},
            children: caption
              ? [img, { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: String(caption) }] }]
              : [img],
          };
          return SKIP;
        }
      }

      if ((node.tagName === 'table' || node.tagName === 'iframe') && parent && index != null) {
        const cls = node.tagName === 'table' ? 'table-wrap' : 'video-embed';
        if (parent.type === 'element' && parent.properties?.className?.includes?.(cls)) return;
        if (node.tagName === 'iframe') {
          node.properties.loading ??= 'lazy';
          node.properties.allowFullScreen = true;
          node.properties.title ??= 'Video';
        }
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: [cls], ...(cls === 'table-wrap' ? { tabIndex: 0, role: 'region', ariaLabel: 'Tabel' } : {}) },
          children: [node],
        };
        return SKIP;
      }
    });
  };
}
