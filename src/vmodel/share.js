import { Anot, platform, isObject, makeHashCode } from '../seed/core'
import { SYS_SKIP } from './reserved'
import { Mutation } from './Mutation'
import { Computed } from './Computed'

var $proxyItemBackdoorMap = {}

/**
 * 这里放置ViewModel模块的共用方法
 * IProxy, 基本用户数据产生的一个数据对象,基于$model与vmodel之间的形态
 * modelFactory: 生成用户VM
 * canHijack: 判定此属性是否该被劫持,加入数据监听与分发的的逻辑
 * createProxy: listFactory与modelFactory的封装
 * itemFactory: ms-for循环中产生的代理VM的生成工厂
 * fuseFactory: 两个ms-controller间产生的代理VM的生成工厂
 */

/**
 * Anot改用Proxy来创建VM,因此
 */

export function IProxy(source, dd) {
  // var { state, props, watch, methods, mounted } = source

  // console.log(state, methods)
  Anot.mix(this, source)
  Anot.mix(this, SYS_SKIP)
  this.$hashcode = makeHashCode('$')
  this.$id = this.$id || this.$hashcode
  this.$events = {
    __dep__: dd || new Mutation(this.$id)
  }
  // console.log('***********', this.$id)
  delete this.$mutations

  this.$accessors = {}
  this.$computed = {}
  this.$track = ''

  if (dd === undefined) {
    this.$watch = platform.watchFactory(this.$events)
    this.$fire = platform.fireFactory(this.$events)
  } else {
    delete this.$watch
    delete this.$fire
  }
}

export function canHijack(key, val, $proxyItemBackdoor) {
  if (key in SYS_SKIP) {
    return false
  }
  if (key.charAt(0) === '$') {
    if ($proxyItemBackdoor) {
      if (!$proxyItemBackdoorMap[key]) {
        $proxyItemBackdoorMap[key] = 1
        console.warn(`ms-for中的变量${key}不再建议以$为前缀`)
      }
      return true
    }
    return false
  }
  if (val == null) {
    console.warn('定义vmodel时' + key + '的属性值不能为null undefine')
    return true
  }
  if (/error|date|function|regexp/.test(Anot.type(val))) {
    return false
  }
  return !(val && val.nodeName && val.nodeType)
}

export function createProxy(target, dd) {
  if (target && target.$events) {
    return target
  }
  var vm
  if (Array.isArray(target)) {
    vm = platform.listFactory(target, false, dd)
  } else if (isObject(target)) {
    vm = platform.modelFactory(target, dd)
  }
  return vm
}

platform.createProxy = createProxy

function toJson(val) {
  var xtype = Anot.type(val)
  if (xtype === 'array') {
    var array = []
    for (var i = 0; i < val.length; i++) {
      array[i] = toJson(val[i])
    }
    return array
  } else if (xtype === 'object') {
    if (typeof val.$track === 'string') {
      var obj = {}
      var arr = val.$track.match(/[^☥]+/g) || []
      arr.forEach(function(i) {
        var value = val[i]
        obj[i] = value && value.$events ? toJson(value) : value
      })
      return obj
    }
  }
  return val
}

var modelAccessor = {
  get: function() {
    return toJson(this)
  },
  set: Anot.noop,
  enumerable: false,
  configurable: true
}

platform.toJson = toJson
platform.modelAccessor = modelAccessor
