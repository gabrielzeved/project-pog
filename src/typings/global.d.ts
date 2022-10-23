declare global {
  export type Newable<T> = { new (...args: any[]): T };
}
export {};
