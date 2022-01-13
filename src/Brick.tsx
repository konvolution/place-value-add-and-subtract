import { useDraggable } from "./DragDrop/hooks/useDraggable";

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
    const { dragStyle, dragEvents } = useDraggable({
      canDrag: !hide && !ghost,
      onBeginDrag,
      onEndDrag
    });

    return (
      <div
        className={`${brickClass} ${hide ? "Hide" : ghost ? "Ghost" : " "}`}
        style={dragStyle}
        {...dragEvents}
      />
    );
  }

  Brick.displayName = brickClass;
  return Brick;
}
