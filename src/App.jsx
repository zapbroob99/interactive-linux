import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal } from 'xterm';
import { V86 } from 'v86';
import Markdown from 'markdown-to-jsx';
import { modules as initialSections } from './data/modules';
import TerminalWindow from './components/TerminalWindow';
import 'xterm/css/xterm.css';

function App() {
  const terminalRef = useRef(null);
  const xtermInstance = useRef(null);
  const emulatorRef = useRef(null);
  const isSettingUpRef = useRef(false);
  const keyboardBuffer = useRef(""); 
  const lastRealCommand = useRef(""); 
  const screenBuffer = useRef(""); 

  const [theme, setTheme] = useState('dark');
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [sections, setSections] = useState(initialSections);
  const [activeId, setActiveId] = useState(initialSections[0].items[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [contentWidth, setContentWidth] = useState(480);

  const flatModules = sections.flatMap(s => s.items);
  const activeModule = flatModules.find(m => m.id === activeId);
  const nextModule = flatModules[flatModules.findIndex(m => m.id === activeId) + 1];
  const allTasksCompleted = activeModule?.tasks.every(t => t.completed);

  const colors = {
    dark: { bg: '#0a0f1e', sidebar: '#0f172a', border: '#1e293b', text: '#f8fafc', subtext: '#94a3b8', taskBg: '#1e293b', accent: '#6366f1', termOuter: '#020617', success: '#10b981' },
    light: { bg: '#ffffff', sidebar: '#f8fafc', border: '#e2e8f0', text: '#0f172a', subtext: '#64748b', taskBg: '#f1f5f9', accent: '#4f46e5', termOuter: '#f8fafc', success: '#059669' }
  }[theme];

  const getCleanScreen = () => screenBuffer.current.replace(/[\x00-\x1F\x7F-\x9F\x1B\[[0-9;]*[JKmsu]/g, '');

  const executeCommand = async (cmd) => {
    if (!emulatorRef.current) return;
    return new Promise((resolve) => {
      setTimeout(() => {
        emulatorRef.current.serial0_send(cmd + '\n');
        let attempts = 0;
        const check = setInterval(() => {
          const lastPart = getCleanScreen().slice(-20);
          if (lastPart.includes('$') || lastPart.includes('#') || lastPart.includes('~')) {
            clearInterval(check);
            resolve();
          }
          if (++attempts > 20) { clearInterval(check); resolve(); }
        }, 100);
      }, 100);
    });
  };

  const startEmulator = useCallback(async (moduleId) => {
    if (isSettingUpRef.current) return;
    isSettingUpRef.current = true;

    if (emulatorRef.current) { 
      emulatorRef.current.destroy(); 
    }
    
    setIsSystemReady(false);
    screenBuffer.current = "";
    keyboardBuffer.current = "";
    lastRealCommand.current = "";

    const v86Config = {
      wasm_path: '/bin/v86.wasm',
      bios: { url: '/bin/seabios.bin' },
      vga_bios: { url: '/bin/vgabios.bin' },
      initial_state: { url: '/bin/v86state.bin' }, 
      autostart: true,
      memory_size: 512 * 1024 * 1024, 
      serial_container_xtermjs: terminalRef.current,
      serial_console: { xterm_lib: Terminal },
    };

    try {
      const emulator = new V86(v86Config);
      emulatorRef.current = emulator;
      window.emulator = emulator; 
      
      emulator.add_listener("serial0-output-byte", (byte) => {
        screenBuffer.current += String.fromCharCode(byte);
      });

      let pollCount = 0;
      const poll = setInterval(async () => {
        pollCount++;
        const term = emulator.serial_adapter?.term;
        
        if (term || pollCount > 50) {
          clearInterval(poll);
          if (!term) {
             console.error("Terminal adapter yüklenemedi!");
             return;
          }
          xtermInstance.current = term;
          term.focus();

          term.onData(data => {
            if (data === '\r') {
              const cmd = keyboardBuffer.current.trim();
              if (cmd) lastRealCommand.current = cmd;
              keyboardBuffer.current = "";
            } else if (data === '\u007f') {
              keyboardBuffer.current = keyboardBuffer.current.slice(0, -1);
            } else if (data.length === 1 && data.charCodeAt(0) >= 32) {
              keyboardBuffer.current += data;
            }
          });

          // Prompt bekleme döngüsü
          let waitAttempts = 0;
          const waitForPrompt = setInterval(async () => {
            waitAttempts++;
            const clean = getCleanScreen();
            
            // Eğer 3 saniye geçtiyse ve hala hazır değilse, sistemi uyandırmak için enter gönder
            if (waitAttempts === 3) {
                emulator.serial0_send('\n');
            }

            if (clean.includes('$') || clean.includes('#') || clean.includes('~') || clean.includes('login:')) {
                clearInterval(waitForPrompt);
                
                if (clean.includes('login:')) {
                    await executeCommand('root');
                }

                // Modül bazlı setup komutları (opsiyonel)
                const targetMod = initialSections.flatMap(s => s.items).find(m => m.id === moduleId);
                if (targetMod?.setupCommands) {
                    for (const cmd of targetMod.setupCommands) { await executeCommand(cmd); }
                }
                
                setIsSystemReady(true);
                isSettingUpRef.current = false;
                console.log("Sistem hazır!");
            }
            
            if (waitAttempts > 100) { // 100 saniye timeout
                clearInterval(waitForPrompt);
                console.error("Sistem zaman aşımına uğradı.");
            }
          }, 1000);
        }
      }, 200);

    } catch (e) { 
      console.error("V86 Crash:", e);
      isSettingUpRef.current = false;
    }
  }, []);

  useEffect(() => {
    startEmulator(activeId);
  }, [activeId, startEmulator]);

  useEffect(() => {
    const scan = setInterval(() => {
      if (!isSystemReady) return;
      const submitted = lastRealCommand.current.toLowerCase();
      const cleanScreen = getCleanScreen().toLowerCase();

      setSections(prev => {
        const newSections = JSON.parse(JSON.stringify(prev));
        let updated = false;
        newSections.forEach(section => {
          section.items.forEach(mod => {
            if (mod.id === activeId) {
              const taskIdx = mod.tasks.findIndex(t => !t.completed);
              if (taskIdx !== -1) {
                const task = mod.tasks[taskIdx];
                const trigger = task.trigger.toLowerCase().trim();
                let success = false;
                if (task.checkType === "input" && submitted === trigger) success = true;
                else if (task.checkType === "output" && cleanScreen.includes(trigger)) success = true;
                if (success) {
                  mod.tasks[taskIdx].completed = true;
                  lastRealCommand.current = ""; 
                  updated = true;
                }
              }
            }
          });
        });
        return updated ? newSections : prev;
      });
    }, 400);
    return () => clearInterval(scan);
  }, [activeId, isSystemReady]);

  const handleModuleSwitch = (id) => { if (isSystemReady && id !== activeId) setActiveId(id); };
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const startResizing = (e) => {
    const move = (me) => {
      const nw = me.clientX - (isSidebarOpen ? 280 : 80);
      if (nw > 350 && nw < 800) setContentWidth(nw);
    };
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
  };

 return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: colors.bg, color: colors.text, fontFamily: '"Plus Jakarta Sans", sans-serif', overflow: 'hidden', transition: 'background-color 0.3s' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: isSidebarOpen ? 280 : 80, backgroundColor: colors.sidebar, borderRight: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div style={{ padding: '40px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isSidebarOpen && (
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '18px' }}>
              <span style={{ color: colors.subtext, fontWeight: '400' }}>INTERACTIVE</span>
              <span style={{ color: colors.accent, fontWeight: '800', marginLeft: '4px' }}>LINUX</span>
              <span className="cursor-blink" style={{ color: colors.accent }}>_</span>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', color: colors.subtext, cursor: 'pointer', fontSize: '18px' }}>☰</button>
        </div>

        <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto', display: isSidebarOpen ? 'block' : 'none' }}>
          {sections.map(section => (
            <div key={section.title} style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: '800', color: colors.subtext, textTransform: 'uppercase', letterSpacing: '1.2px', padding: '0 16px', marginBottom: '12px' }}>{section.title}</h4>
              {section.items.map(mod => (
                <div key={mod.id} onClick={() => handleModuleSwitch(mod.id)} style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: activeId === mod.id ? '700' : '500', backgroundColor: activeId === mod.id ? `${colors.accent}15` : 'transparent', color: activeId === mod.id ? colors.accent : colors.subtext, transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  {mod.title}
                </div>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: contentWidth, padding: '60px 50px', overflowY: 'auto', borderRight: `1px solid ${colors.border}`, position: 'relative' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '800', color: colors.accent, textTransform: 'uppercase', letterSpacing: '1px' }}>Lesson {activeModule?.id}</span>
              <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1.5px', margin: '4px 0 0' }}>{activeModule?.title}</h1>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={toggleTheme} style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.taskBg, border: `1px solid ${colors.border}`, borderRadius: '12px', cursor: 'pointer', fontSize: '18px', transition: '0.2s' }}>
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button onClick={() => startEmulator(activeId)} style={{ background: colors.taskBg, color: colors.text, padding: '0 20px', borderRadius: '12px', border: `1px solid ${colors.border}`, cursor: 'pointer', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>
                RESET
              </button>
            </div>
          </header>

          <article style={{ color: colors.subtext, lineHeight: '1.8', fontSize: '16px', marginBottom: '40px' }}>
            <Markdown>{activeModule?.content || ''}</Markdown>
          </article>

          <section style={{ marginTop: '50px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '800', color: colors.subtext, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Görevler</h3>
            {activeModule?.tasks.map(task => (
              <div key={task.id} style={{ padding: '18px 24px', background: task.completed ? 'transparent' : colors.taskBg, borderRadius: '16px', border: `1px solid ${task.completed ? colors.success : colors.border}`, display: 'flex', gap: '16px', marginBottom: '12px', alignItems: 'center', opacity: task.completed ? 0.7 : 1, transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: task.completed ? colors.success : `${colors.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}>
                  {task.completed && <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>✓</span>}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: task.completed ? colors.subtext : colors.text, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</span>
              </div>
            ))}
            {allTasksCompleted && nextModule && (
              <button onClick={() => handleModuleSwitch(nextModule.id)} style={{ marginTop: '30px', width: '100%', padding: '20px', backgroundColor: colors.accent, color: '#fff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', boxShadow: `0 20px 40px -10px ${colors.accent}40`, transition: '0.3s' }}>
                Sonraki Modüle Geç ➔
              </button>
            )}
          </section>
        </div>

        <div onMouseDown={startResizing} style={{ width: '4px', cursor: 'col-resize', background: 'transparent', zIndex: 10 }} />

        {/* TERMINAL AREA */}
        <div style={{ flex: 1, padding: '40px', backgroundColor: colors.termOuter, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s', position: 'relative' }}>
          {!isSystemReady && (
            <div style={{ position: 'absolute', zIndex: 10, textAlign: 'center' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: `4px solid ${colors.accent}20`, borderTop: `4px solid ${colors.accent}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }} />
              <p style={{ fontSize: '11px', fontWeight: '800', color: colors.subtext, letterSpacing: '1px' }}>KERNEL LOADING...</p>
            </div>
          )}
          <div style={{ width: '100%', height: '100%', maxWidth: '960px', maxHeight: '640px', boxShadow: theme === 'light' ? '0 30px 60px -12px rgba(0,0,0,0.15)' : 'none', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#000', opacity: isSystemReady ? 1 : 0.4, transition: 'opacity 0.5s' }}>
             <TerminalWindow terminalRef={terminalRef} isRunning={true} />
          </div>
        </div>
      </main>

      {/* GLOBAL STYLES & ANIMATIONS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        .cursor-blink { display: inline-block; animation: blink-animation 1s steps(2, start) infinite; }
        @keyframes blink-animation { to { visibility: hidden; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default App;