import { Anot } from '../seed/core'
import '../effect/index'

var none = 'none'
function parseDisplay(elem, val) {
  //用于取得此类标签的默认display值
  var doc = elem.ownerDocument
  var nodeName = elem.nodeName
  var key = '_' + nodeName
  if (!parseDisplay[key]) {
    var temp = doc.body.appendChild(doc.createElement(nodeName))
    val = Anot.css(temp, 'display')
    doc.body.removeChild(temp)
    if (val === none) {
      val = 'block'
    }
    parseDisplay[key] = val
  }
  return parseDisplay[key]
}

Anot.parseDisplay = parseDisplay
Anot.directive('visible', {
  diff: function(newVal, oldVal) {
    var n = !!newVal
    if (oldVal === void 0 || n !== oldVal) {
      this.value = n
      return true
    }
  },
  ready: true,
  update: function(vdom, show) {
    var dom = vdom.dom
    if (dom && dom.nodeType === 1) {
      var display = dom.style.display
      var value
      if (show) {
        if (display === none) {
          value = vdom.displayValue
          if (!value) {
            dom.style.display = ''
            if (dom.style.cssText === '') {
              dom.removeAttribute('style')
            }
          }
        }
        // fix firefox BUG,必须挂到页面上
        if (
          dom.style.display === '' &&
          Anot(dom).css('display') === none &&
          dom.ownerDocument.contains(dom)
        ) {
          value = parseDisplay(dom)
        }
      } else {
        if (display !== none) {
          value = none
          vdom.displayValue = display
        }
      }
      var cb = function() {
        if (value !== void 0) {
          dom.style.display = value
        }
      }

      Anot.applyEffect(dom, vdom, {
        hook: show ? 'onEnterDone' : 'onLeaveDone',
        cb: cb
      })
    }
  }
})
