import { useCallback, useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { V86 } from 'v86';
import Markdown from 'markdown-to-jsx';
import { modules as initialSections } from './data/modules';
import TerminalWindow from './components/TerminalWindow';
import { applyCommandToDirectoryState, createDirectoryState, isTaskComplete } from './lib/taskValidation';
import 'xterm/css/xterm.css';

function App() {
  const terminalRef = useRef(null);
  const lessonPanelRef = useRef(null);
  const sidebarNavRef = useRef(null);
  const emulatorRef = useRef(null);
  const isSettingUpRef = useRef(false);
  const keyboardBuffer = useRef('');
  const lastRealCommand = useRef('');
  const commandSerial = useRef(0);
  const processedCommandSerial = useRef(0);
  const screenBuffer = useRef('');
  const directoryState = useRef(createDirectoryState());

  const [theme, setTheme] = useState('dark');
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [sections, setSections] = useState(initialSections);
  const [activeId, setActiveId] = useState(initialSections[0].items[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [contentWidth, setContentWidth] = useState(480);

  const flatModules = sections.flatMap(section => section.items);
  const activeModule = flatModules.find(module => module.id === activeId);

  const getCleanScreen = useCallback(() => {
    const escapeChar = String.fromCharCode(27);
    const ansiPattern = new RegExp(`${escapeChar}\\[[0-9;]*[JKmsu]`, 'g');
    return screenBuffer.current
      .replace(ansiPattern, '')
      .split('')
      .filter(char => {
        const code = char.charCodeAt(0);
        return code > 31 && (code < 127 || code > 159);
      })
      .join('');
  }, []);

  const updateTrackedDirectory = useCallback((cmd, cleanScreen = '') => {
    directoryState.current = applyCommandToDirectoryState(cmd, directoryState.current, cleanScreen);
  }, []);

  const executeCommand = useCallback(async (cmd) => {
    if (!emulatorRef.current) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        emulatorRef.current.serial0_send(`${cmd}\n`);
        let attempts = 0;
        const check = setInterval(() => {
          const lastPart = getCleanScreen().slice(-20);
          if (lastPart.includes('$') || lastPart.includes('#') || lastPart.includes('~')) {
            clearInterval(check);
            updateTrackedDirectory(cmd, getCleanScreen());
            resolve();
          }
          if (++attempts > 20) {
            clearInterval(check);
            updateTrackedDirectory(cmd, getCleanScreen());
            resolve();
          }
        }, 100);
      }, 100);
    });
  }, [getCleanScreen, updateTrackedDirectory]);

  const startEmulator = useCallback(async (moduleId) => {
    if (isSettingUpRef.current) return;
    isSettingUpRef.current = true;

    if (emulatorRef.current) {
      emulatorRef.current.destroy();
    }

    setIsSystemReady(false);
    screenBuffer.current = '';
    keyboardBuffer.current = '';
    lastRealCommand.current = '';
    commandSerial.current = 0;
    processedCommandSerial.current = 0;
    directoryState.current = createDirectoryState();

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

      emulator.add_listener('serial0-output-byte', (byte) => {
        screenBuffer.current += String.fromCharCode(byte);
      });

      let pollCount = 0;
      const poll = setInterval(async () => {
        pollCount++;
        const term = emulator.serial_adapter?.term;

        if (term || pollCount > 50) {
          clearInterval(poll);
          if (!term) {
            console.error('Terminal adapter failed to load.');
            return;
          }

          term.onData(data => {
            if (data === '\r') {
              const cmd = keyboardBuffer.current.trim();
              if (cmd) {
                lastRealCommand.current = cmd;
                commandSerial.current += 1;
              }
              keyboardBuffer.current = '';
            } else if (data === '\u007f') {
              keyboardBuffer.current = keyboardBuffer.current.slice(0, -1);
            } else if (data.length === 1 && data.charCodeAt(0) >= 32) {
              keyboardBuffer.current += data;
            }
          });

          // Wait until the restored VM exposes a usable shell prompt.
          let waitAttempts = 0;
          const waitForPrompt = setInterval(async () => {
            waitAttempts++;
            const clean = getCleanScreen();

            if (waitAttempts === 3) {
              emulator.serial0_send('\n');
            }

            if (clean.includes('$') || clean.includes('#') || clean.includes('~') || clean.includes('login:')) {
              clearInterval(waitForPrompt);

              if (clean.includes('login:')) {
                await executeCommand('root');
              }

              const targetMod = initialSections.flatMap(section => section.items).find(module => module.id === moduleId);
              if (targetMod?.setupCommands) {
                for (const cmd of targetMod.setupCommands) {
                  await executeCommand(cmd);
                }
              }

              setIsSystemReady(true);
              isSettingUpRef.current = false;
              console.log('System ready.');
            }

            if (waitAttempts > 100) {
              clearInterval(waitForPrompt);
              console.error('System timed out while waiting for the shell prompt.');
            }
          }, 1000);
        }
      }, 200);
    } catch (error) {
      console.error('V86 crash:', error);
      isSettingUpRef.current = false;
    }
  }, [executeCommand, getCleanScreen]);

  useEffect(() => {
    startEmulator(activeId);
  }, [activeId, startEmulator]);

  useEffect(() => {
    const scan = setInterval(() => {
      if (!isSystemReady) return;
      const submitted = lastRealCommand.current.toLowerCase();
      const cleanScreen = getCleanScreen().toLowerCase();
      const hasNewCommand = processedCommandSerial.current !== commandSerial.current;

      if (hasNewCommand) {
        updateTrackedDirectory(lastRealCommand.current, cleanScreen);
        processedCommandSerial.current = commandSerial.current;
      }

      setSections(prev => {
        const newSections = JSON.parse(JSON.stringify(prev));
        let updated = false;

        newSections.forEach(section => {
          section.items.forEach(module => {
            if (module.id === activeId) {
              const taskIdx = module.tasks.findIndex(task => !task.completed);
              if (taskIdx !== -1) {
                const task = module.tasks[taskIdx];
                let success = false;

                success = isTaskComplete(task, {
                  submittedCommand: submitted,
                  cleanScreen,
                  cwd: directoryState.current.cwd,
                });

                if (success) {
                  module.tasks[taskIdx].completed = true;
                  lastRealCommand.current = '';
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
  }, [activeId, getCleanScreen, isSystemReady, updateTrackedDirectory]);

  const handleModuleSwitch = (id) => {
    if (isSystemReady && id !== activeId) setActiveId(id);
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const scrollElementByWheel = useCallback((event, element) => {
    if (!element) return;

    const maxScrollTop = element.scrollHeight - element.clientHeight;
    if (maxScrollTop <= 0) return;

    const nextScrollTop = Math.max(0, Math.min(maxScrollTop, element.scrollTop + event.deltaY));
    if (nextScrollTop === element.scrollTop) return;

    event.preventDefault();
    event.stopPropagation();
    element.scrollTop = nextScrollTop;
  }, []);

  const handleLessonWheel = useCallback((event) => {
    scrollElementByWheel(event, lessonPanelRef.current);
  }, [scrollElementByWheel]);

  const handleSidebarWheel = useCallback((event) => {
    scrollElementByWheel(event, sidebarNavRef.current);
  }, [scrollElementByWheel]);

  const startResizing = () => {
    const move = (event) => {
      const nextWidth = event.clientX - (isSidebarOpen ? 280 : 80);
      if (nextWidth > 350 && nextWidth < 800) setContentWidth(nextWidth);
    };

    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const currentColors = theme === 'dark' ? {
    bg: '#020617',
    sidebar: '#0f172a',
    text: '#f8fafc',
    accent: '#3b82f6',
    border: 'rgba(255, 255, 255, 0.08)',
    subtext: '#94a3b8',
    accentBg: 'rgba(59, 130, 246, 0.1)',
  } : {
    bg: '#ffffff',
    sidebar: '#f4f4f4',
    text: '#000000',
    accent: '#2563eb',
    border: '#e2e8f0',
    subtext: '#64748b',
    accentBg: 'rgba(37, 99, 235, 0.1)',
  };

  const iconLineStyle = {
    width: '14px',
    height: '2px',
    borderRadius: '999px',
    backgroundColor: currentColors.subtext,
    display: 'block',
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: currentColors.bg, color: currentColors.text, fontFamily: '"Plus Jakarta Sans", sans-serif', overflow: 'hidden', transition: 'background-color 0.3s' }}>
      <aside style={{ width: isSidebarOpen ? 280 : 80, minWidth: isSidebarOpen ? 280 : 80, minHeight: 0, backgroundColor: currentColors.sidebar, borderRight: `1px solid ${currentColors.border}`, display: 'flex', flexDirection: 'column', transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div style={{ padding: isSidebarOpen ? '32px 18px 24px' : '32px 20px 24px', display: 'flex', justifyContent: isSidebarOpen ? 'space-between' : 'center', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {isSidebarOpen && (
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '17px', display: 'flex', alignItems: 'baseline', flexWrap: 'nowrap', whiteSpace: 'nowrap', minWidth: 0 }}>
              <span style={{ color: currentColors.subtext, fontWeight: '400' }}>INTERACTIVE</span>
              <span style={{ color: currentColors.accent, fontWeight: '800', marginLeft: '4px' }}>LINUX</span>
              <span className="cursor-blink" style={{ color: currentColors.accent, flexShrink: 0 }}>_</span>
            </div>
          )}
          <button aria-label="Toggle lesson navigation" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Toggle navigation" style={{ width: '34px', height: '34px', flex: '0 0 34px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', background: currentColors.accentBg, border: `1px solid ${currentColors.border}`, borderRadius: '8px', cursor: 'pointer', padding: 0 }}>
            <span style={iconLineStyle} />
            <span style={iconLineStyle} />
            <span style={iconLineStyle} />
          </button>
        </div>

        <nav ref={sidebarNavRef} onWheelCapture={handleSidebarWheel} style={{ flex: '1 1 auto', minHeight: 0, padding: '0 12px 24px', overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain', display: isSidebarOpen ? 'block' : 'none' }}>
          {sections.map(section => (
            <div key={section.title} style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: '800', color: currentColors.subtext, textTransform: 'uppercase', letterSpacing: '1.2px', padding: '0 16px', marginBottom: '12px' }}>{section.title}</h4>
              {section.items.map(module => (
                <div key={module.id} onClick={() => handleModuleSwitch(module.id)} style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: activeId === module.id ? '700' : '500', backgroundColor: activeId === module.id ? currentColors.accentBg : 'transparent', color: activeId === module.id ? currentColors.accent : currentColors.subtext, transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  {module.title}
                </div>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, minWidth: 0, minHeight: 0, height: '100vh', display: 'flex', overflow: 'hidden' }}>
        <div ref={lessonPanelRef} onWheelCapture={handleLessonWheel} style={{ flex: `0 0 ${contentWidth}px`, width: contentWidth, height: '100vh', minHeight: 0, padding: '60px 50px', overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', borderRight: `1px solid ${currentColors.border}`, position: 'relative' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '800', color: currentColors.accent, textTransform: 'uppercase', letterSpacing: '1px' }}>Lesson {activeModule?.id}</span>
              <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: 0, margin: '4px 0 0' }}>{activeModule?.title}</h1>
              {activeModule?.bookSection && (
                <p style={{ margin: '10px 0 0', color: currentColors.subtext, fontSize: '12px', fontWeight: '700', letterSpacing: '0.4px' }}>
                  Book section: {activeModule.bookSection}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={toggleTheme} style={{ minWidth: '64px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: currentColors.sidebar, border: `1px solid ${currentColors.border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '800', color: currentColors.text, transition: '0.2s' }}>
                {theme === 'dark' ? 'LIGHT' : 'DARK'}
              </button>
              <button onClick={() => startEmulator(activeId)} style={{ background: currentColors.sidebar, color: currentColors.text, padding: '0 20px', borderRadius: '8px', border: `1px solid ${currentColors.border}`, cursor: 'pointer', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>
                RESET
              </button>
            </div>
          </header>

          <article style={{ color: currentColors.subtext, lineHeight: '1.8', fontSize: '16px', marginBottom: '40px' }}>
            <Markdown>{activeModule?.content || ''}</Markdown>
          </article>

          <section style={{ marginTop: '50px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '800', color: currentColors.subtext, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Tasks</h3>
            {activeModule?.tasks.map(task => (
              <div key={task.id} className={task.completed ? 'task-completed' : ''} style={{ padding: '18px 24px', background: task.completed ? 'transparent' : currentColors.sidebar, borderRadius: '8px', border: `1px solid ${task.completed ? '#10b981' : currentColors.border}`, display: 'flex', gap: '16px', marginBottom: '12px', alignItems: 'center', opacity: task.completed ? 0.7 : 1, transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: task.completed ? '#10b981' : currentColors.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}>
                  {task.completed && <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{'\u2713'}</span>}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: task.completed ? currentColors.subtext : currentColors.text, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</span>
              </div>
            ))}
          </section>
        </div>

        <div onMouseDown={startResizing} style={{ width: '4px', cursor: 'col-resize', background: 'transparent' }} />

        <div style={{ flex: '1 1 auto', minWidth: 0, minHeight: 0, padding: '40px', backgroundColor: currentColors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s', position: 'relative', overflow: 'hidden' }}>
          {!isSystemReady && (
            <div style={{ position: 'absolute', zIndex: 10, textAlign: 'center' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: `4px solid ${currentColors.accentBg}`, borderTop: `4px solid ${currentColors.accent}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }} />
              <p style={{ fontSize: '11px', fontWeight: '800', color: currentColors.subtext, letterSpacing: '1px' }}>BOOTING LAB...</p>
            </div>
          )}
          <div style={{ width: '100%', height: '100%', maxWidth: '960px', maxHeight: '640px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', opacity: isSystemReady ? 1 : 0.4, transition: 'opacity 0.5s' }}>
            <TerminalWindow terminalRef={terminalRef} isRunning={true} />
          </div>
        </div>
      </main>

      <style>{`
        .cursor-blink { display: inline-block; animation: blink-animation 1s steps(2, start) infinite; }
        @keyframes blink-animation { to { visibility: hidden; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;
