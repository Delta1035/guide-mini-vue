import { track, trigger } from "./effect";

export function reactive(raw: any) {
  return new Proxy(raw, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key);
      track(target, key);
      return res;
    },
    set(target, key, newValue, receiver) {
      const res = Reflect.set(target, key, newValue);
      trigger(target, key);
      return res; // 这里因该返回一个boolean，代表是否设置成功
    },
  });
}
