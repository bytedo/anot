//这里放置存在异议的方法
import { Anot, inspect, platform, isObject } from './core'
export default Anot

var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/
var rarraylike = /(Array|List|Collection|Map|Arguments|Set)\]$/

// Anot.type
var class2type = {}
'Boolean,Number,String,Function,Array,Date,RegExp,Object,Error,AsyncFunction,Promise,Generator,GeneratorFunction'
  .split(',')
  .forEach(function(name) {
    class2type['[object ' + name + ']'] = name.toLowerCase()
  })

Anot.type = function(obj) {
  if (obj) {
    // 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
    return typeof obj === 'object' || typeof obj === 'function'
      ? class2type[inspect.call(obj)] || 'object'
      : typeof obj
  }
  return String(obj)
}

Anot.isFunction = function(fn) {
  return typeof fn === 'function'
}

Anot.isWindow = function(obj) {
  return rwindow.test(inspect.call(obj))
}

/*判定是否是一个朴素的javascript对象（Object），不是DOM对象，不是BOM对象，不是自定义类的实例*/
Anot.isPlainObject = function(obj) {
  // 简单的 typeof obj === 'object'检测，会致使用isPlainObject(window)在opera下通不过
  return (
    inspect.call(obj) === '[object Object]' &&
    Object.getPrototypeOf(obj) === Object.prototype
  )
}

Anot.nextTick = (function() {
  let queue = []
  function callback() {
    let n = queue.length
    for (let i = 0; i < n; i++) {
      queue[i]()
    }
    queue = queue.slice(n)
  }

  let node = document.createTextNode('<!-- -->')
  new MutationObserver(callback).observe(node, { characterData: true })

  let bool = false
  return function(fn) {
    queue.push(fn)
    bool = !bool
    node.data = bool
  }
})()

Anot.init = function(source) {
  if (source) {
    if (Anot.isPlainObject(source)) {
      var id = source.$id
      var vm = Anot.vmodels[id]

      if (!id) {
        throw new Error(`vm的$id必须声明`)
      }

      if (vm) {
        throw new Error(`vm实例[${id}]已经存在`)
      }
      vm = platform.modelFactory(source)
      Anot.vmodels[id] = vm

      Anot.nextTick(function() {
        let $elem = document.querySelector('[anot=' + vm.$id + ']')
        if ($elem) {
          if ($elem === document.body) {
            Anot.scan($elem)
          } else {
            let _parent = $elem
            while ((_parent = _parent.parentNode)) {
              if (_parent.__VM__) {
                break
              }
            }
            Anot.scan($elem.parentNode, _parent && _parent.__VM__)
          }
        }
      })
    }
    return vm
  }
  this[0] = this.element = source
}

Anot.fn = Anot.prototype = Anot.init.prototype

//与jQuery.extend方法，可用于浅拷贝，深拷贝
Anot.mix = Anot.fn.mix = function() {
  var options,
    name,
    src,
    copy,
    copyIsArray,
    clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false

  // 如果第一个参数为布尔,判定是否深拷贝
  if (typeof target === 'boolean') {
    deep = target
    target = arguments[1] || {}
    i++
  }

  //确保接受方为一个复杂的数据类型
  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {}
  }

  //如果只有一个参数，那么新成员添加于mix所在的对象上
  if (i === length) {
    target = this
    i--
  }

  for (; i < length; i++) {
    //只处理非空参数
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name]

        copy = options[name]

        // 防止环引用
        if (target === copy) {
          continue
        }
        if (
          deep &&
          copy &&
          (Anot.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
        ) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && Array.isArray(src) ? src : []
          } else {
            clone = src && Anot.isPlainObject(src) ? src : {}
          }

          target[name] = Anot.mix(deep, clone, copy)
        } else if (copy !== void 0) {
          target[name] = copy
        }
      }
    }
  }
  return target
}

/*判定是否类数组，如节点集合，纯数组，arguments与拥有非负整数的length属性的纯JS对象*/
export function isArrayLike(obj) {
  /* istanbul ignore if*/
  if (obj && typeof obj === 'object') {
    var n = obj.length
    var str = inspect.call(obj)

    if (rarraylike.test(str)) {
      return true
    } else if (str === '[object Object]' && n === n >>> 0) {
      return true //由于ecma262v5能修改对象属性的enumerable，因此不能用propertyIsEnumerable来判定了
    }
  }
  return false
}

Anot.each = function(obj, fn) {
  //排除null, undefined
  if (obj) {
    var i = 0
    if (isArrayLike(obj)) {
      for (var n = obj.length; i < n; i++) {
        if (fn(i, obj[i]) === false) {
          break
        }
      }
    } else {
      for (i in obj) {
        if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
          break
        }
      }
    }
  }
}
