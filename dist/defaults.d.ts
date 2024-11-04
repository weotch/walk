import { CallbackFn, Context, PartialConfig, NodeVisitationRegister } from './types';
import { WalkNode } from './node';
export declare class SetVisitationRegister implements NodeVisitationRegister {
    readonly seenObjects: Set<any>;
    objectHasBeenSeen(node: WalkNode): boolean;
    registerObjectVisit(node: WalkNode): void;
}
export declare function _buildContext<T extends CallbackFn>(config: PartialConfig<T>): Context<T>;
