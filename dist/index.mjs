const V = (i) => Array.isArray(i), f = (i) => V(i) ? i : [i];
function j(i, t) {
  const e = i.executionOrder || 0, r = t.executionOrder || 0;
  return e - r;
}
class P {
  constructor() {
    this.seenObjects = /* @__PURE__ */ new Set();
  }
  objectHasBeenSeen(t) {
    return this.seenObjects.has(t.val);
  }
  registerObjectVisit(t) {
    this.seenObjects.add(t.val);
  }
}
function T(i) {
  var t;
  return {
    callbacksByPosition: {
      preVisit: [],
      postVisit: []
    },
    config: {
      trackExecutedCallbacks: !0,
      visitationRegister: i.visitationRegister || new P(),
      traversalMode: i.traversalMode ?? "depth",
      graphMode: i.graphMode ?? "finiteTree",
      parallelizeAsyncCallbacks: i.parallelizeAsyncCallbacks ?? !1,
      onVisit: ((t = f(i.onVisit ?? [])) == null ? void 0 : t.filter((e) => !!e.callback).map((e) => ({
        callback: e.callback,
        executionOrder: e.executionOrder ?? 0,
        filters: typeof e.filters > "u" ? [] : f(e.filters),
        timing: e.timing ?? "preVisit"
      }))) ?? []
    }
  };
}
function A(i) {
  const t = T(i);
  f(t.config.onVisit).forEach((e) => {
    e.timing === "both" ? (t.callbacksByPosition.preVisit.push(e), t.callbacksByPosition.postVisit.push(e)) : t.callbacksByPosition[e.timing].push(e);
  });
  for (const e in t.callbacksByPosition)
    t.callbacksByPosition[e] = t.callbacksByPosition[e].sort(j);
  return t;
}
const p = (i) => Array.isArray(i) ? "array" : typeof i == "object" ? "object" : "value";
function M(i) {
  return i.isArrayMember ? `[${i.key}]` : `["${i.key}"]`;
}
const h = class h {
  constructor(t, e = !1, r = !1, s = "value", a = "undefined", o = [], n, l) {
    this.val = t, this.isRoot = e, this.isArrayMember = r, this.nodeType = s, this.rawType = a, this.executedCallbacks = o, this.key = n, this.parent = l, this._children = void 0, this.id = h._idx++;
  }
  static fromRoot(t) {
    return new h(
      t,
      !0,
      !1,
      p(t),
      typeof t,
      [],
      void 0,
      void 0
    );
  }
  static fromObjectKey(t, e) {
    return new h(
      t.val[e],
      !1,
      !1,
      p(t.val[e]),
      typeof t.val[e],
      [],
      e,
      t
    );
  }
  static fromArrayIndex(t, e) {
    return new h(
      t.val[e],
      !1,
      !0,
      p(t.val[e]),
      typeof t.val[e],
      [],
      e,
      t
    );
  }
  canBeCompared() {
    return this.nodeType !== "value" && this.val !== null && !Object.is(NaN, this.val);
  }
  sameAs(t) {
    return !this.canBeCompared() || this.nodeType !== t.nodeType || this.val === null || Object.is(NaN, this.val) ? !1 : Object.is(this.val, t.val);
  }
  getPath(t) {
    return this.isRoot ? "" : (t = t || M, this.parent.getPath(t) + t(this));
  }
  get children() {
    return typeof this._children > "u" && (this._children = [...this.getChildren()]), this._children;
  }
  *getChildren() {
    if (this.nodeType === "array")
      for (let t = 0; t < this.val.length; t++)
        yield h.fromArrayIndex(this, t);
    else if (this.nodeType === "object") {
      if (this.val === null)
        return;
      for (let t of Object.keys(this.val))
        yield h.fromObjectKey(this, t);
    }
  }
  get siblings() {
    return [...this.getSiblings()];
  }
  *getSiblings() {
    if (this.parent)
      for (let t of this.parent.children)
        this.key !== t.key && (yield t);
  }
  get ancestors() {
    return [...this.getAncestors()];
  }
  *getAncestors() {
    let t = this.parent;
    for (; t; )
      yield t, t = t.parent;
  }
  get descendants() {
    return [...this.getDescendants()];
  }
  *getDescendants() {
    for (const t of this.getChildren())
      yield t, yield* t.getDescendants();
  }
};
h._idx = 0;
let k = h;
function F(i, t) {
  return f(i.filters).every((e) => e(t));
}
function R(i, t, e) {
  for (let r of i)
    r.callback(t), e && t.executedCallbacks.push(r);
}
async function q(i, t, e) {
  for (let r of i)
    await r.callback(t), e && t.executedCallbacks.push(r);
}
const z = async (i, t) => {
  await Promise.all(
    i.map(
      (e) => Promise.resolve(e.callback(t)).then(() => {
        t.executedCallbacks.push(e);
      })
    )
  );
};
class d {
  constructor(t, e) {
    this.ctx = t, this.executor = e, this.lookup = {};
  }
  static forSync(t) {
    return new d(t, R);
  }
  static forAsync(t) {
    return new d(t, t.config.parallelizeAsyncCallbacks ? z : q);
  }
  _matchCallbacks(t, e) {
    return (this.ctx.callbacksByPosition[e] || []).map((s) => s).filter((s) => F(s, t));
  }
  pushToStack(t, e) {
    const r = t.children[t.children.length - 1], s = this._matchCallbacks(t, e);
    this.lookup[r.id] = {
      trigger: t.id,
      fn: () => this.executor(s, t, this.ctx.config.trackExecutedCallbacks)
    };
  }
  executeOne(t, e) {
    const r = this._matchCallbacks(t, e);
    return this.executor(r, t, this.ctx.config.trackExecutedCallbacks);
  }
  *execute(t) {
    let e = this.lookup[t];
    for (delete this.lookup[t]; e; ) {
      yield e.fn();
      const r = e.trigger;
      e = this.lookup[r], delete this.lookup[r];
    }
  }
}
class v extends Error {
  constructor(t = "") {
    super(t), this.name = "Break";
  }
}
class m {
  constructor(t) {
    this.depthFirst = t, this.queue = [], this.add = t ? (e) => this.queue.unshift(...e) : (e) => this.queue.push(...e);
  }
  shift() {
    return this.queue.shift();
  }
  get more() {
    return this.queue.length > 0;
  }
}
class O {
  constructor(t) {
    this.ctx = t, this.depthFirst = t.config.traversalMode === "depth";
  }
  shouldSkipVisitation(t) {
    if (!t.canBeCompared())
      return !1;
    const e = this.ctx.config.visitationRegister;
    if (!e.objectHasBeenSeen(t))
      e.registerObjectVisit(t);
    else {
      if (this.ctx.config.graphMode === "graph")
        return !0;
      if (this.ctx.config.graphMode === "finiteTree")
        throw "The object violates the defined structure. Override 'graphMode' in the config to allow parsing different object structures.";
    }
    return !1;
  }
  *walk(t) {
    const e = new m(this.depthFirst), r = d.forSync(this.ctx);
    try {
      e.add([k.fromRoot(t)]);
      do {
        const s = e.shift();
        if (this.shouldSkipVisitation(s))
          continue;
        const a = s.children;
        if (e.add(a), r.executeOne(s, "preVisit"), yield s, this.depthFirst && a.length)
          r.pushToStack(s, "postVisit");
        else {
          r.executeOne(s, "postVisit");
          for (let o of r.execute(s.id))
            ;
        }
      } while (e.more);
    } catch (s) {
      if (!(s instanceof v))
        throw s;
    }
  }
  async *walkAsync(t) {
    const e = new m(this.depthFirst), r = d.forAsync(this.ctx);
    try {
      e.add([k.fromRoot(t)]);
      do {
        const s = e.shift();
        if (this.shouldSkipVisitation(s))
          continue;
        const a = s.children;
        if (e.add(a), await r.executeOne(s, "preVisit"), yield s, this.depthFirst && a.length)
          r.pushToStack(s, "postVisit");
        else {
          await r.executeOne(s, "postVisit");
          for await (const o of r.execute(s.id))
            ;
        }
      } while (e.more);
    } catch (s) {
      if (!(s instanceof v))
        throw s;
    }
  }
}
function* g(i, t = {}) {
  const e = A(t);
  yield* new O(e).walk(i);
}
async function* S(i, t = {}) {
  const e = A(t);
  yield* new O(e).walkAsync(i);
}
function b(i, t = {}) {
  for (let e of g(i, t))
    ;
}
async function B(i, t = {}) {
  for await (let e of S(i, t))
    ;
}
class E {
  constructor(t, e) {
    this.cbs = t, this.source = e, this.callback = {
      callback: () => {
      }
    };
  }
  withExecutionOrder(t) {
    return this.callback.executionOrder = t, this;
  }
  withFilter(t) {
    return this.withFilters(t);
  }
  withFilters(...t) {
    return this.callback.filters = t, this;
  }
  withTiming(t) {
    return this.callback.timing = t, this;
  }
  done() {
    return this.source.withCallbacks(
      ...this.cbs.map((t) => ({
        ...this.callback,
        callback: t
      }))
    );
  }
}
class _ {
  constructor() {
    this._config = {}, this.globalFilters = [];
  }
  resetConfig() {
    return this._config = {}, this;
  }
  withConfig(t) {
    return this._config = { ...this._config, ...t }, this;
  }
  withTraversalMode(t) {
    return this._config.traversalMode = t, this;
  }
  withGraphMode(t) {
    return this._config.graphMode = t, this;
  }
  withConfiguredCallbacks(...t) {
    return new E(t, this);
  }
  withConfiguredCallback(t) {
    return this.withConfiguredCallbacks(t);
  }
  withCallback(t) {
    return this.withCallbacks(t);
  }
  withGlobalFilter(t) {
    return this.globalFilters.push(t), this;
  }
  withCallbacks(...t) {
    return this._config.onVisit || (this._config.onVisit = []), V(this._config.onVisit) || (this._config.onVisit = [this._config.onVisit]), this._config.onVisit.push(...t), this;
  }
  getCurrentConfig() {
    return {
      ...this._config,
      onVisit: f(this._config.onVisit ?? []).map((t) => ({
        ...t,
        filters: [
          ...t.filters ? f(t.filters) : [],
          ...this.globalFilters
        ]
      }))
    };
  }
}
class G extends _ {
  walk(t) {
    b(t, this.getCurrentConfig());
  }
  *walkStep(t) {
    return g(t, this.getCurrentConfig());
  }
  withSimpleCallback(t) {
    return this.withSimpleCallbacks(t);
  }
  withSimpleCallbacks(...t) {
    return this.withCallbacks(...t.map((e) => ({ callback: e })));
  }
}
class H extends _ {
  async walk(t) {
    return B(t, this.getCurrentConfig());
  }
  async *walkStep(t) {
    return S(t, this.getCurrentConfig());
  }
  withParallelizeAsyncCallbacks(t) {
    return this._config.parallelizeAsyncCallbacks = t, this;
  }
  withSimpleCallback(t) {
    return this.withSimpleCallbacks(t);
  }
  withSimpleCallbacks(...t) {
    return this.withCallbacks(...t.map((e) => ({ callback: e })));
  }
}
function x(i, ...t) {
  b(i, { onVisit: t.map((e) => ({ callback: e })) });
}
async function I(i, ...t) {
  await B(i, { onVisit: t.map((e) => ({ callback: e })) });
}
function $(i, t, e, r) {
  const s = t.split(e).slice(1);
  for (; s.length > 1; )
    i = i[s.shift()];
  i[s.shift()] = r;
}
function K(i, t = "$walk:dc$") {
  if (i === null)
    return null;
  const e = Array.isArray(i) ? [] : {}, r = ({ key: s }) => t + s;
  return b(i, {
    onVisit: [{
      timing: "preVisit",
      filters: [(s) => !s.isRoot],
      callback: (s) => $(
        e,
        s.getPath(r),
        t,
        s.nodeType === "array" ? [] : s.nodeType === "value" ? s.val : s.val === null ? null : {}
      )
    }]
  }), e;
}
const D = ({ key: i, isArrayMember: t }) => t ? `[${i}]` : `.${i}`;
function W(i, t, e = !1, r = D, s = (a, o) => Object.is(a.val, o.val)) {
  const a = {}, o = {};
  return x(i, (n) => a[n.getPath(r)] = n), x(t, (n) => o[n.getPath(r)] = n), [.../* @__PURE__ */ new Set([
    ...Object.keys(a),
    ...Object.keys(o)
  ])].filter((n) => !e || (a[n] || o[n]).nodeType === "value").map((n) => {
    const l = a[n], c = o[n], y = l && !c, w = c && !l, C = l && c && !s(l, c);
    let u = {
      path: n,
      hasDifference: y || w || C
    };
    return w ? (u.difference = "added", u.b = c == null ? void 0 : c.val) : y ? (u.difference = "removed", u.a = l == null ? void 0 : l.val) : C && (u.difference = {
      before: l == null ? void 0 : l.val,
      after: c == null ? void 0 : c.val
    }, u.a = l == null ? void 0 : l.val, u.b = c == null ? void 0 : c.val), u;
  });
}
function Q(i, t, e) {
  let r = t;
  for (const s of g(i))
    r = e(r, s);
  return r;
}
export {
  H as AsyncWalkBuilder,
  v as Break,
  P as SetVisitationRegister,
  G as WalkBuilder,
  k as WalkNode,
  d as _CallbackStacker,
  A as _buildContext,
  x as apply,
  I as applyAsync,
  f as asMany,
  W as compare,
  K as deepCopy,
  V as isMany,
  Q as reduce,
  b as walk,
  B as walkAsync,
  S as walkAsyncStep,
  g as walkStep
};
