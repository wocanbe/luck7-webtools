
import isString from 'lodash/isString'
import CryptoJS from 'crypto-js'
import JSEncrypt from 'luck7-webtools/libs/jsencrypt'

/*
the keys of CryptoJS
  lib, enc, algo, x64, MD5, HmacMD5,
  SHA1, HmacSHA1, SHA256, HmacSHA256,
  SHA224, HmacSHA224, SHA512, HmacSHA512,
  SHA384, HmacSHA384, SHA3, HmacSHA3,
  RIPEMD160, HmacRIPEMD160, PBKDF2, EvpKDF,
  mode, pad, format, kdf, AES, DES, TripleDES,
  RC4, RC4Drop, Rabbit, RabbitLegacy
*/
const rObj = Symbol('rObj')
const sign = Symbol('sign')
class RSAObj {
  constructor (key, signType) {
    this[rObj] = new JSEncrypt()
    if (key) this.setKey(key)
    if (signType) this.setSignType(signType)
  }
  setKey (key) {
    if (key.public) {
      if (isString(key.public)) this[rObj].setPublicKey(key.public)
      else throw new Error('公钥类型错误')
    }
    if (key.private) {
      if (isString(key.private)) this[rObj].setPrivateKey(key.private)
      else throw new Error('私钥类型错误')
    }
  }
  setSignType (signType) {
    const hashMethod = ['md5', 'sha1']
    if (isString(signType)) {
      const useHash = signType.toLowerCase()
      if (hashMethod.includes(useHash)) this[sign] = useHash
      else throw new Error('错误的签名类型' + signType)
    } else throw new Error('签名类型错误')
  }
  encrypt (str) {
    return this[rObj].encrypt(str)
  }
  decrypt (str) {
    return this[rObj].decrypt(str)
  }
  /**
   * 签名
   * @param {*} str string
   * @param {*} hashType string md5 or sha1
   */
  sign (str) {
    // md2, md5, sha1, sha224, sha256, sha384, sha512, ripemd160
    if (this[sign]) return this[rObj].sign(str, CryptoJS[this[sign].toUpperCase()], this[sign])
  }
  /**
   * 验证签名
   * @param {*} str string
   * @param {*} signature string
   */
  verify (str, signature) {
    if (this[sign]) return this[rObj].verify(str, signature, CryptoJS[this[sign].toUpperCase()])
  }
}

export default RSAObj

