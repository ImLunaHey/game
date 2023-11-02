import { ReactElement, useEffect, useState } from 'react';

let isPreloaded = false;
export const AssetLoader: React.FC<{
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
