import { Anot } from '../seed/core'

var impDir = Anot.directive('important', {
  priority: 1,
  getScope: function(name, scope) {
    var v = Anot.vmodels[name]
    if (v) return v
    throw 'error! no vmodel called ' + name
  },
  update: function(node, attrName, $id) {
    if (!Anot.inBrowser) return
    var dom = Anot.vdom(node, 'toDOM')
    if (dom.nodeType === 1) {
      dom.removeAttribute(attrName)
      Anot(dom).removeClass('ms-controller')
    }
    var vm = Anot.vmodels[$id]
    if (vm) {
      vm.$element = dom
      vm.$render = this
      vm.$fire('onReady')
      delete vm.$events.onReady
    }
  }
})

export var impCb = impDir.update
