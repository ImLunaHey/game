import Image from 'next/image';
import { useState } from 'react';
import { cn } from '../app/cn';
import { Scene, scenes } from '../store';
import { useControls } from '../hooks/use-controls';
import { playerStore } from '../stores/player-store';
import { observer } from 'mobx-react-lite';

const makeMove = (scene: Scene, setScene: (scene: Scene) => void) => (x: number, y: number) => {
  const tileX = Math.ceil(x);
  const tileY = Math.ceil(y);

  // Get the tile this player will be overlapping when they move
  const tile = scene.map?.[tileY]?.[tileX];

  console.log('-------------------');
  console.log('Moving to', x, y);
  console.log('Finding tile at', tileX, tileY, tile);

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
    playerStore.x = x;
    playerStore.y = y;
    playerStore.lockPlayer();
    setTimeout(() => {
      const newScene = scenes[scenes.indexOf(scene as any) + 1] ?? scenes[0];
      setScene(newScene);
      playerStore.x = newScene.spawn[0];
      playerStore.y = newScene.spawn[1];

      console.log('Player has been teleported to', 1, 1);
      playerStore.unlockPlayer();
    }, 1_000);
    return;
  }

  playerStore.x = x;
  playerStore.y = y;
};

const _Player: React.FC<{
  scene: Scene;
  setScene: (scene: Scene) => void;
}> = ({ scene: scene, setScene: setScene }) => {
  // Record which way the player is facing
  const [playerDirection, setPlayerDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');

  // Record which character the player is using
  const character = 'bob';

  // Get player position
  const { x, y, hasSpawned } = playerStore;

  // Set player position to spawn if they haven't spawned yet
  if (!hasSpawned) {
    playerStore.x = scene.spawn[0];
    playerStore.y = scene.spawn[1];
  }

  console.log('Player is at', x, y);
  console.log('-------------------');

  // Create a function to move the player
  const move = makeMove(scene, setScene);

  // Handle player movement
  useControls({
    up() {
      setPlayerDirection('up');
      move(x, y - 1);
    },
    down() {
      setPlayerDirection('down');
      move(x, y + 1);
    },
    left() {
      setPlayerDirection('left');
      move(x - 1, y);
    },
    right() {
      setPlayerDirection('right');
      move(x + 1, y);
    },
  });

  return (
    <div
      ref={playerStore.getRef()}
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
          width={44}
          height={44}
          style={{
            top: -8,
            left: 0,
            height: 44,
            width: 44,
          }}
          className="idle absolute"
        />
      </div>
    </div>
  );
};

export const Player = observer(_Player);
