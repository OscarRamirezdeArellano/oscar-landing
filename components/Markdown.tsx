'use client';

import React from 'react';

/**
 * Minimal markdown renderer for streaming chat output.
 *
 * Supported:
 * - **bold**, *italic*, `inline code`, [text](url)
 * - Unordered lists (- foo, * foo)
 * - Ordered lists (1. foo)
 * - Paragraphs (blank-line separated)
 *
 * Designed to handle partial / streaming markdown gracefully:
 * unclosed bold/italic markers just render as literal text until closed.
 */

function renderInline(text: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  // Order matters: bold (**) before italic (*) to avoid conflicts
  const regex = /(\*\*[^*\n]+?\*\*|\*[^*\n]+?\*|`[^`\n]+?`|\[[^\]\n]+?\]\([^)\n]+?\))/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      out.push(text.slice(lastIdx, match.index));
    }
    const m = match[0];
    if (m.startsWith('**')) {
      out.push(<strong key={key++}>{m.slice(2, -2)}</strong>);
    } else if (m.startsWith('`')) {
      out.push(<code key={key++}>{m.slice(1, -1)}</code>);
    } else if (m.startsWith('[')) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(m);
      if (linkMatch) {
        out.push(
          <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">
            {linkMatch[1]}
          </a>,
        );
      } else {
        out.push(m);
      }
    } else {
      // single-* italic
      out.push(<em key={key++}>{m.slice(1, -1)}</em>);
    }
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < text.length) out.push(text.slice(lastIdx));
  return <>{out}</>;
}

export default function Markdown({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  const ulRx = /^(\s*)[-*]\s+(.*)$/;
  const olRx = /^(\s*)(\d+)\.\s+(.*)$/;

  while (i < lines.length) {
    const line = lines[i];

    // Unordered list
    if (ulRx.test(line)) {
      const items: string[] = [];
      while (i < lines.length && ulRx.test(lines[i])) {
        const m = ulRx.exec(lines[i]);
        if (m) items.push(m[2]);
        i++;
      }
      blocks.push(
        <ul key={key++} className="md-ul">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (olRx.test(line)) {
      const items: string[] = [];
      while (i < lines.length && olRx.test(lines[i])) {
        const m = olRx.exec(lines[i]);
        if (m) items.push(m[3]);
        i++;
      }
      blocks.push(
        <ol key={key++} className="md-ol">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Blank line — paragraph break
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph: consecutive non-empty, non-list lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !ulRx.test(lines[i]) &&
      !olRx.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={key++} className="md-p">
        {paraLines.map((l, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <br />}
            {renderInline(l)}
          </React.Fragment>
        ))}
      </p>,
    );
  }

  return <>{blocks}</>;
}
