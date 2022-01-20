/**
 * DragDropController class. Manages the lifecycle of drag/drop.
 *
 * Participants:
 *
 * 1. Draggable object - signals when it receives a pointer-down event
 * 2. Drop target - signals when a pointer enters/leaves its area
 */

/** Two-dimensional displacement */
export interface Offset {
  readonly dx: number;
  readonly dy: number;
}

/** Two-dimensional position */
export interface Position {
  readonly left: number;
  readonly top: number;
}

/**
 * The DragDropController uses this interface to tell the draggable
 * object when to begin/end drag, and how to displace the object as
 * the user moves the pointer
 */
export interface Draggable {
  beginDrag(): void;
  endDrag(): void;
  updateDrag(offset: Offset): void;
}

export interface DropTarget {
  activateDrop(): void;
  deactivateDrop(): void;
  performDrop(): void;
}

/**
 * A drop target signals to the drop controller when a pointer
 * enters/leaves it
 */
export interface DropController {
  enterDrop(me: DropTarget): void;
  leaveDrop(me: DropTarget): void;
}

/**
 * A draggable object signals to the DragController when it
 * receives a pointer down event. The DragDropController will
 * notify the Draggable object when to begin/end drag, and how
 * to displace the object
 */
export interface DragController {
  dragMe(me: Draggable): void;
}

/**
 * Top level control signals pointer events. The DragDropController
 * uses this information to determine the lifecycle of a drag-and-drop
 * operation.
 */
export interface PointerTracker {
  pointerDown(position: Position): void;
  pointerMove(position: Position): void;
  pointerUp(): void;
}

/**
 * Controller for Drag/Drop handling
 */
export class DragDropController
  implements DragController, DropController, PointerTracker {
  private currentDraggable: Draggable | null = null;
  private currentDropTarget: DropTarget | null = null;
  private dragStartLocation: Position | null = null;

  //#region DragController
  public dragMe(me: Draggable) {
    if (this.currentDraggable === null) {
      this.currentDraggable = me;
      me.beginDrag();
    }
  }
  //#endregion DragController

  //#region DropController
  public enterDrop(me: DropTarget) {
    if (this.currentDraggable !== null && this.currentDropTarget === null) {
      this.currentDropTarget = me;
      me.activateDrop();
    }
  }

  public leaveDrop(me: DropTarget) {
    if (this.currentDropTarget === me) {
      me.deactivateDrop();
      this.currentDropTarget = null;
    }
  }
  //#endregion DropController

  //#region PointerTracker
  public pointerDown(position: Position) {
    this.dragStartLocation = position;
  }

  public pointerMove(position: Position) {
    if (this.dragStartLocation && this.currentDraggable) {
      this.currentDraggable.updateDrag({
        dx: position.left - this.dragStartLocation.left,
        dy: position.top - this.dragStartLocation.top
      });
    }
  }

  public pointerUp() {
    console.assert(this.dragStartLocation !== null);

    if (this.currentDropTarget !== null) {
      this.currentDropTarget.performDrop();

      this.currentDropTarget = null;
    }

    if (this.currentDraggable !== null) {
      this.currentDraggable.endDrag();
      this.currentDraggable = null;
    }
  }
  //#endregion PointerTracker
}
