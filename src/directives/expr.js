import Anot from '../seed/index'

//https://github.com/RubyLouvre/avalon/issues/1834
Anot.directive('expr', {
  update: function(vdom, value) {
    value = value == null || value === '' ? '\u200b' : value
    vdom.nodeValue = value
    if (vdom.dom) {
      vdom.dom.data = value
    }
  }
})
