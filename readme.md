# 常用的web工具集合

## auth
权限组件，对路径进行检查，并返回匹配的角色数组

使用示例
```javascript
import Auth from 'luck7-webtools/auth'

const config = { // config也可以是Promise
  whiteList: ['/login'],
  roles: {
    user: /^\/admin\/news[/]?/,
    mannage: /^\/admin[/]?/,
    super: /^\/admin\/setting[/]?/
  }
}
// const config = ajax('role', {}).then(res => {
//   return {
//     whiteList: ['/login'],
//     roles: res.roles
//   }
// })

const auth = new Auth(config)

export default auth
```

跟vue-router结合的检查方法示例

```javascript
import auth from './auth'
/**
 * 检查是不是拥有某个权限
 * @param {array} roles 要查询的角色，如['mannage','user']
 * @return {true|vueRoute} 如果拥有所有权限，返回true，否则返回不符合的权限要跳到的路由
 */
function check (roles) {
  if (roles === undefined) return true
  const noLogin = window.sessionStorage.getItem('userid') === null
  if (roles.indexOf('mannage') > -1) {
    // 判断是不是管理员
    const isAdmin = window.sessionStorage.getItem('role') === 'admin'
    return !noLogin && isAdmin ? true : {name: 'denied'}
  } else {
    // 判断是不是已经登陆
    return noLogin ? {path: '/login'} : true
  }
}
const checkAuth = function (path, callback) {
  auth.getAuth(path).then(role => {
    if (role === true) {
      callback(true)
    } else {
      callback(check(role))
    }
  })
}
router.beforeEach((to, from, next) => {
  checkAuth(to.fullPath, next)
})
```
## bom
常用浏览器自带方法的集合
```javascript
import {openWindow} from 'luck7-webtools/bom'
// openWindow(url, title, w, h)
openWindow('http://www.google.com', 'google', 500, 400)
```

## cache
可以根据请求参数缓存函数执行结果
```javascript
import cache from 'luck7-webtools/cache'
function test (i) {
  return i + Math.random()
}
class Demo1 {
  constructor (config) {
    this.config = config
  }
  test (i) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(test(i + 5)), this.config.delay)
    })
  }
}
var a1 = new Demo1({delay: 1000})
var b1 = cache(test, 3000)
var a2 = cache(a1.test.bind(a1), 5000)

a1.test(3).then(res => console.log(res))
// 8.442179866889822
setTimeout(() => a1.test(3).then(res => console.log(res)), 1000)
// 8.745571849291068
console.log(b1(3))
// 3.2365098725515358
setTimeout(() => console.log(b1(3)), 1000)
// 3.2365098725515358
setTimeout(() => console.log(b1(3)), 3500)
// 3.4376061338653397
a2(3).then(res => console.log(res))
// 8.207727726819655
setTimeout(() => a2(3).then(res => console.log(res)), 3500)
// 8.207727726819655
```
## cookie
对cookie管理的封装
```javascript
import CookieManager from 'luck7-webtools/cookie'

const cookie = new CookieManager()

cookie.set('key1', 'vaule1')
cookie.set(
  'key2', // key
  'vaule2', // value
  { // options, 可不填
    expires: '3s', // eg: '1d5h33m4s' 可不填，默认为浏览器生命周期
    path: '/',
    // domain: ''
  }
)
console.log('1', cookie.get('key2'))
// 1 vaule2

setTimeout(() => console.log('2', cookie.get('key2')), 3500)
// 2 undefined

console.log('3', cookie.get('key1'))
// 3 vaule1
cookie.del('key1')
console.log('4', cookie.get('key1'))
// 4 undefined
```
## dom

