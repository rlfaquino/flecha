import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const defaults = { count: 0, obsHash: 'DEFAULT1', settings: { sensitivity: 50, cooldown: 1000, label: 'Disparos', showLabel: true, showTarget: true, targetCount: 30, textColor: '#fbbf24', backgroundColor: '#000000', transparentBackground: true, fontFamily: 'system-ui', fontSize: 96 } };
const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(defaults);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    let socket;
    fetch('/api/session').then((response) => response.json()).then((value) => setSession(value)).catch(() => {});
    try {
      socket = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`);
      socket.onopen = () => setConnected(true);
      socket.onclose = () => setConnected(false);
      socket.onmessage = (event) => { const message = JSON.parse(event.data); if (message.type === 'state') setSession(message.state); };
    } catch { setConnected(false); }
    return () => socket?.close();
  }, []);
  const updateSession = (patch) => { const next = { ...session, ...patch, settings: { ...session.settings, ...(patch.settings || {}) } }; setSession(next); fetch('/api/session', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) }).catch(() => {}); };
  const incrementCount = async () => { try { const response = await fetch('/api/session/increment', { method: 'POST' }); if (!response.ok) throw new Error('increment failed'); const next = await response.json(); setSession(next); } catch { updateSession({ count: (Number(session.count) || 0) + 1 }); } };
  const value = useMemo(() => ({ session, updateSession, incrementCount, connected }), [session, connected]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
export function useSession() { return useContext(SessionContext); }
