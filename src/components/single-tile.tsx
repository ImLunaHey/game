import { TileType, tileComponents } from '../store';

export const SingleTile: React.FC<{
  type: TileType;
  x: number;
  y: number;
}> = ({ type }) => tileComponents[type]({});
