/**
 * 打开新窗口
 * @param {Sting} url
 * @param {Sting} title
 * @param {Number} w
 * @param {Number} h
 */
export function openWindow (url, title, w, h) {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

  const left = ((width / 2) - (w / 2)) + dualScreenLeft
  const top = ((height / 2) - (h / 2)) + dualScreenTop
  const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}
export function getQueryParams (key) {
  let queryString = window.location.search
  if (!queryString || queryString.length === 0) {
    if (window.location.href.indexOf('?') > -1) {
      queryString = window.location.href.substr(window.location.href.indexOf('?'))
    }
  }
  if (queryString.length > 0) {
    if (key) {
      const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
      const r = queryString.substr(1).match(reg)
      return r === null ? null : decodeURI(r[2])
    } else {
      let result = null
      queryString.substr(1).split('&').forEach((temp) => {
        if (!result) result = {}
        let pair = temp.split('=')
        if (pair.length > 0) {
          result[pair[0]] = pair[1]
        }
      })
      return result
    }
  }
  return null
}