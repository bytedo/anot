function toInt(str) {
  return parseInt(str, 10) || 0
}

function padNumber(num, digits, trim) {
  var neg = ''
  /* istanbul ignore if*/
  if (num < 0) {
    neg = '-'
    num = -num
  }
  num = '' + num
  while (num.length < digits) {
    num = '0' + num
  }
  if (trim) {
    num = num.substr(num.length - digits)
  }
  return neg + num
}

function dateGetter(name, size, offset, trim) {
  return function(date) {
    var value = date['get' + name]()
    if (offset > 0 || value > -offset) value += offset
    if (value === 0 && offset === -12) {
      /* istanbul ignore next*/
      value = 12
    }
    return padNumber(value, size, trim)
  }
}

function dateStrGetter(name, shortForm) {
  return function(date, formats) {
    var value = date['get' + name]()
    var get = (shortForm ? 'SHORT' + name : name).toUpperCase()
    return formats[get][value]
  }
}

function timeZoneGetter(date) {
  var zone = -1 * date.getTimezoneOffset()
  var paddedZone = zone >= 0 ? '+' : ''
  paddedZone +=
    padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) +
    padNumber(Math.abs(zone % 60), 2)
  return paddedZone
}
//取得上午下午
function ampmGetter(date, formats) {
  return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
}
var DATE_FORMATS = {
  yyyy: dateGetter('FullYear', 4),
  yy: dateGetter('FullYear', 2, 0, true),
  y: dateGetter('FullYear', 1),
  MMMM: dateStrGetter('Month'),
  MMM: dateStrGetter('Month', true),
  MM: dateGetter('Month', 2, 1),
  M: dateGetter('Month', 1, 1),
  dd: dateGetter('Date', 2),
  d: dateGetter('Date', 1),
  HH: dateGetter('Hours', 2),
  H: dateGetter('Hours', 1),
  hh: dateGetter('Hours', 2, -12),
  h: dateGetter('Hours', 1, -12),
  mm: dateGetter('Minutes', 2),
  m: dateGetter('Minutes', 1),
  ss: dateGetter('Seconds', 2),
  s: dateGetter('Seconds', 1),
  sss: dateGetter('Milliseconds', 3),
  EEEE: dateStrGetter('Day'),
  EEE: dateStrGetter('Day', true),
  a: ampmGetter,
  Z: timeZoneGetter
}
var rdateFormat = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/
var raspnetjson = /^\/Date\((\d+)\)\/$/
export function dateFilter(date, format) {
  var locate = dateFilter.locate,
    text = '',
    parts = [],
    fn,
    match
  format = format || 'mediumDate'
  format = locate[format] || format
  if (typeof date === 'string') {
    if (/^\d+$/.test(date)) {
      date = toInt(date)
    } else if (raspnetjson.test(date)) {
      date = +RegExp.$1
    } else {
      var trimDate = date.trim()
      var dateArray = [0, 0, 0, 0, 0, 0, 0]
      var oDate = new Date(0)
      //取得年月日
      trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, function(_, a, b, c) {
        var array = c.length === 4 ? [c, a, b] : [a, b, c]
        dateArray[0] = toInt(array[0]) //年
        dateArray[1] = toInt(array[1]) - 1 //月
        dateArray[2] = toInt(array[2]) //日
        return ''
      })
      var dateSetter = oDate.setFullYear
      var timeSetter = oDate.setHours
      trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, function(
        _,
        a,
        b,
        c,
        d
      ) {
        dateArray[3] = toInt(a) //小时
        dateArray[4] = toInt(b) //分钟
        dateArray[5] = toInt(c) //秒
        if (d) {
          //毫秒
          dateArray[6] = Math.round(parseFloat('0.' + d) * 1000)
        }
        return ''
      })
      var tzHour = 0
      var tzMin = 0
      trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, function(
        z,
        symbol,
        c,
        d
      ) {
        dateSetter = oDate.setUTCFullYear
        timeSetter = oDate.setUTCHours
        if (symbol) {
          tzHour = toInt(symbol + c)
          tzMin = toInt(symbol + d)
        }
        return ''
      })

      dateArray[3] -= tzHour
      dateArray[4] -= tzMin
      dateSetter.apply(oDate, dateArray.slice(0, 3))
      timeSetter.apply(oDate, dateArray.slice(3))
      date = oDate
    }
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }

  while (format) {
    match = rdateFormat.exec(format)
    /* istanbul ignore else */
    if (match) {
      parts = parts.concat(match.slice(1))
      format = parts.pop()
    } else {
      parts.push(format)
      format = null
    }
  }
  parts.forEach(function(value) {
    fn = DATE_FORMATS[value]
    text += fn
      ? fn(date, locate)
      : value.replace(/(^'|'$)/g, '').replace(/''/g, "'")
  })
  return text
}

var locate = {
  AMPMS: {
    0: '上午',
    1: '下午'
  },
  DAY: {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六'
  },
  MONTH: {
    0: '1月',
    1: '2月',
    2: '3月',
    3: '4月',
    4: '5月',
    5: '6月',
    6: '7月',
    7: '8月',
    8: '9月',
    9: '10月',
    10: '11月',
    11: '12月'
  },
  SHORTDAY: {
    '0': '周日',
    '1': '周一',
    '2': '周二',
    '3': '周三',
    '4': '周四',
    '5': '周五',
    '6': '周六'
  },
  fullDate: 'y年M月d日EEEE',
  longDate: 'y年M月d日',
  medium: 'yyyy-M-d H:mm:ss',
  mediumDate: 'yyyy-M-d',
  mediumTime: 'H:mm:ss',
  short: 'yy-M-d ah:mm',
  shortDate: 'yy-M-d',
  shortTime: 'ah:mm'
}
locate.SHORTMONTH = locate.MONTH
dateFilter.locate = locate
