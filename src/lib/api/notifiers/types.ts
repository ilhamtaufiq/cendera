/**
 * Kontrak adapter notifikasi form kontak.
 * Tambah adapter baru (mis. Telegram, Slack, Mailchannels) dengan mengimplementasikan `Notifier`
 * lalu mendaftarkannya di ./index.ts. Pilih yang aktif lewat env CONTACT_NOTIFIERS="resend,webhook".
 */
export interface ContactMessage {
  name: string;
  email: string;
  service: string;
  budget?: string;
  message: string;
  ip: string;
  userAgent: string;
  receivedAt: string; // ISO
  pageUrl?: string;
}

export interface Notifier {
  readonly name: string;
  send(msg: ContactMessage): Promise<void>;
}

/** Variabel environment yang relevan (dibaca dari `cloudflare:workers`). */
export interface NotifierEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_WEBHOOK_URL?: string;
  CONTACT_WEBHOOK_TOKEN?: string;
  CONTACT_NOTIFIERS?: string;
}
