// looseEqual: 检查两个值是否相等
export function looseEqual (a, b) {
  // 当 a === b 时，返回true
  if (a === b) return true
  // 否则进入isObject判断
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  // 判断是否都为Object类型
  if (isObjectA && isObjectB) {
    try {
      // 调用 Array.isArray() 方法，再次进行判断
      // isObject 不能区分是真数组还是对象（typeof）
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      // 判断是否都为数组
      if (isArrayA && isArrayB) {
        // 对比a、bs数组的长度
        return a.length === b.length && a.every((e, i) => {
          // 调用 looseEqual 进入递归
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        // 均不为数组，获取a、b对象的key集合
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        // 对比a、b对象的key集合长度
        return keysA.length === keysB.length && keysA.every(key => {
          //长度相等，则调用 looseEqual 进入递归
          return looseEqual(a[key], b[key])
        })
      } else {
        // 如果a、b中一个是数组，一个是对象，直接返回 false
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

// toLowerCase目的是 为了后续的各种环境检测
export const UA = inBrowser && window.navigator.userAgent.toLowerCase();

export const isIE = UA && /msie|trident/.test(UA);// IE浏览器判断
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0;// IE9浏览器判断
export const isEdge = UA && UA.indexOf('edge/') > 0;// Edge浏览器判断
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;// Chrome浏览器判断

// toString: 将给定变量的值转换为 string 类型并返回
export function toString (val) {
    return val == null // 当变量值为 null 时
        ? '' // 返回空字符串
        : typeof val === 'object' // 否则，判断当变量类型为 object时
        ? JSON.stringify(val, null, 2) // 返回 JSON.stringify(val, null, 2)
        : String(val) // 否则 String(val)
}

// isObject: 区分对象和原始值
export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}
