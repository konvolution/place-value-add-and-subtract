export interface Rect {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface Point {
  readonly left: number;
  readonly top: number;
}

export function pointWithinRect(point: Point, rect: Rect): boolean {
  return (
    point.left >= rect.left &&
    point.left < rect.left + rect.width &&
    point.top >= rect.top &&
    point.top < rect.top + rect.height
  );
}

export interface Surface {
  getBoundingRect(): Rect;
  enter(): void;
  exit(): void;
}

/** An object to which surfaces can be added. Surfaces receive notification
 * when a pointer enter/exits its bounding rectangle.
 */
export interface PointerEnterExitTracker {
  addSurface(surface: Surface): void;
  removeSurface(surface: Surface): void;
}

/** A receiver of pointer position update notifications */
export interface PointerPositionSync {
  updatePointerPosition(position: Point): void;
}

export class SimplePointerEnterExitTracker
  implements PointerPositionSync, PointerEnterExitTracker {
  private readonly surfaces = new Set<Surface>();
  private surfaceOver: Surface | null = null;

  //#region PointerEnterExitTracker
  public addSurface(surface: Surface) {
    this.surfaces.add(surface);
  }

  public removeSurface(surface: Surface) {
    if (this.surfaceOver === surface) {
      this.surfaceOver = null;
    }
    this.surfaces.delete(surface);
  }
  //#endregion PointerEnterExitTracker

  //#region PointerPositionSync
  public updatePointerPosition(position: Point) {
    if (this.surfaceOver) {
      // Is pointer still over surface?
      if (pointWithinRect(position, this.surfaceOver.getBoundingRect())) {
        return;
      }

      // Point moved outside of surface
      this.surfaceOver.exit();
      this.surfaceOver = null;
    }

    // Check if pointer has entered a new surface
    for (const surface of this.surfaces) {
      if (pointWithinRect(position, surface.getBoundingRect())) {
        this.surfaceOver = surface;
        surface.enter();
        return;
      }
    }
  }
  //#endregion PointerPositionSync
}
