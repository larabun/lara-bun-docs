"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'lara-bun/usePathname';
import DocsSidebar from './DocsSidebar';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Toggle button — visible only on narrow screens via inline media query trick */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 60,
          width: 48,
          height: 48,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #f59e0b, #f97316)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(245,158,11,0.3)',
          color: '#09090b',
          fontSize: 20,
          fontWeight: 700,
        }}
        className="mobile-menu-btn"
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 55,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Sidebar drawer */}
      {open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 56,
          width: 280,
          background: '#09090b',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '24px 16px',
          overflowY: 'auto',
        }}>
          <div style={{ marginBottom: 24 }}>
            <span style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: '#fafafa',
            }}>
              LaraBun Docs
            </span>
          </div>
          <DocsSidebar />
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}} />
    </>
  );
}
