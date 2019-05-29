import wurl from 'wurl'

let context
function loadMockData (file) {
  return context('.' + file + '.js').default
}

function mockRequest (req) {
  let filePath = wurl('hostname', req.url) + wurl('path', req.url)
  // this.instance.lock() // 锁定当天实例，后续请求会在拦截器外排队
  return new Promise((resolve, reject) => {
    // 尝试根据请求路径精确匹配,并获取对应的模拟数据配置文件
    try {
      const mockRes = loadMockData(filePath)
      if (mockRes) {
        console.info('Use mock:', '@/mock' + filePath + '.js')
        const timeout = req.timeout || 240000
        const timeCost = mockRes.time_cost || 0
        if (timeout > timeCost) {
          setTimeout(() => {
            if (mockRes.status >= 200 && mockRes.status < 300) {
              resolve(mockRes)
            } else {
              reject(mockRes)
            }
          }, timeCost)
        } else {
          setTimeout(() => {
            reject(new Error(`timeout of ${timeout}ms exceeded`))
          }, timeout)
        }
      } else {
        resolve(req)
      }
    } catch (e) {
      resolve(req)
    }
  })
}
function install (instance) {
  if (process.env.NODE_ENV === 'development') {
    context = require.context('@/mock', true, /\.js$/)
    instance.interceptors.request.use(mockRequest)
  }
}

export default install
