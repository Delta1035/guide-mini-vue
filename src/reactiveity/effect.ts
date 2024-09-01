class ReactiveEffect {
  private _fn: Function;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    this._fn();
  }
}

let activeEffect;
export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}

const targetMap = new Map();
export function track(target, key) {
  // target => key => dep
  // 获取代理对象依赖映射
  let depsMap: Map<string, Set<Function>> = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    // 如果还没有映射，就创建一个映射
    targetMap.set(target, depsMap);
  }
  // 从依赖映射中根据k获取对应的依赖
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  // 将当前活跃的effect添加到依赖中
  deps.add(activeEffect);
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);
  // 执行每一条依赖
  for (const dep of deps) {
    dep.run();
  }
}
