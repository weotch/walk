import { Callback, NodePathSegmentFormatter, NodeType } from './types';
export declare class WalkNode {
    val: any;
    isRoot: boolean;
    isArrayMember: boolean;
    nodeType: NodeType;
    rawType: string;
    executedCallbacks: Callback<any>[];
    key?: string | number | undefined;
    parent?: WalkNode | undefined;
    private _children?;
    private static _idx;
    readonly id: number;
    constructor(val: any, isRoot?: boolean, isArrayMember?: boolean, nodeType?: NodeType, rawType?: string, executedCallbacks?: Callback<any>[], key?: string | number | undefined, parent?: WalkNode | undefined);
    static fromRoot(obj: any): WalkNode;
    static fromObjectKey(parent: WalkNode, key: string): WalkNode;
    static fromArrayIndex(parent: WalkNode, index: number): WalkNode;
    canBeCompared(): boolean;
    sameAs(other: WalkNode): boolean;
    getPath(pathFormat?: NodePathSegmentFormatter): string;
    get children(): WalkNode[];
    getChildren(): Generator<WalkNode>;
    get siblings(): WalkNode[];
    getSiblings(): Generator<WalkNode>;
    get ancestors(): WalkNode[];
    getAncestors(): Generator<WalkNode>;
    get descendants(): WalkNode[];
    getDescendants(): Generator<WalkNode>;
}