## encoder
字符编码相关的处理类
```javascript
import {Byte, Utf8, Base64} from 'luck7-webtools/encoder'

var a1 = Byte.parse('hello 中国 Ã')
// [104, 101, 108, 108, 111, 32, 228, 184, 173, 229, 155, 189, 32, 195, 131]
var b1 = Byte.stringfy(a1)
// 'hello 中国 Ã'
var a2 = Utf8.parse('hello 中国 Ã')
// 'hello ä¸­å½ Ã'
var b2 = Utf8.stringfy(a2)
// 'hello 中国 Ã'
var a3 = Base64.parse('hello 中国 Ã')
// aGVsbG8g5Lit5Zu9IMOD
var b3 = Base64.stringfy(a3)
// 'hello 中国 Ã'
```
## encrypt
```javascript
import Encrypt from 'luck7-webtools/encrypt'
const data = '12345678'

const encryptKey = 'zITcBljtpOdDmPvf'
// des、3des、aes的key都可以是string或object，string时，将使用默认的iv(0000000000000000)
const rsaKey = {
  public: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDpqqyq1JPEdb/KeF3BlvOBPkfL/eMg7LUn9EM2e99m2riuvyRsVFxeROyYq0M6713fr/sTQrPApkYvqPcXHn6evUywg9SM4Am5sBeC/GGA9pRY3QxZidzkDEGgSjrUgLL/DeZqYNswg2a0yGxY3E/eMnbFrMwPakx8gcnQ5kzLnbKkz++0P8dNPBbD0SON27tC+UucqhEZq2Q+AtahhgYYHVNCSk66OQSbuGRkG0zRyUX5069bJnckehvp/s4MwUA85oE6HB6pMfgxcl/siwFrvr/jcsqdq8txdvA0GbEBUhRejG/pQK1Bz+gNqb1WRdhrPopEhm6oE/PduK3GaVR3 testkey',
  // private可以不指定，只是无法进行解密和签名
  private: `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA6aqsqtSTxHW/ynhdwZbzgT5Hy/3jIOy1J/RDNnvfZtq4rr8k
bFRcXkTsmKtDOu9d36/7E0KzwKZGL6j3Fx5+nr1MsIPUjOAJubAXgvxhgPaUWN0M
WYnc5AxBoEo61ICy/w3mamDbMINmtMhsWNxP3jJ2xazMD2pMfIHJ0OZMy52ypM/v
tD/HTTwWw9Ejjdu7QvlLnKoRGatkPgLWoYYGGB1TQkpOujkEm7hkZBtM0clF+dOv
WyZ3JHob6f7ODMFAPOaBOhweqTH4MXJf7IsBa76/43LKnavLcXbwNBmxAVIUXoxv
6UCtQc/oDam9VkXYaz6KRIZuqBPz3bitxmlUdwIDAQABAoIBAGPU57CU4g0twaNf
ia8MLz0ovsQI1OFcQImxcoX0pp3rFLyULZua71vXVr5jbXXgjtri9QJlnSbR42q5
Zdgazz5C4mEH8ee+UGllMqZj7cSLlRXiW0RmAlnsYp15GWlxEwilh6wrdXpkqZzT
hHbyqazlIpmSGhz77XHEgdUej/DtviMr5Si9mgYAlWnoBLJ/DW0RnPzuzRXiMeb3
31/CmjIj236pLg5osfh0hC77gxjnalxrOszUUz66w7v4C25X/i/rHxtASgBsKoX5
m5Bp04n0SJuoeREpwGLkxJUaYm71jq2kylaM3qwbPUh7EOCr3ABwbYoxEiSTooGh
Ori2kAECgYEA/c5BOuhwzSslis19RwS83cN+HzG4RL9hcgx4lsMHeDPX3v2fph4W
FZucbfaxhveKjmVv5Xg5gMbNSw2Hv2Pb1qBwjVV1eBiNqtsYRM3kRvv+x3EcBd4s
5TBqBGOfRNUbHQuNvS3v2XYXHMocYTEbAcz/pACzqoqCLRiqr4jOfEECgYEA66/Y
ppBkKcoSyQOES3ho4vItjNVVLlI/7W24avQgZspAEC+PCmfZyYpvqzRdUc69E/9G
BtBa9/J3QLVMkRaUQXTg5X+4KCrqtjRgPGGZ0alQn6bYexQF6C+928dq/l986YtI
f93rZ1Dlw599VEjkEQUeAPApG7BjMV0oW6BWArcCgYEA9q8Ls4fMa32uRZSoWOh/
8UNbSFJ4+UjSG5mHc3Enx2sMPA5ip4DCkknm5vJJZhcfMnvhIDWUHlgbnQEPmbQj
Lh5OhvAy9oFW4GOG2QkNAPlYjtyfEgz5seE2igGSAcLnUXmzT9ZgMwqWOEMxBj5G
M5/eMLcF6ZIqKE67R1U+7IECgYEAgoWhz6yLK/Fyscu2yizmuTgxLZs/TyXRrWVk
CickgohjLhOIfdTBcbGu4ftf6tw5Lgfi+gcNOd8XV8iPnJIKjK1zluVCUUxjK4Ca
AxZyHwBLW/8ESDTwiINX+4zWngS3ooa2Icn+gfr1I38B41lypFJXKWHXAjSO2lmi
7gs/VsUCgYEAp7MQjbe+81q8oymvhc+ITd66ayP/ojaEbK94ZawMtKp0q/sfJzK1
S1NievCLfyqnu0zpB0kEM9VfQ++g63VOPWzcKhMT0gvu0Znx6AxgAhJuKiZbbGE8
3M7LDWITs5EABZRcYia8lO8uDYlD2eOGd3UIy7q29L+QSCF9PNYXIgA=
-----END RSA PRIVATE KEY-----
  `
}

// 计算md5
const le1 = new Encrypt('md5')
console.log(le1(data))
// 25d55ad283aa400af464c76d713c07ad
// 计算sha1
const le2 = new Encrypt('sha1')
console.log(le2(data))
// 7c222fb2927d828af22f592134e8932480637c0d

// 所有的加解密方法，key都可以在创建的时候指定，也可以创建完后用setKey来指定/重置key。
// 进行aes加解密
const le3 = new Encrypt('aes', encryptKey, {iv: '0102030405060708'})
const res3 = le3.encrypt(data)
console.log('aes', res3, le3.decrypt(res3))
// 进行des加解密
const le4 = new Encrypt('des', encryptKey)
const res4 = le4.encrypt(data)
console.log('des', res4, le4.decrypt(res4))
// 进行3des加解密
const le5 = new Encrypt('3des', encryptKey)
const res5 = le5.encrypt(data)
console.log('3des', res5, le5.decrypt(res5))
// 进行rsa加解密
const le6 = new Encrypt('rsa')
le6.setSignType('sha1') // 设置签名的哈希方式，支持sha1和md5
le6.setKey(rsaKey)
const res6 = le6.encrypt(data)
console.log('rsa', res6, le6.decrypt(res6))
const signData = le6.sign(data)
console.log('rsa sign', signData, le6.verify(data, signData))
```

