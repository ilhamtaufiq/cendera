import type { ContactMessage, Notifier, NotifierEnv } from './types';

/**
 * Teruskan pesan ke webhook generik (n8n, Make, Zapier, gateway WhatsApp, Slack, dsb.).
 * Payload: { event: "contact.created", data: ContactMessage, text: "<ringkasan siap kirim ke WA>" }
 * Header opsional: Authorization: Bearer <CONTACT_WEBHOOK_TOKEN>
 */
export function webhookNotifier(env: NotifierEnv): Notifier {
  return {
    name: 'webhook',
    async send(m: ContactMessage) {
      if (!env.CONTACT_WEBHOOK_URL) throw new Error('CONTACT_WEBHOOK_URL belum diset');
      const text = `*Pesan baru — situs Cendera*\nNama: ${m.name}\nEmail: ${m.email}\nLayanan: ${m.service}\nAnggaran: ${m.budget ?? '-'}\n\n${m.message}`;
      const res = await fetch(env.CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(env.CONTACT_WEBHOOK_TOKEN ? { Authorization: `Bearer ${env.CONTACT_WEBHOOK_TOKEN}` } : {}),
        },
        body: JSON.stringify({ event: 'contact.created', data: m, text }),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
    },
  };
}
