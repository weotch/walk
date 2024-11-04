import { AsyncCallbackFn, CallbackFn } from '../types';
export declare function apply(target: any, ...onVisit: CallbackFn[]): void;
export declare function applyAsync(target: any, ...onVisit: AsyncCallbackFn[]): Promise<void>;
