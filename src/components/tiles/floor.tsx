import Image from 'next/image';
import { ReactElement } from 'react';

export const Floor: React.FC<{ children?: ReactElement }> = ({ children }) => {
  return (
    <div className="w-10 h-10 bg-gray-400">
      <Image src="/images/floors/tile.png" alt="Floor" width={40} height={40} />
    </div>
  );
};
