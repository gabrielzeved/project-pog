declare global {
  interface Math extends Math {
    radians: (degrees: number) => number;
    degrees: (radians: number) => number;
    lerp: (start: number, end: number, amt: number) => number;
    clamp: (value: number, min: number, max: number) => number;
  }
}

export {};
