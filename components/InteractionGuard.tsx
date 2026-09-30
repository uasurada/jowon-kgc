'use client';

import { useEffect } from 'react';

export default function InteractionGuard() {
  useEffect(() => {
    const preventDefault = (event: Event) => event.preventDefault();

    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('dragstart', preventDefault);

    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('dragstart', preventDefault);
    };
  }, []);

  return null;
}
