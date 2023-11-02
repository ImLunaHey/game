import { useEffect } from 'react';
import { playerStore } from '../stores/player-store';

type Options = {
  up: () => void;
  down: () => void;
  left: () => void;
  right: () => void;
};

export const useControls = (options: Options) => {
  const onKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    if (playerStore.isPlayerLocked) {
      return;
    }
    if (event.key === 'ArrowUp' || event.key === 'w') {
      options.up();
    }
    if (event.key === 'ArrowDown' || event.key === 's') {
      options.down();
    }
    if (event.key === 'ArrowLeft' || event.key === 'a') {
      options.left();
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
      options.right();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });
};
