import { Anot } from '../seed/core'

Anot.directive('expr', {
  update: function(vdom, value) {
    value = value == null || value === '' ? '\u200b' : value
    vdom.nodeValue = value
    //https://github.com/RubyLouvre/Anot/issues/1834
    if (vdom.dom) vdom.dom.data = value
  }
})
