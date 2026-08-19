import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Settings, RotateCcw, Play, Square } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export default function Home() {
  const { session, updateSession, incrementCount, connected } = useSession();
  const [detecting, setDetecting] = useState(false);
  const [motionStatus, setMotionStatus] = useState('Pronto para detectar');
  const lastShot = useRef(0);
  const latestCount = useRef(session.count || 0);
  const baseline = useRef(null);
  const count = session.count || 0;
  const settings = { sensitivity: 50, cooldown: 1000, ...(session.settings || {}) };
  const sensitivity = Math.min(200, Math.max(1, Number(settings.sensitivity) || 50));
  const changeCount = (nextCount) => { const value = Math.max(0, nextCount); latestCount.current = value; updateSession({ count: value }); };
  useEffect(() => { latestCount.current = count; }, [count]);
  const startDetection = async () => {
    try {
      const motionApi = window.DeviceMotionEvent;
      if (!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') throw new Error('https obrigatório');
      if (typeof motionApi?.requestPermission === 'function') { const permission = await motionApi.requestPermission(); if (permission !== 'granted') throw new Error('permissão negada'); }
      baseline.current = null;
      setMotionStatus('Aguardando movimentos...');
      setDetecting(true);
    } catch (error) { setMotionStatus(error.message === 'permissão negada' ? 'Permissão do acelerômetro negada' : error.message === 'https obrigatório' ? 'Abra este endereço usando HTTPS ou localhost' : 'Não foi possível ativar o acelerômetro'); setDetecting(false); }
  };
  useEffect(() => {
    if (!detecting) return;
    const onMotion = (event) => {
      const raw = event.acceleration || event.accelerationIncludingGravity;
      if (!raw) return;
      const vector = { x: raw.x || 0, y: raw.y || 0, z: raw.z || 0 };
      if (!event.acceleration && !baseline.current) { baseline.current = vector; return; }
      const reference = event.acceleration ? { x: 0, y: 0, z: 0 } : baseline.current;
      const movement = Math.hypot(vector.x - reference.x, vector.y - reference.y, vector.z - reference.z);
      const threshold = 8 + (sensitivity / 200) * 32;
      setMotionStatus(`Sensor ativo • movimento: ${movement.toFixed(1)} m/s² • limiar: ${threshold.toFixed(1)}`);
      if (movement > threshold && Date.now() - lastShot.current >= settings.cooldown) { lastShot.current = Date.now(); incrementCount(); navigator.vibrate?.(45); }
    };
    window.addEventListener('devicemotion', onMotion, { passive: true });
    const timer = window.setTimeout(() => setMotionStatus((status) => status === 'Aguardando movimentos...' ? 'Nenhum movimento recebido — verifique permissões e HTTPS' : status), 3000);
    return () => { window.removeEventListener('devicemotion', onMotion); window.clearTimeout(timer); };
  }, [detecting, incrementCount, sensitivity, settings.cooldown]);
  return <main className="screen"><div className="watch-safe" style={{ minHeight: 'calc(100dvh - 2rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><strong style={{ color: '#f59e0b', letterSpacing: '.12em' }}>ARROW COUNTER</strong><small style={{ display: 'block', color: connected ? '#86efac' : '#fbbf24', marginTop: '.25rem' }}>{connected ? 'Sessão sincronizada' : 'Conectando...'}</small></div><Link to="/settings" aria-label="Configurações" style={{ color: '#a1a1aa', padding: '.75rem' }}><Settings size={20} /></Link></header>
    <section style={{ textAlign: 'center' }}><p style={{ color: '#a1a1aa', margin: 0 }}>DISPAROS</p><div style={{ fontSize: 'clamp(6rem, 30vw, 11rem)', lineHeight: .95, fontWeight: 800, color: '#fbbf24' }}>{count}</div><div className="watch-compact" style={{ display: 'flex', justifyContent: 'center', gap: '.75rem', marginTop: '1rem' }}><button className="watch-button" onClick={() => changeCount(count - 1)} style={control}><Minus /></button><button className="watch-button" onClick={() => changeCount(count + 1)} style={control}><Plus /></button><button className="watch-button" onClick={() => changeCount(0)} style={control}><RotateCcw /></button></div></section>
    <section className="watch-compact" style={{ display: 'grid', gap: '.75rem' }}><button className="watch-button" onClick={() => detecting ? (setDetecting(false), setMotionStatus('Detecção pausada')) : startDetection()} style={{ ...primary, background: detecting ? '#3f3f46' : '#f59e0b', color: detecting ? '#f4f4f5' : '#18181b' }}>{detecting ? <><Square size={17} /> Parar detecção</> : <><Play size={17} /> Iniciar detecção</>}</button><small style={{ color: detecting ? '#86efac' : '#a1a1aa', textAlign: 'center' }}>{motionStatus}</small></section>
  </div></main>;
}
const control = { minWidth: '3rem', minHeight: '3rem', border: '1px solid #3f3f46', borderRadius: '999px', background: '#18181b', color: '#fbbf24', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
const primary = { border: 0, borderRadius: '999px', minHeight: '3.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', fontWeight: 700 };
