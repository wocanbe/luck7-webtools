import CryptoJS from 'crypto-js'

const eType = Symbol('type')
const eKey = Symbol('key')
const eObj = Symbol('obj')
const eEnc = Symbol('enc')
const eOpts = Symbol('opts')
const allowEnc = ['utf8', 'latin1', 'hex', 'utf16', 'base64', 'utf16le']
const allowMode = ['cbc', 'cfb', 'ctr', 'ctr-gladman', 'ofb', 'ecb']
const allowPad = ['pkcs7', 'ansix923', 'iso10126', 'iso97971', 'zeropadding', 'nopadding']
function coverFirst (str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}
function getEnc (str) {
  if (!str) return coverFirst(allowEnc[0])
  if (allowEnc.includes(str.toLowerCase())) return str === 'utf16le' ? 'utf16LE' : coverFirst(str)
  else throw new Error('未知的编码方式' + str)
}
function getMode (str) {
  if (!str) return allowMode[0].toUpperCase()
  if (allowMode.includes(str.toLowerCase())) return str === 'ctr-gladman' ? 'CTRGladman' : str.toUpperCase()
  else throw new Error('未知的加密模式' + str)
}
function getPad (str) {
  if (!str) return coverFirst(allowPad[0])
  if (allowPad.includes(str.toLowerCase())) return coverFirst(str).replace('pa', 'Pa')
  else throw new Error('未知的填充方式' + str)
}

class Encrypt {
  constructor (type, key, options = {}) {
    this[eType] = type
    switch (type) {
      case '3DES':
        this[eObj] = CryptoJS.TripleDES
        break
      case 'AES': case 'DES': case 'MD5': case 'SHA1':
        this[eObj] = CryptoJS[type]
        break
      default:
        throw new Error('不支持的算法类型:' + this[eType])
    }
    this[eEnc] = CryptoJS.enc[getEnc(options.enc)] // 字符集
    this.setConfig(options)
    if (key) this.setKey(key)
  }
  setConfig (opts) {
    const enOpts = {}
    if (opts.mode) enOpts['mode'] = CryptoJS.mode[getMode(opts.mode)] // 加密模式
    if (opts.padding) enOpts['padding'] = CryptoJS.pad[getPad(opts.padding)] // 填充方式
    enOpts['iv'] = this[eEnc].parse(opts.iv || '0000000000000000') // 偏移量
    this[eOpts] = enOpts
  }
  setKey (key) {
    switch (this[eType]) {
      case 'AES': case 'DES': case '3DES':
        this[eKey] = this[eEnc].parse(key)
        break
    }
  }
  digest (str) {
    return this[eObj](str).toString()
  }
  encrypt (str) {
    const encodeChars = this[eObj].encrypt(
      this[eEnc].parse(str),
      this[eKey],
      this[eOpts]
    )
    return encodeChars.toString()
  }
  decrypt (str) {
    const bytes = this[eObj].decrypt(
      str,
      this[eKey],
      this[eOpts]
    )
    return bytes.toString(this[eEnc])
  }
}

export default Encrypt
