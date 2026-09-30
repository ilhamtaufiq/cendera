/**
 * remark-callouts — mengubah blockquote bergaya GitHub menjadi callout.
 *
 *   > [!NOTE] Judul opsional
 *   > Isi callout...
 *
 * Tipe: NOTE (Catatan), TIP (Tips), IMPORTANT (Penting), WARNING (Peringatan), CAUTION (Hati-hati).
 * Blockquote biasa tetap dirender sebagai kutipan bergaya.
 */
import { visit } from 'unist-util-visit';

const LABELS = {
  note: 'Catatan',
  tip: 'Tips',
  important: 'Penting',
  warning: 'Peringatan',
  caution: 'Hati-hati',
};

export function remarkCallouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const first = node.children?.[0];
      const text = first?.type === 'paragraph' ? first.children?.[0] : null;
      if (!text || text.type !== 'text') return;
      const match = text.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(.*)(\n|$)/i);
      if (!match) return;

      const type = match[1].toLowerCase();
      const title = match[2].trim() || LABELS[type];
      text.value = text.value.slice(match[0].length);
      if (!text.value && first.children.length === 1) node.children.shift();
      else if (!text.value) first.children.shift();

      node.data = {
        hName: 'aside',
        hProperties: { className: ['callout', `callout-${type}`], role: 'note' },
      };
      node.children.unshift({
        type: 'paragraph',
        data: { hProperties: { className: ['callout-title'] } },
        children: [{ type: 'text', value: title }],
      });
    });
  };
}
