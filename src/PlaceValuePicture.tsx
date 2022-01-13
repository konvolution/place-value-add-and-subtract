import * as React from "react";
import { BrickProps } from "./Brick";
import { Gripper } from "./Gripper";

import { useDraggable } from "./DragDrop/hooks/useDraggable";

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
    const isGroupComplete = value >= 10;

    const { dragStyle, dragEvents } = useDraggable({
      canDrag: isGroupComplete,
      onBeginDrag: onBeginDragGroup,
      onEndDrag
    });

    return (
      <div className={outerClass}>
        <div
          className={`${groupContainerClass}${
            isGroupComplete ? " Complete" : ""
          }`}
          style={dragStyle}
          {...dragEvents}
        >
          <div className={groupLayoutClass}>
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
          <Gripper enabled={isGroupComplete} />
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
