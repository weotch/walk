import { NodePathSegmentFormatter } from '../types';
import { WalkNode } from '../node';
type NodeComparison = {
    path: string;
    a?: any;
    b?: any;
    hasDifference: boolean;
    difference?: 'added' | 'removed' | {
        before: any;
        after: any;
    };
};
export type NodeComparisonFn = (a: WalkNode, b: WalkNode) => boolean;
export declare function compare(a: object, b: object, leavesOnly?: boolean, formatter?: NodePathSegmentFormatter, nodeComparison?: NodeComparisonFn): NodeComparison[];
export {};
