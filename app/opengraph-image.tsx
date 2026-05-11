import { ImageResponse } from 'next/og';

export const alt = 'Oscar Ramírez · Full Stack & DevOps · AI / SaaS';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            'radial-gradient(ellipse at top left, #0c1228 0%, #0a0e14 60%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 60,
          fontFamily: 'monospace',
          color: '#c0caf5',
          position: 'relative',
        }}
      >
        {/* Window dots */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#27c93f' }} />
          <div style={{ color: '#565f89', fontSize: 16, marginLeft: 16 }}>oscar@iqsit — ~ — zsh</div>
        </div>

        {/* Prompt line */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0, marginBottom: 30, fontSize: 22 }}>
          <span style={{ color: '#9ece6a' }}>oscar@iqsit</span>
          <span style={{ color: '#565f89' }}>:</span>
          <span style={{ color: '#e0af68' }}>~</span>
          <span style={{ color: '#565f89' }}>$</span>
          <span style={{ color: '#00d9ff', marginLeft: 12 }}>whoami</span>
        </div>

        {/* Name big */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2, color: '#ffffff', lineHeight: 1, marginBottom: 8 }}>
            OSCAR RAMÍREZ
          </div>
          <div style={{ fontSize: 28, color: '#00d9ff', fontWeight: 600 }}>
            Full Stack &amp; DevOps Engineer
          </div>
          <div style={{ fontSize: 22, color: '#7dcfff', marginTop: 6 }}>
            AI Integration &amp; Vertical SaaS Architect
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 30, marginTop: 'auto', fontSize: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#565f89', fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase' }}>experience</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>20+ years</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#565f89', fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase' }}>focus</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>AI · Vertical SaaS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#565f89', fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase' }}>industries</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>Fiscal · Legal · Health · Gov</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#565f89', fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase' }}>available</span>
            <span style={{ color: '#9ece6a', fontWeight: 600 }}>● Hiring / Projects</span>
          </div>
        </div>

        {/* URL bottom right */}
        <div style={{ position: 'absolute', bottom: 30, right: 60, color: '#00d9ff', fontSize: 18, fontWeight: 600 }}>
          oscar.iqsit.com
        </div>
      </div>
    ),
    { ...size },
  );
}
