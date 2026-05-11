import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--fg)',
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        padding: 40,
      }}
    >
      <div style={{ maxWidth: 640, textAlign: 'left' }}>
        <div style={{ color: 'var(--green)', marginBottom: 12 }}>
          <span>oscar@iqsit</span>
          <span style={{ color: 'var(--dim)' }}>:</span>
          <span style={{ color: 'var(--yellow)' }}>~</span>
          <span style={{ color: 'var(--dim)' }}> $</span>{' '}
          <span style={{ color: 'var(--fg-bright)' }}>cat /var/log/404.log</span>
        </div>

        <pre
          style={{
            color: 'var(--pink)',
            fontSize: 'clamp(10px, 1.5vw, 14px)',
            lineHeight: 1.2,
            margin: '20px 0',
            whiteSpace: 'pre',
          }}
        >{`
 ██╗  ██╗ ██████╗ ██╗  ██╗
 ██║  ██║██╔═████╗██║  ██║
 ███████║██║██╔██║███████║
 ╚════██║████╔╝██║╚════██║
      ██║╚██████╔╝     ██║
      ╚═╝ ╚═════╝      ╚═╝
`}</pre>

        <div style={{ color: 'var(--fg)', marginBottom: 6 }}>
          <span style={{ color: 'var(--pink)' }}>command not found in the universe.</span>
        </div>
        <div style={{ color: 'var(--dim)', marginBottom: 20, fontSize: 14 }}>
          The path you followed leads nowhere. Could be a typo, a stale link, or a glitch in the matrix.
        </div>

        <div style={{ marginBottom: 4, color: 'var(--cyan)', fontSize: 14 }}>Try:</div>
        <div style={{ marginLeft: 16 }}>
          <Link
            href="/"
            style={{
              color: 'var(--accent)',
              textDecoration: 'none',
              borderBottom: '1px dotted var(--accent)',
            }}
          >
            cd / &nbsp;<span style={{ color: 'var(--dim)' }}>← go home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