## eventdom

```js
import EventDom from 'luck7-webtools/eventdom'

var myEvent = new EventDom(document.body, 'mydata')

const listen1 = function (event) {
  console.log('mydata1')
}
myEvent.addListener(listen1)

myEvent.addListener(function (event) {
  console.log('mydata2')
})
const listen3 = myEvent.addListener(function (event) {
  console.log('mydata3')
})
myEvent.addListener('custom', function (event) {
  console.log('mydata4')
}, true)

// 多个接受方法
myEvent.dispatch({aa: 'bb'})
// mydata1 mydata2 mydata3

// 移除后再次执行，按方法移除
myEvent.removeListener(listen1)
myEvent.dispatch({aa: 'bb'})
// mydata2 mydata3

// 移除后再次执行，按ID移除
myEvent.removeListener(listen3)
myEvent.dispatch({aa: 'bb'})
// mydata2

// 只执行一次的方法
myEvent.dispatch('custom', {cc: 'dd'})
// mydata4
myEvent.dispatch('custom', {cc: 'dd'})
// no result
```
## mock
通过前端实现的模拟数据,模拟数据文件位于``@/mock``目录
```javascript
import mock from 'luck7-webtools/mock'
import flyio from 'flyio'
const ajax = mock(flyio) // axios.instance
export default ajax
```
mock文件示例
```javascript
export default {
  // time_cost: 200,
  status: 200,
  header: {},
  data: {
    code: 0,
    data: [{status: '已取消', id: 17593, creatdate: '2011-10-11 04:36:39', no: 2584.56}]
  }
}
```
## pinyin
汉字转拼音，拼音转汉字(不支持多音字)
```javascript
import Pinyin from 'luck7-webtools/pinyin'

const py = new Pinyin('normal')
py.convertPY('你好中国')
// ["ni", "hao", "zhong", "guo"]
py.convertFirstPY('你好中国')
// "nhzg"
py.convertHZ('hao')
// ["号", "好", "耗", "浩", "毫", "豪", "壕", "嚎"]
```
## store

```javascript
import StorageManager from 'luck7-webtools/store'
const session = new StorageManager(window.sessionStorage)
const local = new StorageManager(window.localStorage)
// get,set,del,clean
```