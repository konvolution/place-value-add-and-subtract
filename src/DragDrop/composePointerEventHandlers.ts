import { PointerEvents, PointerEventKeys } from "./pointerEventTypes";

export function composePointerEventHandlers<T = Element>(
  handlers1: Partial<PointerEvents<T>>,
  handlers2: Partial<PointerEvents<T>>
): Partial<PointerEvents<T>> {
  const pointerEventHandlers: Partial<PointerEvents<T>> = {
    ...handlers1,
    ...handlers2
  };

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
    const evtHandler1 = handlers1[prop];
    const evtHandler2 = handlers2[prop];

    if (evtHandler1 && evtHandler2) {
      pointerEventHandlers[prop] = (evt) => {
        evtHandler1(evt);
        evtHandler2(evt);
      };
    }
  });

  return pointerEventHandlers;
}
