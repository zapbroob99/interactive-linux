import React from 'react';

const TerminalWindow = ({ terminalRef, isRunning }) => {
  return (
    <div style={{
      width: '100%', maxWidth: '950px', height: '100%', maxHeight: '650px',
      display: 'flex', flexDirection: 'column', borderRadius: '16px',
      overflow: 'hidden', boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.8)',
      border: '1px solid #334155', backgroundColor: '#000'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', background: '#1e293b', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', gap: '8px', width: '60px' }}>
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#27c93f' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', color: '#94a3b8', fontSize: '11px', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '1px' }}>
          TERMINAL — ZSH
        </div>
        <div style={{ width: '60px' }} />
      </div>

      <div style={{ flex: 1, padding: '20px', position: 'relative' }}>
        {!isRunning && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>💿</div>
            <p style={{ fontSize: '13px', fontWeight: '500' }}>Sistem başlatılmayı bekliyor...</p>
          </div>
        )}
        <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default TerminalWindow;