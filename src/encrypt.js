import RSAEncrypt from './encrypt/rsa'
import OtherEncrypt from './encrypt/others'

function Encrypt (type, key) {
  const useType = type.toUpperCase()
  const encryptObj = useType === 'RSA' ? new RSAEncrypt() : new OtherEncrypt(useType, key)
  const hashMethod = ['MD5', 'SHA1']
  // const encryptMethod = ['RSA', 'AES', 'DES']
  if (hashMethod.includes(useType)) {
    return (str) => encryptObj.digest(str)
  } else {
    return encryptObj
  }
}

export default Encrypt
