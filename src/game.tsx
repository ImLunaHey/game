'use client';
import { useLocalStorage } from '@uidotdev/usehooks';
import Image from 'next/image';
import { MutableRefObject, PropsWithChildren, ReactElement, forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from './app/cn';
import dynamic from 'next/dynamic';

type TileType = keyof typeof tileComponents;
type Item = keyof typeof itemComponents;
type Scene = {
  map: TileType[][];
  items?: {
    type: Item;
    position: [number, number];
  }[];
  spawn: [number, number];
};

const StartButton: React.FC<{
  joinGame: (name: string) => void;
}> = ({ joinGame }) => {
  const [name, setName] = useState('');
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        joinGame(name);
      }}
    >
      <input
        className="p-1 rounded text-black placeholder-gray-700"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      {name && name.length > 2 && (
        <button
          className="text-white font-bold py-1 px-2 rounded ml-2"
          type="submit"
          onClick={() => {
            joinGame(name);
          }}
        >
          Join
        </button>
      )}
    </form>
  );
};

const Wall: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="w-10 h-10 bg-gray-700">{children}</div>;
};

const Floor: React.FC<{ children?: ReactElement }> = ({ children }) => {
  return (
    <div className="w-10 h-10 bg-gray-400">
      <Image src="/images/floors/tile.png" alt="Floor" width={40} height={40} />
    </div>
  );
};

const Teleport: React.FC<{ children?: ReactElement }> = ({ children }) => {
  return (
    <div className="w-10 h-10">
      <Image src="/images/items/portal.png" alt="Floor" width={40} height={40} />
    </div>
  );
};

const itemComponents = {
  teleport: Teleport,
} as const;

const tileComponents = {
  wall: Wall,
  floor: Floor,
} as const;

const SingleTile: React.FC<{
  type: TileType;
  x: number;
  y: number;
}> = ({ type }) => tileComponents[type]({});

const TileRow: React.FC<{
  map: TileType[];
  items: {
    type: Item;
    position: [number, number];
  }[];
  x: number;
}> = ({ map, items, x }) => {
  return (
    <div className="flex w-fit">
      {map.map((tile, y) => {
        const item = items.find((item) => item.position[0] === x && item.position[1] === y);
        const Item = item && itemComponents[item?.type];
        return (
          <div key={`tile_row_${x}_${y}`}>
            {Item && (
              <div
                className="absolute h-10 w-10"
                style={{
                  top: y * 40,
                  left: x * 40,
                }}
                key={`item_${x}-${y}`}
              >
                <Item />
              </div>
            )}
            <SingleTile key={`tile_${x}-${y}`} type={tile} x={x} y={y} />
          </div>
        );
      })}
    </div>
  );
};

const Player = forwardRef<
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

const scenes = [
  {
    spawn: [1, 1],
    items: [
      {
        type: 'teleport',
        position: [2, 2],
      },
    ],
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall'],
    ],
  },
  {
    spawn: [1, 1],
    items: [
      {
        type: 'teleport',
        position: [3, 1],
      },
    ],
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'floor', 'wall', 'floor', 'wall'],
      ['wall', 'floor', 'wall', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall'],
    ],
  },
  {
    spawn: [2, 2],
    items: [
      {
        type: 'teleport',
        position: [4, 2],
      },
    ],
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor'],
      ['wall', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall'],
    ],
  },
  {
    spawn: [5, 5],
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
  },
  {
    spawn: [1, 1],
    map: [
      Array.from({ length: 50 }, () => 'wall'),
      ['wall', ...Array.from({ length: 48 }, () => 'floor' as const), 'wall'],
      Array.from({ length: 50 }, () => 'wall'),
    ],
  },
] satisfies Scene[];

const Camera = forwardRef<
  HTMLDivElement,
  {
    children: ReactElement;
  }
>(({ children }, ref) => {
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = (ref as MutableRefObject<HTMLDivElement | null>)?.current;

    if (!element) {
      return;
    }

    const updatePosition = () => {
      const left = Number(element.style.left.split('px')[0]);
      const top = Number(element.style.top.split('px')[0]);
      const direction = element.querySelector('img')?.src.split('/').pop()?.split('.')[0].split('%2F').pop();

      let newCameraX = cameraPosition.x;
      let newCameraY = cameraPosition.y;

      const cameraBox = 500; // Camera dimensions
      const playerBox = 40; // Player dimensions

      // Player is moving to the left
      if (direction === 'left' && left < 0) {
        newCameraX = cameraPosition.x - left;
      }

      // Player is moving up
      if (direction === 'up' && top < 0) {
        newCameraY = cameraPosition.y - top;
      }

      // Player is moving to the right
      if (direction === 'right' && left > cameraBox - playerBox) {
        newCameraX = cameraPosition.x - (left - cameraBox + playerBox);
      }

      // Player is moving down
      if (direction === 'down' && top > cameraBox - playerBox) {
        newCameraY = cameraPosition.y - (top - cameraBox + playerBox);
      }

      // Update camera position if needed
      if (newCameraX !== cameraPosition.x || newCameraY !== cameraPosition.y) {
        setCameraPosition({ x: newCameraX, y: newCameraY });
      }
    };

    updatePosition();

    const resizeObserver = new ResizeObserver(updatePosition);
    const mutationObserver = new MutationObserver(updatePosition);

    resizeObserver.observe(element);
    mutationObserver.observe(element, { attributes: true, childList: true, subtree: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return (
    <div className="absolute overflow-hidden border max-w-[500px] max-h-[500px] h-fit w-fit">
      <div
        className="relative"
        style={{
          top: cameraPosition.y,
          left: cameraPosition.x,
        }}
      >
        {children}
      </div>
    </div>
  );
});

Camera.displayName = 'Camera';

const Game = forwardRef<HTMLDivElement>((_props, ref) => {
  const [scene, setScene] = useState(scenes[0]);
  return (
    <>
      <Player ref={ref} scene={scene} setScene={setScene} />
      {scene.map.map((row, x) => (
        <TileRow items={scene.items ?? []} map={row} key={`tile_row_${x}`} x={x} />
      ))}
    </>
  );
});

Game.displayName = 'Game';

const assetsToPreload = [
  '/images/characters/bob/down.png',
  '/images/characters/bob/up.png',
  '/images/characters/bob/left.png',
  '/images/characters/bob/right.png',
  '/images/floors/tile.png',
  '/images/items/portal.png',
];

let isPreloaded = false;
const AssetLoader: React.FC<{
  assets: string[];
  children: ReactElement;
}> = ({ assets, children }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPreloaded) return;
    isPreloaded = true;
    const promises = assets.map((src, index) => {
      return new Promise<void>((resolve) => {
        const image = new window.Image();
        image.src = src;
        image.onload = () => {
          setTimeout(() => {
            console.log('Loaded', src);
            setProgress((progress) => progress + 100 / assets.length);
            resolve();
          }, index * 200);
        };
      });
    });

    Promise.all(promises).then(() => {
      console.log('All assets loaded');
    });
  }, [assets]);

  if (progress < 100) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="relative h-2 w-64 bg-gray-200 rounded overflow-hidden">
          <div
            className="absolute h-2 bg-green-500"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>
      </div>
    );
  }

  return children;
};

const InnerShell = () => {
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
};

export const Shell = dynamic(() => Promise.resolve(InnerShell), {
  ssr: false,
});
