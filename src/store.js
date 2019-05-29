const isString = require('lodash/isString')

class StorageManager {
  constructor (storage) {
    this.storage = storage
  }
  get (key) {
    if (key === '') return null
    const sessionVal = this.storage.getItem(key)
    let backVal
    try {
      backVal = JSON.parse(sessionVal)
    } catch (e) {
      backVal = sessionVal
    }
    return backVal
  }
  set (key, value) {
    if (key === '') throw new Error('要存储storage的数据缺少key')
    if (isString(value)) {
      this.storage.setItem(key, value)
    } else {
      try {
        if (value === undefined) {
          this.storage.removeItem(key)
        } else {
          // 注意，一定要经过JSON.stringify，否则获取后JSON.parse会报错
          this.storage.setItem(key, JSON.stringify(value))
        }
      } catch (e) {
        throw new Error('JSON数据' + key + '格式错误')
      }
    }
  }
  del (key) {
    this.storage.removeItem(key)
  }
  clear (prefix) {
    if (!prefix) this.storage.clear()
    if (isString(prefix)) {
      for (let i = 0; i < this.storage.length; i++) {
        if (this.storage.key(i).indexOf(prefix) === 0) {
          this.storage.removeItem(this.storage.key(i))
        }
      }
    }
  }
}

export default StorageManager
