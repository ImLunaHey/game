'use client';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { Camera } from './components/camera';
import { AssetLoader } from './components/asset-loader';
import { StartButton } from './components/ui/start-button';
import { Game } from './components/game';

const assetsToPreload = [
  '/images/characters/bob/down.png',
  '/images/characters/bob/up.png',
  '/images/characters/bob/left.png',
  '/images/characters/bob/right.png',
  '/images/floors/tile.png',
  '/images/items/portal.png',
];

export const Shell = dynamic(
  () =>
    Promise.resolve(() => {
      'use client';

      const [session, setSession] = useLocalStorage<{
        name: string;
      } | null>('session', null);
      const joinGame = (name: string) => {
        console.log('Joining game as', name);

        // TODO: Connect to server and join game
        setSession({ name });
      };

      const playerRef = useRef<HTMLDivElement>(null);

      if (!session) return <StartButton joinGame={(name) => joinGame(name)} />;
      return (
        <AssetLoader assets={assetsToPreload}>
          <Camera ref={playerRef}>
            <Game ref={playerRef} />
          </Camera>
        </AssetLoader>
      );
    }),
  {
    ssr: false,
  },
);
