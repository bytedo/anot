import { Anot } from '../seed/core'

import { numberFilter } from './number'
import { xss } from './xss'
import { dateFilter } from './date'
import { filterBy, orderBy, selectBy, limitBy } from './array'
// import { eventFilters } from './event'
import { escapeFilter } from './escape'
var filters = (Anot.filters = {})

Anot.composeFilters = function(...args) {
  return function(value) {
    for (let arr of args) {
      var name = arr[0]
      var filter = Anot.filters[name]
      if (typeof filter === 'function') {
        arr[0] = value
        try {
          value = filter.apply(0, arr)
        } catch (e) {}
      }
    }
    return value
  }
}

Anot.escapeHtml = escapeFilter

Anot.mix(
  filters,
  {
    uppercase(str) {
      return String(str).toUpperCase()
    },
    lowercase(str) {
      return String(str).toLowerCase()
    },
    truncate(str, len, mark) {
      len = len || 30
      mark = typeof mark === 'string' ? mark : '...'
      return str.slice(0, len) + (str.length <= len ? '' : mark)
    },
    camelize: Anot.camelize,
    date: dateFilter,
    escape: escapeFilter,
    xss,
    number: numberFilter,
    currency(amount, symbol, fractionSize) {
      return (
        (symbol || '\u00a5') +
        numberFilter(amount, isFinite(fractionSize) ? fractionSize : 2)
      )
    }
  },
  { filterBy, orderBy, selectBy, limitBy }
  // eventFilters
)

export { Anot }
