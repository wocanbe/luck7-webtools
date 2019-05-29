function getExpires (str) {
  const exp = new Date()
  // let str = '1d5h33m4s'
  const dayReg = /(\d+)[dD]/
  const hourReg = /(\d+)[hH]/
  const minReg = /(\d+)[mM]/
  const secReg = /(\d+)[sS]/
  const dayPat = str.match(dayReg)
  const hourPat = hourReg.exec(str)
  const minPat = str.match(minReg)
  const secPat = str.match(secReg)
  if (dayPat) {
    exp.setDate(exp.getDate() + parseInt(dayPat[1]))
  }
  if (hourPat) {
    exp.setHours(exp.getHours() + parseInt(hourPat[1]))
  }
  if (minPat) {
    exp.setMinutes(exp.getMinutes() + parseInt(minPat[1]))
  }
  if (secPat) {
    exp.setSeconds(exp.getSeconds() + parseInt(secPat[1]))
  }
  return exp.toGMTString()
}
class CookieManager {
  get (key) {
    const value = document.cookie.split(';')
      .find(item => item.trim().indexOf(key + '=') === 0)
    return value ? unescape(value.trim().replace(key + '=', '')) : undefined
  }
  set (key, value, options) {
    let cookieStr = key + '=' + escape(value)
    if (options) {
      if (options.expires) { // 过期时间
        cookieStr += ';expires=' + getExpires(options.expires)
      }
      if (options.path) { // 路径
        cookieStr += ';path=' + options.path
      }
      if (options.domain) { // 域
        cookieStr += ';domain=' + options.domain
      }
    }
    // Secure – 安全
    document.cookie = cookieStr
  }
  /*
   * 删除cookie跟path和domain有关系，默认只能删除当前domain和path下的cookie，如果删除后父path或者父域还有同名cookie，则还能获得值
   */
  del (key, options) {
    const exp = new Date()
    exp.setTime(exp.getTime() - 1)
    let cookieStr = key + '=d;expires=' + exp.toGMTString()
    if (options) {
      if (options.path) { // 路径
        cookieStr += ';path=' + options.path
      }
      if (options.domain) { // 域
        cookieStr += ';domain=' + options.domain
      }
    }
    document.cookie = cookieStr
  }
}

export default CookieManager
