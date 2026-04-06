// src/components/Messages.js — placeholder until Meta App Review
import React from 'react';

function Messages() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
                  justifyContent:'center', height:'60vh', gap:'12px' }}>
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.25 }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <p style={{ color:'var(--text-faint)', fontSize:'0.85rem', fontWeight:600 }}>
        Messages
      </p>
      <p style={{ color:'var(--text-faint)', fontSize:'0.75rem', textAlign:'center',
                  maxWidth:'240px', lineHeight:1.5 }}>
        Requires Meta App Review &amp; Business Verification.<br/>
        Available in production phase.
      </p>
    </div>
  );
}

export default Messages;