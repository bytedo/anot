import { Anot } from '../seed/core'

Anot.directive('html', {
  update: function(vdom, value) {
    this.beforeDispose()

    this.innerRender = Anot.scan(
      '<div class="ms-html-container">' + value + '</div>',
      this.vm,
      function() {
        var oldRoot = this.root
        if (vdom.children) vdom.children.length = 0
        vdom.children = oldRoot.children
        this.root = vdom
        if (vdom.dom) Anot.clearHTML(vdom.dom)
      }
    )
  },
  beforeDispose: function() {
    if (this.innerRender) {
      this.innerRender.dispose()
    }
  },
  delay: true
})
