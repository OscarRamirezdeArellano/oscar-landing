import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

type Body = {
  name?: string;
  email?: string;
  message?: string;
};

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const message = (body.message ?? '').trim();

  if (!name || name.length < 2 || name.length > 120) {
    return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 400 });
  }
  if (!email || !isValidEmail(email) || email.length > 200) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (!message || message.length < 10 || message.length > 5000) {
    return NextResponse.json({ ok: false, error: 'invalid_message' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Missing RESEND_API_KEY');
    return NextResponse.json({ ok: false, error: 'server_misconfigured' }, { status: 500 });
  }

  const from = process.env.CONTACT_FROM || 'oscar.iqsit.com <onboarding@resend.dev>';
  const to = process.env.CONTACT_TO || 'oscar@iqsit.com';

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[oscar.iqsit.com] ${name}`,
      text:
        `New message from oscar.iqsit.com\n\n` +
        `Name:    ${name}\n` +
        `Email:   ${email}\n` +
        `Date:    ${new Date().toISOString()}\n` +
        `IP:      ${req.headers.get('x-forwarded-for') || 'unknown'}\n\n` +
        `─── Message ─────────────────────────\n${message}\n`,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: result.data?.id ?? null });
  } catch (e) {
    console.error('Contact send failed:', e);
    return NextResponse.json({ ok: false, error: 'unexpected' }, { status: 500 });
  }
}
