import { PropsWithChildren } from 'react';

export const Wall: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="w-10 h-10 bg-gray-700">{children}</div>;
};
