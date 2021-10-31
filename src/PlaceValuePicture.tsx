import * as React from "react";
import { BrickProps } from "./Brick";

export interface PlaceValueProps {
  value: number;
  previewAdd?: number;
  onBeginDragGroup?: () => void;
  onBeginDragItem?: () => void;
  onEndDrag?: () => void;
}

export function placeValuePictureFactory(
  outerClass: string,
  groupLayoutClass: string,
  groupContainerClass: string,
  ItemComponent: React.FunctionComponent<BrickProps>
) {
  const PlaceValuePicture: React.FunctionComponent<PlaceValueProps> = ({
    value,
    previewAdd = 0,
    onBeginDragGroup,
    onBeginDragItem,
    onEndDrag
  }) => {
    const [isDraggingGroup, setIsDraggingGroup] = React.useState(false);

    const handleDragStart = React.useCallback(
      (ev: React.DragEvent<HTMLDivElement>) => {
        onBeginDragGroup?.();
        requestAnimationFrame(() => setIsDraggingGroup(true));
        ev.stopPropagation();
      },
      [onBeginDragGroup]
    );

    const handleDragEnd = React.useCallback(() => {
      setIsDraggingGroup(false);
      onEndDrag?.();
    }, [onEndDrag]);

    const isGroupComplete = value >= 10;
    return (
      <div className={outerClass}>
        <div
          className={`${groupLayoutClass} ${groupContainerClass}${
            isGroupComplete ? " Complete" : ""
          }`}
          style={{ visibility: isDraggingGroup ? "hidden" : undefined }}
          draggable={isGroupComplete}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {Array.from({ length: 10 })
            .map((_, i) => i + 1)
            .map((i) => (
              <ItemComponent
                key={i}
                hide={i > value + previewAdd}
                ghost={i > value && i <= value + previewAdd}
                onBeginDrag={onBeginDragItem}
                onEndDrag={onEndDrag}
              />
            ))}
        </div>
        <div className={`${groupLayoutClass} ${groupContainerClass}`}>
          {Array.from({ length: 10 })
            .map((_, i) => i + 11)
            .map((i) => (
              <ItemComponent
                key={i}
                hide={i > value + previewAdd}
                ghost={i > value && i <= value + previewAdd}
                onBeginDrag={onBeginDragItem}
                onEndDrag={onEndDrag}
              />
            ))}
        </div>
      </div>
    );
  };

  return PlaceValuePicture;
}
