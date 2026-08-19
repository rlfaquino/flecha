import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SessionProvider } from './context/SessionContext';
import { DeviceProfile } from './hooks/useDeviceProfile';
import './index.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><AuthProvider><SessionProvider><DeviceProfile /><App /></SessionProvider></AuthProvider></BrowserRouter></React.StrictMode>);
