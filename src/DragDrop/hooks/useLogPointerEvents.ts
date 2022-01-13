import { PointerEvents, PointerEventKeys } from "../pointerEventTypes";

export function useLogPointerEvents<T = Element>(
  targetName: string,
  canDrag: boolean
): Partial<PointerEvents<T>> {
  const dragDropEvents: Partial<PointerEvents<T>> = {};
  ([
    "onPointerDown",
    "onPointerMove",
    "onPointerUp",
    "onPointerCancel",
    "onPointerOver",
    "onPointerOut",
    "onPointerEnter",
    "onPointerLeave"
  ] as PointerEventKeys[]).forEach((prop) => {
    dragDropEvents[prop] = (evt) => {
      console.log(`${targetName} - ${prop}`);
    };
  });

  return dragDropEvents;
}
