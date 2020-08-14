if (!Date.prototype.getFullWeek) {
  //获取当天是本年度第几周
  Object.defineProperty(Date.prototype, 'getFullWeek', {
    value: function() {
      let thisYear = this.getFullYear()
      let that = new Date(thisYear, 0, 1)
      let firstDay = that.getDay() || 1
      let numsOfToday = (this - that) / 86400000
      return Math.ceil((numsOfToday + firstDay) / 7)
    },
    enumerable: false
  })

  //获取当天是本月第几周
  Object.defineProperty(Date.prototype, 'getWeek', {
    value: function() {
      let today = this.getDate()
      let thisMonth = this.getMonth()
      let thisYear = this.getFullYear()
      let firstDay = new Date(thisYear, thisMonth, 1).getDay()
      return Math.ceil((today + firstDay) / 7)
    },
    enumerable: false
  })
}

if (!Date.isDate) {
  Object.defineProperty(Date, 'isDate', {
    value: function(obj) {
      return typeof obj === 'object' && obj.getTime ? true : false
    },
    enumerable: false
  })
}

//时间格式化
if (!Date.prototype.format) {
  Object.defineProperty(Date.prototype, 'format', {
    value: function(str) {
      str = str || 'Y-m-d H:i:s'
      var week = ['一', '二', '三', '四', '五', '六', '日']
      var dt = {
        fullyear: this.getFullYear(),
        year: this.getYear(),
        fullweek: this.getFullWeek(),
        week: this.getWeek(),
        month: this.getMonth() + 1,
        date: this.getDate(),
        day: week[this.getDay()],
        hours: this.getHours(),
        minutes: this.getMinutes(),
        seconds: this.getSeconds()
      }
      var re

      dt.g = dt.hours > 12 ? dt.hours - 12 : dt.hours

      re = {
        Y: dt.fullyear,
        y: dt.year,
        m: dt.month < 10 ? '0' + dt.month : dt.month,
        n: dt.month,
        d: dt.date < 10 ? '0' + dt.date : dt.date,
        j: dt.date,
        H: dt.hours < 10 ? '0' + dt.hours : dt.hours,
        h: dt.g < 10 ? '0' + dt.g : dt.g,
        G: dt.hours,
        g: dt.g,
        i: dt.minutes < 10 ? '0' + dt.minutes : dt.minutes,
        s: dt.seconds < 10 ? '0' + dt.seconds : dt.seconds,
        W: dt.fullweek,
        w: dt.week,
        D: dt.day
      }

      for (let i in re) {
        str = str.replace(new RegExp(i, 'g'), re[i])
      }
      return str
    },
    enumerable: false
  })
}

export function dateFilter(stamp, format) {
  var oDate = stamp

  if (!Date.isDate(oDate)) {
    var tmp = +oDate
    if (tmp === tmp) {
      oDate = tmp
    }

    oDate = new Date(oDate)
    if (oDate.toString() === 'Invalid Date') {
      return 'Invalid Date'
    }
  }
  return oDate.format(str)
}
