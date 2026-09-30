import type { ContactMessage, Notifier, NotifierEnv } from './types';
import { escapeHtml } from '../http';

/** Kirim email lewat Resend REST API (https://resend.com/docs/api-reference/emails/send-email). */
export function resendNotifier(env: NotifierEnv): Notifier {
  return {
    name: 'resend',
    async send(m: ContactMessage) {
      if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) throw new Error('RESEND_API_KEY / CONTACT_TO_EMAIL belum diset');
      const rows: [string, string][] = [
        ['Nama', m.name],
        ['Email', m.email],
        ['Layanan', m.service],
        ['Anggaran', m.budget ?? '-'],
        ['Diterima', m.receivedAt],
      ];
      const html = `
        <div style="font-family:system-ui,sans-serif;max-width:560px">
          <h2 style="margin:0 0 16px">Pesan baru dari situs Cendera</h2>
          <table style="border-collapse:collapse;width:100%">
            ${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#666;width:110px">${k}</td><td style="padding:6px 0"><strong>${escapeHtml(v)}</strong></td></tr>`).join('')}
          </table>
          <p style="white-space:pre-wrap;border-left:3px solid #00D40E;padding:8px 12px;background:#f6f6f6">${escapeHtml(m.message)}</p>
          <p style="color:#999;font-size:12px">IP: ${escapeHtml(m.ip)} · UA: ${escapeHtml(m.userAgent.slice(0, 160))}</p>
        </div>`;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL ?? 'Cendera Web <onboarding@resend.dev>',
          to: env.CONTACT_TO_EMAIL.split(',').map((s) => s.trim()),
          reply_to: m.email,
          subject: `[Kontak] ${m.service} — ${m.name}`,
          html,
          text: rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\n${m.message}`,
        }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    },
  };
}
