import "./styles.css";
import * as React from "react";

export interface BrickProps {
  hide?: boolean;
  ghost?: boolean;
  onBeginDrag?: () => void;
  onEndDrag?: () => void;
}

export function brickFactory(brickClass: string) {
  function Brick({
    hide = false,
    ghost = false,
    onBeginDrag,
    onEndDrag
  }: BrickProps) {
    const [isDragging, setIsDragging] = React.useState(false);

    const handleDragStart = React.useCallback(
      (ev: React.DragEvent<HTMLDivElement>) => {
        onBeginDrag?.();
        requestAnimationFrame(() => setIsDragging(true));
        ev.stopPropagation();
      },
      [onBeginDrag]
    );

    const handleDragEnd = React.useCallback(() => {
      setIsDragging(false);
      onEndDrag?.();
    }, [onEndDrag]);

    return (
      <div
        className={`${brickClass} ${hide ? "Hide" : ghost ? "Ghost" : " "}`}
        style={{ visibility: isDragging ? "hidden" : undefined }}
        draggable={!hide && !ghost}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    );
  }

  Brick.displayName = brickClass;
  return Brick;
}
