import { Anot, platform } from '../seed/core'
import { impCb } from './important'
Anot.directive('controller', {
  priority: 2,
  getScope: function(name, scope) {
    var v = Anot.vmodels[name]
    if (v) {
      v.$render = this
      if (scope && scope !== v) {
        return platform.fuseFactory(scope, v)
      }
      return v
    }
    return scope
  },
  update: impCb
})
