import { useState } from 'react';
import { scenes } from '../store';
import { Player } from './player';
import { TileRow } from './tile-row';

export const Game = () => {
  const [scene, setScene] = useState(scenes[0]);
  return (
    <>
      <Player scene={scene} setScene={setScene} />
      {scene.map.map((row, x) => (
        <TileRow items={scene.items ?? []} map={row} key={`tile_row_${x}`} x={x} />
      ))}
    </>
  );
};
