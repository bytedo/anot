import { Anot } from '../seed/core'

export function VText(text) {
  this.nodeName = '#text'
  this.nodeValue = text
}

VText.prototype = {
  constructor: VText,
  toDOM() {
    /* istanbul ignore if*/
    if (this.dom) return this.dom
    var v = Anot._decode(this.nodeValue)
    return (this.dom = document.createTextNode(v))
  },
  toHTML() {
    return this.nodeValue
  }
}
