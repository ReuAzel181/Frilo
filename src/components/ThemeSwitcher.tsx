'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitcher() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { theme, toggleTheme } = authContext;

  return (
    <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-800 text-white">
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}