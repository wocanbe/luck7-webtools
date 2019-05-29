const isString = require('lodash/isString')
const isArray = require('lodash/isArray')
const isRegExp = require('lodash/isRegExp')

const authConfig = Symbol('authConfig')
const initStatus = Symbol('initStatus')
const authList = []

// 每个配置项的值都可以是数组，字符串或正则表达式，数组元素也可以是数组、字符串或正则表达式
function patternRole (path, role) {
  let checkRes = false
  if (isArray(role)) {
    for (const r in role) {
      checkRes = patternRole(path, role[r])
      if (checkRes) break
    }
  } else if (isRegExp(role)) {
    checkRes = role.test(path)
  } else if (isString(role)) {
    checkRes = role === path
  }
  return checkRes
}
class Auth {
  constructor (config) {
    if (config instanceof Promise) {
      this[initStatus] = false
      config.then(cfg => {
        this.init(cfg)
      })
    } else {
      this.init(config)
    }
  }
  init (config) {
    const localAuth = {whiteList: ['/login'], roles: {}}
    const {whiteList, roles} = config
    if (whiteList) {
      if (whiteList instanceof Promise) {
        whiteList.then(wl => {
          localAuth.whiteList = wl
        }).catch(err => {
          throw err
        })
      } else {
        localAuth.whiteList = whiteList
      }
    }
    if (roles) {
      if (roles instanceof Promise) {
        roles.then(rs => {
          localAuth.roles = rs
        }).catch(err => {
          throw err
        })
      } else {
        localAuth.roles = roles
      }
    }
    this[authConfig] = localAuth
    this[initStatus] = true
    while (authList.length > 0) {
      const r = authList.shift()
      this.getAuth(r.path).then(role => {
        r.ready(role)
      }).catch(e => {
        r.error(e)
      })
    }
  }
  getAuth (path) {
    if (this[initStatus]) {
      const pass = patternRole(path, this[authConfig].whiteList)
      if (pass) {
        return Promise.resolve(true)
      } else {
        const roles = []
        for (const key in this[authConfig].roles) {
          const hasAuth = patternRole(path, this[authConfig].roles[key])
          if (hasAuth) roles.push(key)
        }
        return Promise.resolve(roles)
      }
    } else {
      return new Promise((resolve, reject) => {
        authList.push({
          status: 'waiting',
          path,
          ready: resolve,
          error: reject
        })
      })
    }
  }
}
export default Auth
