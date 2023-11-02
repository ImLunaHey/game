import { forwardRef, ReactElement, useState, useEffect, MutableRefObject } from 'react';

export const Camera = forwardRef<
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
