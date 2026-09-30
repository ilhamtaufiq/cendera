import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '@/lib/content';
import { SITE } from '@/data/site';

export const prerender = true;

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `Blog ${SITE.name}`,
    description: 'Artikel teknologi, studi kasus, dan tips dari tim Cendera.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/blog/${p.id}`,
      categories: [p.data.category, ...p.data.tags],
      author: p.data.author,
    })),
    customData: '<language>id-ID</language>',
  });
}
