import { useEffect, useState } from 'react';

function getDeviceProfile() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const shortestSide = Math.min(width, height);
  const longestSide = Math.max(width, height);
  const ratio = shortestSide / longestSide;
  const touch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  const userAgent = navigator.userAgent.toLowerCase();
  const wearOs = /wear os|wearos|samsungbrowser.*watch|sm-r\d+/.test(userAgent);
  const round = window.matchMedia?.('(shape: round)').matches || (ratio >= 0.82 && ratio <= 1.18 && shortestSide <= 500);
  const watch = wearOs || (touch && shortestSide <= 500 && ratio >= 0.78);
  const phone = !watch && touch && shortestSide <= 600;
  const tablet = !watch && touch && shortestSide > 600 && shortestSide <= 1200;
  const type = watch ? 'watch' : phone ? 'phone' : tablet ? 'tablet' : 'desktop';

  return {
    type,
    isWatch: watch,
    isRound: round,
    isTouch: touch,
    isWearOS: wearOs,
    width,
    height,
    orientation: width >= height ? 'landscape' : 'portrait',
  };
}

export function useDeviceProfile() {
  const [profile, setProfile] = useState(getDeviceProfile);

  useEffect(() => {
    const update = () => setProfile(getDeviceProfile());
    const orientation = screen.orientation;
    window.addEventListener('resize', update, { passive: true });
    orientation?.addEventListener('change', update);
    return () => {
      window.removeEventListener('resize', update);
      orientation?.removeEventListener('change', update);
    };
  }, []);

  return profile;
}

export function DeviceProfile() {
  const profile = useDeviceProfile();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.device = profile.type;
    root.dataset.shape = profile.isRound ? 'round' : 'rectangular';
    root.dataset.orientation = profile.orientation;
    root.dataset.touch = String(profile.isTouch);
    root.dataset.wearOs = String(profile.isWearOS);
    return () => {
      delete root.dataset.device;
      delete root.dataset.shape;
      delete root.dataset.orientation;
      delete root.dataset.touch;
      delete root.dataset.wearOs;
    };
  }, [profile]);

  return null;
}
