/**
 * @number 必需，要格式化的数字
 * @decimals 可选，规定多少个小数位。
 * @thousands 可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的。
 */
export function numberFilter(number, decimals = 0, thousands = '') {
  var num = +number || 0
  var d = !isFinite(+decimals) ? 3 : Math.abs(decimals)
  var t = typeof thousands === 'string' ? thousands : ','
  var tmp

  tmp = ((d ? num.toFixed(d) : Math.round(num)) + '').split('.')
  if (tmp[0].length > 3) {
    tmp[0] = tmp[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, t)
  }

  return tmp.join('.')
}
