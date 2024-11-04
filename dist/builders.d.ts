import { Callback, AsyncCallbackFn, CallbackFn, GraphMode, NodeFilterFn, PartialConfig, CallbackTiming, TraversalMode } from './types';
import { WalkNode } from './node';
declare class CallbacksBuilder<T extends CallbackFn, TUpper extends BaseWalkBuilder<T>> {
    private cbs;
    private source;
    private readonly callback;
    constructor(cbs: T[], source: TUpper);
    withExecutionOrder(order: number): this;
    withFilter(fn: NodeFilterFn): this;
    withFilters(...fn: NodeFilterFn[]): this;
    withTiming(timing: CallbackTiming): this;
    done(): TUpper;
}
declare abstract class BaseWalkBuilder<T extends CallbackFn> {
    protected _config: PartialConfig<T>;
    private globalFilters;
    resetConfig(): this;
    withConfig(config: PartialConfig<T>): this;
    withTraversalMode(traversalMode: TraversalMode): this;
    withGraphMode(graphMode: GraphMode): this;
    withConfiguredCallbacks(...callbacks: T[]): CallbacksBuilder<T, this>;
    withConfiguredCallback(callback: T): CallbacksBuilder<T, this>;
    withCallback(callback: Partial<Callback<T>>): this;
    withGlobalFilter(fn: NodeFilterFn): this;
    withCallbacks(...callbacks: Partial<Callback<T>>[]): this;
    getCurrentConfig(): PartialConfig<T>;
}
export declare class WalkBuilder extends BaseWalkBuilder<CallbackFn> {
    walk(target: any): void;
    walkStep(target: any): Generator<WalkNode>;
    withSimpleCallback(callback: CallbackFn): this;
    withSimpleCallbacks(...callbacks: CallbackFn[]): this;
}
export declare class AsyncWalkBuilder extends BaseWalkBuilder<AsyncCallbackFn> {
    walk(target: any): Promise<void>;
    walkStep(target: any): AsyncGenerator<never, AsyncGenerator<WalkNode, void, unknown>, unknown>;
    withParallelizeAsyncCallbacks(val: boolean): this;
    withSimpleCallback(callback: AsyncCallbackFn): this;
    withSimpleCallbacks(...callbacks: AsyncCallbackFn[]): this;
}
export {};
