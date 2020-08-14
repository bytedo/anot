var rscripts = /<script[^>]*>([\S\s]*?)<\/script\s*>/gim
var ron = /\s+(on[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g
var ropen = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/gi
var rsanitize = {
  a: /\b(href)\=("javascript[^"]*"|'javascript[^']*')/gi,
  img: /\b(src)\=("javascript[^"]*"|'javascript[^']*')/gi,
  form: /\b(action)\=("javascript[^"]*"|'javascript[^']*')/gi
}

//https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
//    <a href="javasc&NewLine;ript&colon;alert('XSS')">chrome</a>
//    <a href="data:text/html;base64, PGltZyBzcmM9eCBvbmVycm9yPWFsZXJ0KDEpPg==">chrome</a>
//    <a href="jav	ascript:alert('XSS');">IE67chrome</a>
//    <a href="jav&#x09;ascript:alert('XSS');">IE67chrome</a>
//    <a href="jav&#x0A;ascript:alert('XSS');">IE67chrome</a>
export function xss(str) {
  return str.replace(rscripts, '').replace(ropen, function(a, b) {
    var match = a.toLowerCase().match(/<(\w+)\s/)
    if (match) {
      //处理a标签的href属性，img标签的src属性，form标签的action属性
      var reg = rsanitize[match[1]]
      if (reg) {
        a = a.replace(reg, function(s, name, value) {
          var quote = value.charAt(0)
          return name + '=' + quote + 'javascript:void(0)' + quote // jshint ignore:line
        })
      }
    }
    return a.replace(ron, ' ').replace(/\s+/g, ' ') //移除onXXX事件
  })
}
