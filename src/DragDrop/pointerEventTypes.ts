export interface PointerEvents<T = Element> {
  onPointerDown: React.PointerEventHandler<T>;
  onPointerMove: React.PointerEventHandler<T>;
  onPointerUp: React.PointerEventHandler<T>;
  onPointerCancel: React.PointerEventHandler<T>;
  onPointerOver: React.PointerEventHandler<T>;
  onPointerOut: React.PointerEventHandler<T>;
  onPointerEnter: React.PointerEventHandler<T>;
  onPointerLeave: React.PointerEventHandler<T>;
}

export type PointerEventKeys = keyof PointerEvents;
