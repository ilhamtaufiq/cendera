/**
 * URL publik yang bersih. Build memakai `build.format: 'file'` (halaman = /blog/slug.html),
 * tetapi Workers Static Assets menyajikannya di /blog/slug — jadi `.html`, `/index`, dan
 * garis miring di akhir dibuang agar canonical, og:url, dan tautan share tidak memuat ".html".
 */
export function cleanPath(pathname: string): string {
  const p = pathname
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/index$/, '/')
    .replace(/\/+$/, '');
  return p || '/';
}

export const absoluteUrl = (pathname: string, site: URL | undefined) => new URL(cleanPath(pathname), site).href;
