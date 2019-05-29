/***
 * 默认的字符编码是utf8的string
 * parse方法将把utf8的string转化为指定类型数据/对象
 * stringify方法将把指定类型对象转化为utf8的string
 */
const base64Str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

const Byte = {
  parse (str) {
    let bytes = []
    let c
    for (let i = 0; i < str.length; i++) {
      c = str.charCodeAt(i)
      if (c >= 0x010000 && c <= 0x10FFFF) {
        bytes.push(((c >> 18) & 0x07) | 0xF0)
        bytes.push(((c >> 12) & 0x3F) | 0x80)
        bytes.push(((c >> 6) & 0x3F) | 0x80)
        bytes.push((c & 0x3F) | 0x80)
      } else if (c >= 0x000800 && c <= 0x00FFFF) {
        bytes.push(((c >> 12) & 0x0F) | 0xE0)
        bytes.push(((c >> 6) & 0x3F) | 0x80)
        bytes.push((c & 0x3F) | 0x80)
      } else if (c >= 0x000080 && c <= 0x0007FF) {
        bytes.push(((c >> 6) & 0x1F) | 0xC0)
        bytes.push((c & 0x3F) | 0x80)
      } else {
        bytes.push(c & 0xFF)
      }
    }
    return bytes
  },
  stringfy (arr) {
    if (typeof arr === 'string') {
      return arr
    }
    let str = ''
    let _arr = arr
    for (let i = 0; i < _arr.length; i++) {
      let one = _arr[i].toString(2)
      let v = one.match(/^1+?(?=0)/)
      if (v && one.length === 8) {
        let bytesLength = v[0].length
        let store = _arr[i].toString(2).slice(7 - bytesLength)
        for (let st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2)
        }
        str += String.fromCharCode(parseInt(store, 2))
        i += bytesLength - 1
      } else {
        str += String.fromCharCode(_arr[i])
      }
    }
    return str
  }
}

const Utf8 = {
  parse (string) {
    string = string.replace(/\r\n/g, '\n')
    let utftext = ''
    for (let n = 0; n < string.length; n++) {
      let c = string.charCodeAt(n)
      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
        // 如c=1327,则分解为20*64+47，其中1327>>6=20(相当于1327 mod 64=2^6)，1327&63 = 47(相当于1327%64=47)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }
    return utftext
  },
  stringfy (utftext) {
    let string = ''
    let i, c, c1, c2
    i = c = c1 = c2 = 0
    while (i < utftext.length) {
      c = utftext.charCodeAt(i)
      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if ((c > 191) && (c < 224)) {
        c1 = utftext.charCodeAt(i + 1)
        string += String.fromCharCode(((c & 31) << 6) | (c1 & 63))
        i += 2
      } else {
        c1 = utftext.charCodeAt(i + 1)
        c2 = utftext.charCodeAt(i + 2)
        string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63))
        i += 3
      }
    }
    return string
  }
}

const Base64 = {
  parse (input) {
    var output = ''
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4
    var i = 0
    input = Utf8.parse(input)
    while (i < input.length) {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)
      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63
      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }
      output = output +
      base64Str.charAt(enc1) + base64Str.charAt(enc2) +
      base64Str.charAt(enc3) + base64Str.charAt(enc4)
    }
    return output
  },
  stringfy (input) {
    var output = ''
    var chr1, chr2, chr3
    var enc1, enc2, enc3, enc4
    var i = 0
    input = input.replace(/[^A-Za-z0-9+/=]/g, '')
    while (i < input.length) {
      enc1 = base64Str.indexOf(input.charAt(i++))
      enc2 = base64Str.indexOf(input.charAt(i++))
      enc3 = base64Str.indexOf(input.charAt(i++))
      enc4 = base64Str.indexOf(input.charAt(i++))
      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4
      output = output + String.fromCharCode(chr1)
      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2)
      }
      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3)
      }
    }
    output = Utf8.stringfy(output)
    return output
  }
}

export {Byte, Utf8, Base64}
