import { Callback, AsyncCallbackFn, CallbackFn, Context, CallbackTiming } from './types';
import { WalkNode } from './node';
export declare class _CallbackStacker<T extends CallbackFn, Rt> {
    private ctx;
    private executor;
    constructor(ctx: Context<T>, executor: (callbacks: Callback<T>[], node: WalkNode, enableExecutedCallbacks: boolean) => Rt);
    static forSync<T extends CallbackFn>(ctx: Context<T>): _CallbackStacker<CallbackFn, void>;
    static forAsync<T extends CallbackFn>(ctx: Context<T>): _CallbackStacker<AsyncCallbackFn, void | Promise<void>>;
    private _matchCallbacks;
    private lookup;
    pushToStack(node: WalkNode, position: CallbackTiming): void;
    executeOne(node: WalkNode, position: CallbackTiming): Rt;
    execute(nodeId: number): Generator<Rt>;
}
