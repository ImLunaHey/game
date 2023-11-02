import { TileType, Item, itemComponents } from '../store';
import { SingleTile } from './single-tile';

export const TileRow: React.FC<{
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
