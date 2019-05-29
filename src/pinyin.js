import firstPYlibs from 'luck7-webtools/libs/pinyin/first'
import normalPYlibs from 'luck7-webtools/libs/pinyin/normal'
import fullPYlibs from 'luck7-webtools/libs/pinyin/full'
// 查找汉字对应拼音
function searchPY (libs, str, convertFirst) {
  for (let name in libs) {
    if (libs[name].indexOf(str) !== -1) {
      return convertFirst ? name.slice(0, 1) : name
    }
  }
  return false
}
const pinyinLib = Symbol('pinyinLib')
class Pinyin {
  constructor (libs) {
    if (libs) {
      if (libs === 'first') this[pinyinLib] = firstPYlibs
      else if (libs === 'normal') this[pinyinLib] = normalPYlibs
      else if (libs === 'full') this[pinyinLib] = fullPYlibs
      else this[pinyinLib] = libs
    } else {
      this[pinyinLib] = normalPYlibs
    }
  }
  convertPY (str) {
    let pinyin = []
    const reg = /[\u4e00-\u9fa5]/
    for (let i = 0; i < str.length; i++) {
      const val = str.charAt(i)
      if (reg.test(val)) {
        const name = searchPY(this[pinyinLib], val)
        if (name === false) continue
        pinyin.push(name)
      } else {
        pinyin.push(val)
      }
    }
    return pinyin
  }
  convertFirstPY (str) {
    let pinyin = ''
    const reg = /[\u4e00-\u9fa5]/
    for (let i = 0; i < str.length; i++) {
      const val = str.charAt(i)
      if (reg.test(val)) {
        const name = searchPY(this[pinyinLib], val, true)
        if (name === false) continue
        pinyin += name
      } else {
        pinyin += val
      }
    }
    return pinyin
  }
  convertHZ (str) {
    return this[pinyinLib][str].split('') || []
  }
}
export default Pinyin
