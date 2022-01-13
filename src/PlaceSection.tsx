import * as React from "react";
import { useDropTarget } from "./DragDrop/hooks/useDropTarget";

import "./styles.css";

export interface PlaceSectionProps {
  isValidDropTarget?: boolean;
  onDragEnter?: () => void;
  onDragDrop?: () => void;
  onDragLeave?: () => void;
  children: React.ReactNode;
}

export const PlaceSection: React.FunctionComponent<PlaceSectionProps> = ({
  isValidDropTarget = false,
  onDragEnter,
  onDragDrop,
  onDragLeave,
  children
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = React.useCallback(() => {
    setIsDragOver(true);
    onDragEnter?.();
  }, [onDragEnter]);

  const handleDragLeave = React.useCallback(() => {
    setIsDragOver(false);
    onDragLeave?.();
  }, [onDragLeave]);

  const handleDrop = React.useCallback(() => {
    setIsDragOver(false);
    onDragDrop?.();
  }, [onDragDrop]);

  const refElement = React.useRef<HTMLDivElement>(null);

  const dropTargetEvents = useDropTarget({
    refElement,
    canDrop: isValidDropTarget,
    onDropTargetEnter: handleDragOver,
    onDropTargetLeave: handleDragLeave,
    onDrop: handleDrop
  });

  return (
    <div
      ref={refElement}
      className="Section"
      style={{ borderColor: isDragOver ? "black" : undefined }}
      {...dropTargetEvents}
    >
      {children}
    </div>
  );
};
