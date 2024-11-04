import { WalkNode } from '../node';
export declare function reduce<T>(source: object, initialValue: T, fn: (accumulator: T, node: WalkNode) => T): T;
