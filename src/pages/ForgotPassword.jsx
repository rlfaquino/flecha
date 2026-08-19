import { useState } from 'react';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { requestPasswordReset, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [developmentCode, setDevelopmentCode] = useState('');
  const submitRequest = async (event) => { event.preventDefault(); setError(''); setMessage(''); try { const result = await requestPasswordReset(email); setDevelopmentCode(result.developmentCode || ''); setMessage('Se o e-mail estiver cadastrado, enviamos um código de confirmação. O código expira em 15 minutos.'); setStep('confirm'); } catch (err) { setError(err.message); } };
  const submitReset = async (event) => { event.preventDefault(); setError(''); try { await resetPassword(email, code, password); navigate('/login', { replace: true }); } catch (err) { setError(err.message); } };
  return <main className="screen" style={{ display: 'grid', placeItems: 'center' }}><section className="watch-safe" style={card}><Link to="/login" style={back}><ArrowLeft size={20} /> Voltar</Link><h1><KeyRound size={24} /> Recuperar senha</h1>{step === 'request' ? <form onSubmit={submitRequest}><p>Informe o e-mail cadastrado para receber um código de confirmação.</p><label>E-mail<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><button type="submit" style={button}><Mail size={18} /> Enviar código</button></form> : <form onSubmit={submitReset}><p>{message}</p>{developmentCode && <p style={{ color: '#fbbf24' }}>Modo desenvolvimento — código: <strong>{developmentCode}</strong></p>}<label>Código de confirmação<input inputMode="numeric" pattern="[0-9]{6}" maxLength="6" required value={code} onChange={(e) => setCode(e.target.value)} /></label><label>Nova senha<input type="password" autoComplete="new-password" minLength="8" required value={password} onChange={(e) => setPassword(e.target.value)} /></label><button type="submit" style={button}>Redefinir senha</button></form>}{error && <p role="alert" style={{ color: '#f87171' }}>{error}</p>}</section></main>;
}
const card = { maxWidth: '26rem', padding: '2rem', border: '1px solid #3f3f46', borderRadius: '1.5rem', background: '#18181b', display: 'grid', gap: '1rem' }; const back = { color: '#fbbf24', display: 'flex', gap: '.4rem', alignItems: 'center' }; const button = { width: '100%', minHeight: '3.25rem', border: 0, borderRadius: '999px', background: '#f59e0b', fontWeight: 700, display: 'flex', gap: '.5rem', alignItems: 'center', justifyContent: 'center' };
