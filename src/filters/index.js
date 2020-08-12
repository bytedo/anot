import { Anot } from '../seed/core'

import { numberFilter } from './number'
import { sanitizeFilter } from './sanitize'
import { dateFilter } from './date'
import { filterBy, orderBy, selectBy, limitBy } from './array'
import { eventFilters } from './event'
import { escapeFilter } from './escape'
var filters = (Anot.filters = {})

Anot.composeFilters = function() {
  var args = arguments
  return function(value) {
    for (var i = 0, arr; (arr = args[i++]); ) {
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
    truncate(str, length, end) {
      //length，新字符串长度，truncation，新字符串的结尾的字段,返回新字符串
      if (!str) {
        return ''
      }
      str = String(str)
      if (isNaN(length)) {
        length = 30
      }
      end = typeof end === 'string' ? end : '...'
      return str.length > length
        ? str.slice(0, length - end.length) + end /* istanbul ignore else*/
        : str
    },
    camelize: Anot.camelize,
    date: dateFilter,
    escape: escapeFilter,
    sanitize: sanitizeFilter,
    number: numberFilter,
    currency(amount, symbol, fractionSize) {
      return (
        (symbol || '\u00a5') +
        numberFilter(
          amount,
          isFinite(fractionSize) ? /* istanbul ignore else*/ fractionSize : 2
        )
      )
    }
  },
  { filterBy, orderBy, selectBy, limitBy },
  eventFilters
)

export { Anot }
