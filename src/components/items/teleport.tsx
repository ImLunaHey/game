import Image from 'next/image';
import { ReactElement } from 'react';

export const Teleport: React.FC<{ children?: ReactElement }> = ({ children }) => {
  return (
    <div className="w-10 h-10">
      <Image src="/images/items/portal.png" alt="Floor" width={40} height={40} />
    </div>
  );
};
