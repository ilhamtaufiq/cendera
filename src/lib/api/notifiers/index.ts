import type { ContactMessage, Notifier, NotifierEnv } from './types';
import { resendNotifier } from './resend';
import { webhookNotifier } from './webhook';

export type { ContactMessage, Notifier, NotifierEnv };

/** Adapter bawaan untuk pengembangan: cukup mencatat ke log Worker. */
const consoleNotifier: Notifier = {
  name: 'console',
  async send(m) {
    console.log('[kontak]', JSON.stringify({ ...m, message: m.message.slice(0, 200) }));
  },
};

const registry: Record<string, (env: NotifierEnv) => Notifier> = {
  resend: resendNotifier,
  webhook: webhookNotifier,
  console: () => consoleNotifier,
};

export function getNotifiers(env: NotifierEnv): Notifier[] {
  const names = (env.CONTACT_NOTIFIERS ?? 'console').split(',').map((s) => s.trim()).filter(Boolean);
  return names.map((n) => {
    const factory = registry[n];
    if (!factory) throw new Error(`Notifier "${n}" tidak dikenal`);
    return factory(env);
  });
}

/**
 * Kirim ke semua notifier aktif. Berhasil bila MINIMAL SATU adapter sukses,
 * sehingga gangguan di satu layanan (mis. webhook) tidak menggagalkan pesan.
 */
export async function dispatch(env: NotifierEnv, msg: ContactMessage) {
  const notifiers = getNotifiers(env);
  const results = await Promise.allSettled(notifiers.map((n) => n.send(msg)));
  results.forEach((r, i) => r.status === 'rejected' && console.error(`[notifier:${notifiers[i].name}]`, r.reason));
  return results.some((r) => r.status === 'fulfilled');
}
