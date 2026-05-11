import Terminal from '@/components/Terminal';

export default function Home() {
  return (
    <main className="crt-wrapper">
      <div className="crt-vignette" aria-hidden="true" />
      <div className="crt-scanlines" aria-hidden="true" />
      <Terminal />
    </main>
  );
}
