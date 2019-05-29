import memoize from 'lodash/memoize'
import hash from 'hash-sum'
function catchMode (fun, catchTime) {
  const memFun = memoize(fun, () => 'r') // r保存最后一次执行的缓存
  memFun.cache.set('k', [])
  function updateCache (k, n) { // k:要更新的key，n:要删除的时间点，该时间点之前的key全部删除掉
    const saved = memFun.cache.get('k') // 获取已经缓存值的key数组
    const save = [k]
    for (let s in saved) {
      let sk = saved[s]
      if (sk === k) continue
      const res = memFun.cache.get(sk)
      if (res.t < n) memFun.cache.delete(sk) // 如果已经超过约定时间，删除该key
      else save.push(sk)
    }
    memFun.cache.set('k', save)
    memFun.cache.set(k, {r: memFun.cache.get('r'), t: n + backFun.catchTime})
    memFun.cache.delete('r') // 删除上次执行的缓存
  }
  const backFun = function () {
    const nowDate = (new Date()).getTime()
    const paramsHash = hash(arguments)
    const cacheRes = memFun.cache.get(paramsHash)
    if (cacheRes && cacheRes.t >= nowDate) {
      return cacheRes.r
    }
    const runRes = memFun(...arguments)
    updateCache(paramsHash, nowDate)
    return runRes
  }
  backFun.catchTime = catchTime
  return backFun
}
export default catchMode
