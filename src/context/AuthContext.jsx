import { createContext, useContext, useMemo } from 'react';

const PROFILE_KEY = 'arrow-counter';
const PROFILE_ID = 'default-profile';
const AuthContext = createContext(null);

export function getStableObsHash(value) { let hash = 2166136261; for (const char of String(value)) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); } return (hash >>> 0).toString(36).toUpperCase().padStart(8, '0').slice(0, 8); }
function readProfile() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}; } catch { return {}; } }
function writeProfile(profile) { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }
export function getDefaultProfile() { const profile = readProfile(); return { id: PROFILE_ID, email: 'perfil-padrao', name: 'Perfil padrão', obsHash: profile.obsHash || getStableObsHash(PROFILE_ID), ...profile }; }
export function AuthProvider({ children }) { const user = useMemo(() => ({ id: PROFILE_ID, email: 'perfil-padrao', name: 'Perfil padrão' }), []); const value = useMemo(() => ({ user, logout: () => {} }), [user]); return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; }
export function useAuth() { return useContext(AuthContext); }
export function getUserRecord() { return getDefaultProfile(); }
export function saveUserRecord(record) { writeProfile({ ...getDefaultProfile(), ...record }); }
export function deleteUserRecord() { localStorage.removeItem(PROFILE_KEY); }
