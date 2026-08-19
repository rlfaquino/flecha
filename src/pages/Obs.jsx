import { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';

export default function Obs() {
  const { session } = useSession();
  const [count, setCount] = useState(Number(session.count) || 0);
  const params = new URLSearchParams(location.search);
  const profileSettings = session.settings || {};
  const color = params.get('color') || profileSettings.textColor || '#fbbf24';
  const background = params.get('bg') || 'transparent';
  const font = params.get('font') || 'system-ui';
  const size = Number(params.get('size')) || Number(profileSettings.fontSize) || 96;
  const label = params.get('label') || profileSettings.label || 'Disparos';
  const showLabel = params.get('showLabel') !== 'false' && profileSettings.showLabel !== false;
  const showTarget = params.has('showTarget') ? params.get('showTarget') !== 'false' : profileSettings.showTarget !== false;
  const targetCount = Number(params.get('target')) || Number(profileSettings.targetCount) || 0;

  useEffect(() => setCount(Number(session.count) || 0), [session.count]);
  useEffect(() => {
    const previousBackground = document.body.style.background;
    document.body.style.background = background;
    return () => { document.body.style.background = previousBackground; };
  }, [background]);

  return <main style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background, color, fontFamily: font, textAlign: 'center', fontWeight: 800, fontSize: `clamp(3rem, ${Math.max(8, size / 6)}vw, ${size}px)`, lineHeight: 1 }}>
    {showLabel && <small style={{ display: 'block', fontSize: '.25em' }}>{label}</small>}
    <span>{count}{showTarget && targetCount > 0 && <span>/{targetCount}</span>}</span>
  </main>;
}
