import { Teleport } from './components/items/teleport';
import { Floor } from './components/tiles/floor';
import { Wall } from './components/tiles/wall';

export type TileType = keyof typeof tileComponents;
export type Item = keyof typeof itemComponents;
export type Scene = {
  map: TileType[][];
  items?: {
    type: Item;
    position: [number, number];
  }[];
  spawn: [number, number];
};

export const itemComponents = {
  teleport: Teleport,
} as const;

export const tileComponents = {
  wall: Wall,
  floor: Floor,
} as const;

export const scenes = [
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
