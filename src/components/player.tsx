import Image from 'next/image';
import { forwardRef, useState, useEffect } from 'react';
import { cn } from '../app/cn';
import { Scene, scenes } from '../store';

export const Player = forwardRef<
  HTMLDivElement,
  {
    scene: Scene;
    setScene: (scene: Scene) => void;
  }
>(({ scene: scene, setScene: setScene }, ref) => {
  // Lock player movement
  const [isPlayerLocked, lockPlayer] = useState(false);

  // Record which way the player is facing
  const [playerDirection, setPlayerDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');

  // Record which character the player is using
  const character = 'bob';

  // Allow ASWD and arrow keys to move player
  const [x, setX] = useState(1);
  const [y, setY] = useState(3);

  console.log('Player is at', x, y);
  console.log('-------------------');

  const move = (x: number, y: number) => {
    const tileX = Math.ceil(x);
    const tileY = Math.ceil(y);

    // Get the tile this player will be overlapping when they move
    const tile = scene.map?.[tileY]?.[tileX];

    console.log('-------------------');
    console.log('Moving to', x, y);
    console.log('Finding tile at', tileX, tileY, tile);
    console.log('Scene', scene);

    // Check the scene to see if the player can move to the new position
    if (tile === 'wall') {
      console.log('Cannot move to', x, y);
      console.log('-------------------');
      return;
    } else {
      console.log('Can move to', x, y);
    }

    // Check if there is an item at the new position
    const item = scene.items?.find((item) => item.position[0] === tileX && item.position[1] === tileY);

    if (item?.type === 'teleport') {
      console.log('Teleporting player to', x, y);
      setX(x);
      setY(y);
      lockPlayer(true);
      setTimeout(() => {
        const newScene = scenes[scenes.indexOf(scene as any) + 1] ?? scenes[0];
        setScene(newScene);
        setX(newScene.spawn[0]);
        setY(newScene.spawn[1]);

        console.log('Player has been teleported to', 1, 1);
        lockPlayer(false);
      }, 1_000);
      return;
    }

    setX(x);
    setY(y);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    if (isPlayerLocked) return;
    if (event.key === 'ArrowUp' || event.key === 'w') {
      setPlayerDirection('up');
      move(x, y - 1);
    }
    if (event.key === 'ArrowDown' || event.key === 's') {
      setPlayerDirection('down');
      move(x, y + 1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'a') {
      setPlayerDirection('left');
      move(x - 1, y);
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
      setPlayerDirection('right');
      move(x + 1, y);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div
      ref={ref}
      className={cn('w-10 h-10 z-10 absolute transition')}
      style={{
        top: y * 40,
        left: x * 40,
        transition: 'all 0.5s ease-in-out', // Add transition here
      }}
    >
      <div className="relative">
        <Image
          src={`/images/characters/${character}/${playerDirection}.png`}
          alt="Character"
          width={32}
          height={32}
          style={{
            top: -8,
            left: 0,
            height: 44,
          }}
          className="idle absolute"
        />
      </div>
    </div>
  );
});

Player.displayName = 'Player';
