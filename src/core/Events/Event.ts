export enum EventType {
  KEYBOARD_EVENT,
  MOUSE_EVENT,
  WINDOW_EVENT,
}

export interface XEvent {
  type: EventType;
  payload: unknown;
}
