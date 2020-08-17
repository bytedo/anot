import { Anot, oneObject } from '../seed/core'

var pNestChild = oneObject('div,ul,ol,dl,table,h1,h2,h3,h4,h5,h6,form,fieldset')
var tNestChild = makeObject('tr,style,script')
var nestObject = {
  p: pNestChild,
  select: makeObject('option,optgroup,#text'),
  optgroup: makeObject('option,#text'),
  option: makeObject('#text'),
  tr: makeObject('th,td,style,script'),

  tbody: tNestChild,
  tfoot: tNestChild,
  thead: tNestChild,
  colgroup: makeObject('col'),
  // table: oneObject('caption,colgroup,tbody,thead,tfoot,style,script,template,#document-fragment'),
  head: makeObject(
    'base,basefont,bgsound,link,style,script,meta,title,noscript,noframes'
  ),
  html: oneObject('head,body')
}

function makeObject(str) {
  return oneObject(str + ',template,#document-fragment,#comment')
}

export function validateDOMNesting(parent, child) {
  var parentTag = parent.nodeName
  var tag = child.nodeName
  var parentChild = nestObject[parentTag]
  if (parentChild) {
    if (parentTag === 'p') {
      if (pNestChild[tag]) {
        console.warn(
          'P标签节点不允许以下类型的子节点:\n' + Object.keys(pNestChild)
        )
        return false
      }
    } else if (!parentChild[tag]) {
      console.warn(
        parentTag.toUpperCase() +
          '标签节点只能增加以下子节点:\n' +
          Object.keys(parentChild) +
          '\n当前子节点为:' +
          tag.toUpperCase() +
          ' !!'
      )
      return false
    }
  }
  return true
}
