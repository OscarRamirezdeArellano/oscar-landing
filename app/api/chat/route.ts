import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/data/chat-context';
import type { Lang } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

type Message = { role: 'user' | 'assistant'; content: string };

function cleanMessages(messages: Message[]): Message[] {
  return messages
    .filter((m) => m && typeof m.content === 'string')
    .map<Message>((m) => ({
      role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: m.content.trim().slice(0, 4000),
    }))
    .filter((m) => m.content.length > 0)
    .slice(-20); // keep last 20 turns
}

export async function POST(req: NextRequest) {
  let body: { messages?: Message[]; lang?: Lang };
  try {
    body = await req.json();
  } catch {
    return new Response('invalid json', { status: 400 });
  }

  const lang: Lang = body.lang === 'es' ? 'es' : 'en';
  const messages = cleanMessages(body.messages ?? []);

  if (messages.length === 0) {
    return new Response('no messages', { status: 400 });
  }
  // First user message must exist
  if (messages[0].role !== 'user') {
    return new Response('first message must be from user', { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response('server not configured', { status: 500 });
  }
  const model = process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001';

  const client = new Anthropic({ apiKey });

  try {
    const stream = client.messages.stream({
      model,
      max_tokens: 800,
      system: buildSystemPrompt(lang),
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (e) {
          console.error('chat stream error:', e);
          try {
            controller.enqueue(encoder.encode('\n\n[error: stream interrupted]'));
          } catch {}
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch (e) {
    console.error('chat error:', e);
    return new Response('chat failed', { status: 500 });
  }
}
