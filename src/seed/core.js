import { Cache } from './cache'
import { directive, directives, delayCompileNodes } from './directive'

const root = document.documentElement

export function Anot(el) {
  return new Anot.init(el)
}

export var rword = /[^, ]+/g
export var rnowhite = /\S+/g //存在非空字符
export var platform = {} //用于放置平台差异的方法与属性
export var isArray = function(target) {
  return Anot.type(target) === 'array'
}

export function oneObject(array, val) {
  if (typeof array === 'string') {
    array = array.match(rword) || []
  }
  var result = {}
  var value = val !== void 0 ? val : 1
  for (var i = 0, n = array.length; i < n; i++) {
    result[array[i]] = value
  }
  return result
}

var op = Object.prototype

export var inspect = op.toString
export var ohasOwn = op.hasOwnProperty
export var ap = Array.prototype

export { Cache, directive, directives, delayCompileNodes, root }

export function noop() {}
export function isObject(a) {
  return a && typeof a === 'object'
}

export function range(start, end, step) {
  // 用于生成整数数组
  step || (step = 1)
  if (end == null) {
    end = start || 0
    start = 0
  }
  var index = -1,
    length = Math.max(0, Math.ceil((end - start) / step)),
    result = new Array(length)
  while (++index < length) {
    result[index] = start
    start += step
  }
  return result
}

var rhyphen = /([a-z\d])([A-Z]+)/g
export function hyphen(target) {
  //转换为连字符线风格
  return target.replace(rhyphen, '$1-$2').toLowerCase()
}

var rcamelize = /[-_][^-_]/g
export function camelize(target) {
  //提前判断，提高getStyle等的效率
  if (!target || (target.indexOf('-') < 0 && target.indexOf('_') < 0)) {
    return target
  }
  //转换为驼峰风格
  return target.replace(rcamelize, function(match) {
    return match.charAt(1).toUpperCase()
  })
}

export function makeHashCode(prefix = 'anot') {
  return (
    prefix +
    crypto
      .getRandomValues(new Uint8Array(8))
      .reduce((a, b) => a + b.toString(16), '')
      .slice(0, 12)
  )
}
//生成事件回调的UUID(用户通过ms-on指令)
export function getLongID(fn) {
  /* istanbul ignore next */
  return fn.uuid || (fn.uuid = makeHashCode('e'))
}
var UUID = 1
//生成事件回调的UUID(用户通过Anot.bind)
export function getShortID(fn) {
  /* istanbul ignore next */
  return fn.uuid || (fn.uuid = '_' + ++UUID)
}

var rescape = /[-.*+?^${}()|[\]\/\\]/g
export function escapeRegExp(target) {
  //http://stevenlevithan.com/regex/xregexp/
  //将字符串安全格式化为正则表达式的源码
  return (target + '').replace(rescape, '\\$&')
}

export var eventHooks = {}
export var eventListeners = {}
export var validators = {}
export var cssHooks = {}

window.Anot = Anot

/* istanbul ignore next  */
export function createFragment() {
  return document.createDocumentFragment()
}

export function _decode(str) {
  if (rentities.test(str)) {
    temp.innerHTML = str
    return temp.innerText || temp.textContent
  }
  return str
}

var rentities = /&[a-z0-9#]{2,10};/
var temp = document.createElement('div')

//============== config ============
export var config = {
  openTag: '{{',
  closeTag: '}}',
  rtext: /\{\{(.+?)\}\}/g,
  rexpr: /\{\{([\s\S]*)\}\}/
}

export function createAnchor(nodeValue) {
  return document.createComment(nodeValue)
}

//============  config ============

Object.assign(Anot, {
  Array: {
    merge: function(target, other) {
      //合并两个数组 Anot2新增
      target.push.apply(target, other)
    },
    ensure: function(target, item) {
      //只有当前数组不存在此元素时只添加它
      if (target.indexOf(item) === -1) {
        return target.push(item)
      }
    },
    removeAt: function(target, index) {
      //移除数组中指定位置的元素，返回布尔表示成功与否
      return !!target.splice(index, 1).length
    },
    remove: function(target, item) {
      //移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否
      var index = target.indexOf(item)
      if (~index) {
        return Anot.Array.removeAt(target, index)
      }
      return false
    }
  },
  evaluatorPool: new Cache(888),
  vmodels: {},

  directives,
  directive,

  eventHooks,
  eventListeners,
  cssHooks,

  noop,

  range,
  hyphen,
  camelize
})
