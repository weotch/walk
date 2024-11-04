import { AsyncCallbackFn, CallbackFn, PartialConfig } from './types';
import { WalkNode } from './node';
export declare function walkStep(target: any, config?: PartialConfig<CallbackFn>): Generator<WalkNode>;
export declare function walkAsyncStep(target: any, config?: PartialConfig<AsyncCallbackFn>): AsyncGenerator<WalkNode, void, unknown>;
export declare function walk(target: any, config?: PartialConfig<CallbackFn>): void;
export declare function walkAsync(target: any, config?: PartialConfig<AsyncCallbackFn>): Promise<void>;
