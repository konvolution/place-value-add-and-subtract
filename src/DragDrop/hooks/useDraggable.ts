import * as React from "react";
import { DragController, Draggable, Offset } from "../dragDropController";
import { DragDropControllerContext } from "../dragDropControllerContext";
export interface DragEvents<T = Element> {
  onPointerDown: React.PointerEventHandler<T>;
}

export interface UseDraggableResult<T = Element> {
  dragStyle: React.CSSProperties;
  dragEvents: DragEvents<T>;
}

export interface UseDraggableParams {
  canDrag: boolean;
  onBeginDrag?: () => void;
  onEndDrag?: () => void;
}

export function useDraggable<T = Element>(
  { canDrag, onBeginDrag, onEndDrag }: UseDraggableParams = { canDrag: true }
): UseDraggableResult<T> {
  // Drag controller from context
  const dragController: DragController = React.useContext(
    DragDropControllerContext
  );

  // Track drag state
  const [offset, setOffset] = React.useState<Offset | null>(null);

  const refDraggable = React.useRef<Draggable | null>(null);

  refDraggable.current = {
    beginDrag() {
      setOffset({ dx: 0, dy: 0 });
      onBeginDrag?.();
    },

    endDrag() {
      setOffset(null);
      onEndDrag?.();
    },

    updateDrag(offset: Offset) {
      setOffset(offset);
    }
  };

  // Draggable callback interface (pointer must be stable across re-renders)
  const draggableStableProxy: Draggable = React.useMemo(
    () => ({
      beginDrag() {
        refDraggable.current?.beginDrag();
      },
      endDrag() {
        refDraggable.current?.endDrag();
      },
      updateDrag(offset) {
        refDraggable.current?.updateDrag(offset);
      }
    }),
    []
  );

  const onPointerDown: React.PointerEventHandler<T> = (evt) => {
    if (evt.isPrimary && canDrag) {
      dragController.dragMe(draggableStableProxy);
      evt.preventDefault();
    }
  };

  const dragStyle: React.CSSProperties =
    offset === null
      ? {}
      : {
          opacity: 0.5,
          transform: `translate(${offset.dx}px,${offset.dy}px)`
        };

  return {
    dragStyle,
    dragEvents: {
      onPointerDown
    }
  };
}
