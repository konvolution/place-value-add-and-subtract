import * as React from "react";

import { Rect, Surface } from "../pointerEnterExitTracker";
import { DropController, DropTarget } from "../dragDropController";

import { DragDropControllerContext } from "../dragDropControllerContext";
import { PointerEnterExitTrackerContext } from "../pointerEnterExitTrackerContext";

export interface UseDropTargetParams<T> {
  refElement: React.RefObject<T>;
  canDrop: boolean;
  onDropTargetEnter: () => void;
  onDropTargetLeave: () => void;
  onDrop: () => void;
}

const emptyRect: Rect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
};

class DropTargetImpl<T extends Element> implements DropTarget, Surface {
  private params?: UseDropTargetParams<T>;
  private dropController?: DropController;

  public updateState(
    params: UseDropTargetParams<T>,
    dropController: DropController
  ) {
    this.params = params;
    this.dropController = dropController;
  }

  public activateDrop() {
    this.params?.onDropTargetEnter();
  }

  public deactivateDrop() {
    this.params?.onDropTargetLeave();
  }

  public performDrop() {
    this.params?.onDrop();
  }

  public getBoundingRect() {
    return (
      this.params?.refElement.current?.getBoundingClientRect() ?? emptyRect
    );
  }

  public enter() {
    this.dropController?.enterDrop(this);
  }

  public exit() {
    this.dropController?.leaveDrop(this);
  }
}

export function useDropTarget<T extends Element = Element>(
  params: UseDropTargetParams<T>
): void {
  // DropController from context
  const dropController: DropController = React.useContext(
    DragDropControllerContext
  );

  const pointerEnterExitTracker = React.useContext(
    PointerEnterExitTrackerContext
  );

  const instance = React.useMemo(() => new DropTargetImpl(), []);
  instance.updateState(params, dropController);

  React.useEffect(() => {
    if (params.canDrop && instance) {
      pointerEnterExitTracker.addSurface(instance);
      return () => pointerEnterExitTracker.removeSurface(instance);
    }
  }, [instance, pointerEnterExitTracker, params.canDrop]);
}
