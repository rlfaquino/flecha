import { AnimatePresence, motion } from 'framer-motion';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Obs from './pages/Obs';

function AnimatedRoutes() {
  const location = useLocation();
  return <AnimatePresence mode="wait"><Routes location={location} key={location.pathname}>
    <Route path="/" element={<PageTransition><Home /></PageTransition>} />
    <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
    <Route path="/obs" element={<Obs />} />
    <Route path="/obs/:hash" element={<Obs />} />
    <Route path="*" element={<PageTransition><Home /></PageTransition>} />
  </Routes></AnimatePresence>;
}
function PageTransition({ children }) { return <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: .18 }}>{children}</motion.div>; }
export default function App() { return <AnimatedRoutes />; }
export function SettingsLink() { return <Link to="/settings" aria-label="Configurações"><SettingsIcon size={20} /></Link>; }
