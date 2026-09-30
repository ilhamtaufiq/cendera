/**
 * Form kontak & newsletter:
 * - Memuat Turnstile secara lazy dan merender widget ke [data-turnstile]
 * - Mengirim data sebagai JSON ke endpoint Worker (/api/kontak, /api/newsletter)
 * - Menampilkan status loading / sukses / gagal (aria-live) + error per field
 */
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      getResponse: (id?: string) => string | undefined;
    };
    __cdrTurnstileLoading?: Promise<void>;
  }
}

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  window.__cdrTurnstileLoading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Turnstile gagal dimuat'));
    document.head.appendChild(s);
  });
  return window.__cdrTurnstileLoading;
}

async function renderWidget(form: HTMLFormElement) {
  const slot = form.querySelector<HTMLElement>('[data-turnstile]');
  if (!slot || slot.dataset.widgetId) return;
  await loadTurnstile();
  const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  slot.dataset.widgetId = window.turnstile!.render(slot, {
    sitekey: slot.dataset.sitekey,
    action: slot.dataset.action,
    theme,
    size: 'flexible',
    // Widget hanya tampil bila Cloudflare benar-benar butuh interaksi pengguna.
    appearance: 'interaction-only',
    language: 'id',
  });
}

function setStatus(form: HTMLFormElement, state: 'idle' | 'loading' | 'success' | 'error', message = '') {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  form.dataset.state = state;
  if (btn) {
    btn.disabled = state === 'loading';
    btn.setAttribute('aria-busy', String(state === 'loading'));
  }
  if (status) {
    status.textContent = message;
    status.dataset.state = state;
    status.hidden = !message;
  }
}

function showFieldErrors(form: HTMLFormElement, errors: Record<string, string> = {}) {
  form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => {
    const name = el.dataset.errorFor!;
    const input = form.elements.namedItem(name) as HTMLInputElement | null;
    el.textContent = errors[name] ?? '';
    el.hidden = !errors[name];
    input?.setAttribute('aria-invalid', errors[name] ? 'true' : 'false');
  });
  const first = Object.keys(errors)[0];
  if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
}

function initForm(form: HTMLFormElement) {
  // Lazy-load Turnstile saat form mendekati layar atau saat pengguna berinteraksi.
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      renderWidget(form).catch(() => {});
    }
  }, { rootMargin: '400px' });
  io.observe(form);
  form.addEventListener('focusin', () => renderWidget(form).catch(() => {}), { once: true });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showFieldErrors(form, {});
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const slot = form.querySelector<HTMLElement>('[data-turnstile]');
    const token = data['cf-turnstile-response'] || (slot?.dataset.widgetId ? window.turnstile?.getResponse(slot.dataset.widgetId) : '');
    if (!token) {
      await renderWidget(form).catch(() => {});
      setStatus(form, 'error', 'Mohon selesaikan verifikasi keamanan (Turnstile) terlebih dahulu.');
      return;
    }
    data.turnstileToken = token;
    delete data['cf-turnstile-response'];

    setStatus(form, 'loading', form.dataset.loadingText ?? 'Mengirim…');
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: Record<string, string> };
      if (res.ok && json.ok) {
        form.reset();
        setStatus(form, 'success', json.message ?? form.dataset.successText ?? 'Terima kasih!');
      } else {
        showFieldErrors(form, json.errors);
        setStatus(form, 'error', json.message ?? form.dataset.errorText ?? 'Terjadi kesalahan. Coba lagi.');
      }
    } catch {
      setStatus(form, 'error', form.dataset.errorText ?? 'Koneksi bermasalah. Periksa internet Anda lalu coba lagi.');
    } finally {
      if (slot?.dataset.widgetId) window.turnstile?.reset(slot.dataset.widgetId);
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-api-form]').forEach(initForm);

export {};
