import { Anot, createFragment } from '../seed/core'
import { lookupOption, getSelectedValue } from '../directives/duplex/option'

function getChildren(arr) {
  var count = 0
  for (var i = 0, el; (el = arr[i++]); ) {
    if (el.nodeName === '#document-fragment') {
      count += getChildren(el.children)
    } else {
      count += 1
    }
  }
  return count
}
export function groupTree(parent, children) {
  children &&
    children.forEach(function(vdom) {
      if (!vdom) return
      var vlength = vdom.children && getChildren(vdom.children)
      if (vdom.nodeName === '#document-fragment') {
        var dom = createFragment()
      } else {
        dom = Anot.vdom(vdom, 'toDOM')
        var domlength = dom.childNodes && dom.childNodes.length
        if (domlength && vlength && domlength > vlength) {
          if (!appendChildMayThrowError[dom.nodeName]) {
            Anot.clearHTML(dom)
          }
        }
      }
      if (vlength) {
        groupTree(dom, vdom.children)
        if (vdom.nodeName === 'select') {
          var values = []
          getSelectedValue(vdom, values)
          lookupOption(vdom, values)
        }
      }
      //高级版本可以尝试 querySelectorAll

      try {
        if (!appendChildMayThrowError[parent.nodeName]) {
          parent.appendChild(dom)
        }
      } catch (e) {}
    })
}

export function dumpTree(elem) {
  if (elem) {
    var firstChild
    while ((firstChild = elem.firstChild)) {
      if (firstChild.nodeType === 1) {
        dumpTree(firstChild)
      }
      elem.removeChild(firstChild)
    }
  }
}

export function getRange(childNodes, node) {
  var i = childNodes.indexOf(node) + 1
  var deep = 1
  var nodes = []
  var end

  nodes.start = i

  while ((node = childNodes[i++])) {
    nodes.push(node)
    if (node.nodeName === '#comment') {
      if (node.nodeValue.startsWith('ms-for:')) {
        deep++
      } else if (node.nodeValue === 'ms-for-end:') {
        deep--
        if (deep === 0) {
          end = node
          nodes.pop()
          break
        }
      }
    }
  }
  nodes.end = end
  return nodes
}

var appendChildMayThrowError = {
  '#text': 1,
  '#comment': 1,
  script: 1,
  style: 1,
  noscript: 1
}
