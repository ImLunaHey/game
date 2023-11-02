import { ReactElement, useEffect, useState } from 'react';
import { useGlitch } from 'react-powerglitch';

let isPreloaded = false;
export const AssetLoader: React.FC<{
  assets: string[];
  children: ReactElement;
}> = ({ assets, children }) => {
  const [progress, setProgress] = useState(0);
  const [lastLoadedImage, setLastLoadedImage] = useState<string | null>(null);
  const glitch = useGlitch();

  useEffect(() => {
    if (isPreloaded) return;
    isPreloaded = true;
    const promises = assets.map((src, index) => {
      const newProgress = 100 / assets.length;
      return new Promise<void>((resolve) => {
        const image = new window.Image();
        image.src = src;
        image.onload = () => {
          setTimeout(() => {
            setLastLoadedImage(src);
            console.log('Loaded', src);
            setProgress((progress) => progress + newProgress);
            resolve();
          }, index * 250);
        };
      });
    });

    Promise.all(promises).then(() => {
      console.log('All assets loaded');
    });
  }, [assets]);

  if (progress < 100) {
    return (
      <div>
        <div ref={glitch.ref} className="h-screen w-screen flex items-center justify-center flex-col">
          <div className="relative h-2 w-64 bg-gray-200 rounded overflow-hidden">
            <div
              className="absolute h-2 bg-green-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
          <div className="text-sm">{lastLoadedImage}</div>
        </div>
      </div>
    );
  }

  return children;
};
