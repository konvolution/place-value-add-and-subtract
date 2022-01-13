import { useContext } from "react";
import { PointerTracker } from "../dragDropController";
import { DragDropControllerContext } from "../dragDropControllerContext";

export interface UsePointerTrackerResult<T = Element> {
  onPointerDown: React.PointerEventHandler<T>;
  onPointerMove: React.PointerEventHandler<T>;
  onPointerUp: React.PointerEventHandler<T>;
}

export function usePointerTracker<T = Element>(): UsePointerTrackerResult<T> {
  // PointerTracker from context
  const pointerTracker: PointerTracker = useContext(DragDropControllerContext);

  return {
    onPointerDown: (evt) => {
      if (evt.isPrimary) {
        pointerTracker.pointerDown({ left: evt.clientX, top: evt.clientY });
      }
    },

    onPointerMove: (evt) => {
      if (evt.isPrimary) {
        pointerTracker.pointerMove({ left: evt.clientX, top: evt.clientY });
      }
    },
    onPointerUp: (evt) => {
      if (evt.isPrimary) {
        pointerTracker.pointerUp();
      }
    }
  };
}
