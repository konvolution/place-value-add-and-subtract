import * as React from "react";

import { PointerEnterExitTrackerContext } from "../pointerEnterExitTrackerContext";

export interface UsePointerEnterExitTrackerResult<T = Element> {
  onPointerDown: React.PointerEventHandler<T>;
  onPointerUp: React.PointerEventHandler<T>;
  onPointerMove: React.PointerEventHandler<T>;
}

export function usePointerEnterExitTracker<
  T = Element
>(): UsePointerEnterExitTrackerResult<T> {
  const pointerEnterExitTracker = React.useContext(
    PointerEnterExitTrackerContext
  );

  const onPointerUpdate: React.PointerEventHandler<T> = (evt) => {
    if (evt.isPrimary) {
      pointerEnterExitTracker.updatePointerPosition({
        left: evt.clientX,
        top: evt.clientY
      });
    }
  };

  return {
    onPointerDown: onPointerUpdate,
    onPointerMove: onPointerUpdate,
    onPointerUp: () =>
      pointerEnterExitTracker.updatePointerPosition({ left: -1, top: -1 })
  };
}
