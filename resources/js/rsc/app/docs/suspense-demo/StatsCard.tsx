"use client";

import { use } from 'react';

interface Stat {
  label: string;
  value: string | number;
}

const mono = "ui-monospace, 'SFMono-Regular', monospace";

export default function StatsCard({ dataPromise }: { dataPromise: Promise<Stat[]> }) {
  const stats = use(dataPromise);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: 20 }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 8,
            padding: '16px 14px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#fafafa',
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: '-0.02em',
            marginBottom: 4,
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: 12,
            color: '#71717a',
            fontFamily: mono,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
