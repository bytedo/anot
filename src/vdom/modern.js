/**
 * 虚拟DOM的4大构造器
 */
import { Anot, createFragment } from '../seed/core'
import { VText } from './VText'
import { VComment } from './VComment'
import { VElement } from './VElement.modern'
import { VFragment } from './VFragment'

Anot.mix(Anot, {
  VText,
  VComment,
  VElement,
  VFragment
})

var constNameMap = {
  '#text': 'VText',
  '#document-fragment': 'VFragment',
  '#comment': 'VComment'
}

var vdom = (Anot.vdomAdaptor = Anot.vdom = function(obj, method) {
  if (!obj) {
    //obj在ms-for循环里面可能是null
    return method === 'toHTML' ? '' : createFragment()
  }
  var nodeName = obj.nodeName
  if (!nodeName) {
    return new Anot.VFragment(obj)[method]()
  }
  var constName = constNameMap[nodeName] || 'VElement'
  return Anot[constName].prototype[method].call(obj)
})

Anot.domize = function(a) {
  return Anot.vdom(a, 'toDOM')
}

export { vdom, Anot, VText, VComment, VElement, VFragment }
