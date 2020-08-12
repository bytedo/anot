import { Anot } from '../../seed/core'
import { getWindow } from './share'

Anot.fn.offset = function() {
  //取得距离页面左右角的坐标
  var node = this[0]
  try {
    var rect = node.getBoundingClientRect()
    // Make sure element is not hidden (display: none) or disconnected
    // https://github.com/jquery/jquery/pull/2043/files#r23981494
    if (rect.width || rect.height || node.getClientRects().length) {
      var doc = node.ownerDocument
      var root = doc.documentElement
      var win = doc.defaultView
      return {
        top: rect.top + win.pageYOffset - root.clientTop,
        left: rect.left + win.pageXOffset - root.clientLeft
      }
    }
  } catch (e) {
    return {
      left: 0,
      top: 0
    }
  }
}

Anot.each(
  {
    scrollLeft: 'pageXOffset',
    scrollTop: 'pageYOffset'
  },
  function(method, prop) {
    Anot.fn[method] = function(val) {
      var node = this[0] || {}
      var win = getWindow(node)
      var top = method === 'scrollTop'
      if (!arguments.length) {
        return win ? win[prop] : node[method]
      } else {
        if (win) {
          win.scrollTo(!top ? val : win[prop], top ? val : win[prop])
        } else {
          node[method] = val
        }
      }
    }
  }
)
