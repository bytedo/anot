import { Anot } from '../seed/core'

import { Action, protectedMenbers } from '../vmodel/Action'

/**
 * 一个directive装饰器
 * @returns {directive}
 */
// DirectiveDecorator(scope, binding, vdom, this)
// Decorator(vm, options, callback)
export function Directive(vm, binding, vdom, render) {
  var type = binding.type
  var decorator = Anot.directives[type]

  var dom = Anot.vdom(vdom, 'toDOM')
  if (dom.nodeType === 1) {
    dom.removeAttribute(binding.attrName)
  }
  vdom.dom = dom

  var callback = decorator.update
    ? function(value) {
        if (!render.mount && /css|visible|duplex/.test(type)) {
          render.callbacks.push(function() {
            decorator.update.call(directive, directive.node, value)
          })
        } else {
          decorator.update.call(directive, directive.node, value)
        }
      }
    : Anot.noop
  for (var key in decorator) {
    binding[key] = decorator[key]
  }
  binding.node = vdom
  var directive = new Action(vm, binding, callback)
  if (directive.init) {
    //这里可能会重写node, callback, type, name
    directive.init()
  }
  directive.update()
  return directive
}
