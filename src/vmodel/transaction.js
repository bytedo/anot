import { Anot, config } from '../seed/core'

Anot.pendingActions = []
Anot.uniqActions = {}
Anot.inTransaction = 0
config.trackDeps = false
Anot.track = function() {
  if (config.trackDeps) {
    Anot.log.apply(Anot, arguments)
  }
}

/**
 * Batch is a pseudotransaction, just for purposes of memoizing ComputedValues when nothing else does.
 * During a batch `onBecomeUnobserved` will be called at most once per observable.
 * Avoids unnecessary recalculations.
 */

export function runActions() {
  if (Anot.isRunningActions === true || Anot.inTransaction > 0) return
  Anot.isRunningActions = true
  var tasks = Anot.pendingActions.splice(0, Anot.pendingActions.length)
  for (var i = 0, task; (task = tasks[i++]); ) {
    task.update()
    delete Anot.uniqActions[task.uuid]
  }
  Anot.isRunningActions = false
}

export function propagateChanged(target) {
  var list = target.observers
  for (var i = 0, el; (el = list[i++]); ) {
    el.schedule() //通知action, computed做它们该做的事
  }
}

//将自己抛到市场上卖
export function reportObserved(target) {
  var action = Anot.trackingAction || null
  if (action !== null) {
    Anot.track('征收到', target.expr)
    action.mapIDs[target.uuid] = target
  }
}

var targetStack = []

export function collectDeps(action, getter) {
  if (!action.observers) return
  var preAction = Anot.trackingAction
  if (preAction) {
    targetStack.push(preAction)
  }
  Anot.trackingAction = action
  Anot.track('【action】', action.type, action.expr, '开始征收依赖项')
  //多个observe持有同一个action
  action.mapIDs = {} //重新收集依赖
  var hasError = true,
    result
  try {
    result = getter.call(action)
    hasError = false
  } finally {
    if (hasError) {
      Anot.warn('collectDeps fail', getter + '')
      action.mapIDs = {}
      Anot.trackingAction = preAction
    } else {
      // 确保它总是为null
      Anot.trackingAction = targetStack.pop()
      try {
        resetDeps(action)
      } catch (e) {
        Anot.warn(e)
      }
    }
    return result
  }
}

function resetDeps(action) {
  var prev = action.observers,
    curr = [],
    checked = {},
    ids = []
  for (let i in action.mapIDs) {
    let dep = action.mapIDs[i]
    if (!dep.isAction) {
      if (!dep.observers) {
        //如果它已经被销毁
        delete action.mapIDs[i]
        continue
      }
      ids.push(dep.uuid)
      curr.push(dep)
      checked[dep.uuid] = 1
      if (dep.lastAccessedBy === action.uuid) {
        continue
      }
      dep.lastAccessedBy = action.uuid
      Anot.Array.ensure(dep.observers, action)
    }
  }
  var ids = ids.sort().join(',')
  if (ids === action.ids) {
    return
  }
  action.ids = ids
  if (!action.isComputed) {
    action.observers = curr
  } else {
    action.depsCount = curr.length
    action.deps = Anot.mix({}, action.mapIDs)
    action.depsVersion = {}
    for (let i in action.mapIDs) {
      let dep = action.mapIDs[i]
      action.depsVersion[dep.uuid] = dep.version
    }
  }

  for (let i = 0, dep; (dep = prev[i++]); ) {
    if (!checked[dep.uuid]) {
      Anot.Array.remove(dep.observers, action)
    }
  }
}

function transaction(action, thisArg, args) {
  args = args || []
  var name = 'transaction ' + (action.name || action.displayName || 'noop')
  transactionStart(name)
  var res = action.apply(thisArg, args)
  transactionEnd(name)
  return res
}
Anot.transaction = transaction

export function transactionStart(name) {
  Anot.inTransaction += 1
}

export function transactionEnd(name) {
  if (--Anot.inTransaction === 0) {
    Anot.isRunningActions = false
    runActions()
  }
}
