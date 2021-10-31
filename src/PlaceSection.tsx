import * as React from "react";

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
  const refDiv = React.useRef<HTMLDivElement>(undefined);

  const handleDragOver = React.useCallback(
    (ev: React.DragEvent<HTMLDivElement>) => {
      if (!isValidDropTarget) {
        ev.dataTransfer.dropEffect = "none";
      } else {
        ev.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
        if (!isDragOver) {
          onDragEnter?.();
        }
      }

      ev.preventDefault();
    },
    [isValidDropTarget, isDragOver, onDragEnter]
  );

  const handleDragLeave = React.useCallback(
    (ev: React.DragEvent<HTMLDivElement>) => {
      if (ev.target === refDiv.current && isValidDropTarget) {
        setIsDragOver(false);
        onDragLeave?.();
      }
    },
    [isValidDropTarget, onDragLeave]
  );

  const handleDragDrop = React.useCallback(() => {
    if (isValidDropTarget) {
      setIsDragOver(false);
      onDragDrop?.();
    }
  }, [isValidDropTarget, onDragDrop]);

  return (
    <div
      ref={refDiv}
      className="Section"
      style={{ borderColor: isDragOver ? "black" : undefined }}
      onDragOver={handleDragOver}
      onDrop={handleDragDrop}
      onDragLeave={handleDragLeave}
    >
      {children}
    </div>
  );
};
