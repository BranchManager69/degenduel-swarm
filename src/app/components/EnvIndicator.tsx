'use client';

import { useEffect, useState } from 'react';
import { DEV_PORT, PROD_PORT } from '../lib/constants';

export function EnvIndicator() {
  const [env, setEnv] = useState<string>('');
  const [port, setPort] = useState<number | null>(null);
  
  useEffect(() => {
    // Determine environment
    const isDev = process.env.NODE_ENV === 'development';
    setEnv(isDev ? 'Development' : 'Production');
    
    // Determine port from window location
    if (typeof window !== 'undefined') {
      const windowPort = window.location.port ? parseInt(window.location.port) : null;
      setPort(windowPort);
    }
  }, []);

  if (!port) return null;

  const expectedPort = env === 'Development' ? DEV_PORT : PROD_PORT;
  const portMismatch = port !== expectedPort;

  return (
    <div className="fixed bottom-2 right-2 z-50 px-3 py-1 text-xs rounded-md bg-black/70 text-white">
      <div>Env: <span className={env === 'Development' ? 'text-blue-400' : 'text-green-400'}>{env}</span></div>
      <div>Port: <span className={portMismatch ? 'text-red-400' : 'text-white'}>{port}</span></div>
    </div>
  );
}