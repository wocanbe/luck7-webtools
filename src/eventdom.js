import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'

const ele = Symbol()
const dataEvent = Symbol()
const listeners = Symbol()

let idCounter = 0
function getEventId() {
  var id = ++idCounter
  return 'domEvent' + id
}
function bindEvent (dom, eventType, listeners) {
  const eventFun = event => {
    const {eventType, data} = event.detail
    if (listeners[eventType]) {
      const typeEvents = listeners[eventType]
      for (var listener in typeEvents) {
        typeEvents[listener].fun(data)
        if (typeEvents[listener].once) delete typeEvents[listener]
      }
    }
  }

  if (dom.bindEvent) {
    // 防止重复绑定，如已绑定过，解除绑定
    if (dom.bindEvent[eventType]) dom.removeEventListener(eventType, dom.bindEvent[eventType])
    // 关联对象，并绑定事件
    dom.bindEvent[eventType] = eventFun
    dom.addEventListener(eventType, eventFun)
  } else {
    // 未绑定过，创建对象，并绑定事件
    dom.bindEvent = {[eventType]: eventFun}
    dom.addEventListener(eventType, eventFun)
  }
}

class EventDom {
  constructor (dom = window, eventType = 'lyData') {
    this[dataEvent] = eventType
    this[listeners] = {}
    window.rrrrr = this[listeners]
    bindEvent(dom, eventType, this[listeners])
    this[ele] = dom
  }
  /**
   * 添加事件绑定
   * @param {String} type 事件类型，可选，默认default
   * @param {Function} fun 事件，必选
   * @param {Boolean} once 是否只执行一次，可选
   * @returns {String} 事件ID
   */
  addListener(type, fun, once) {
    const eventId = getEventId()
    let eventType, eventObj
    if (arguments.length === 1) {
      eventType = 'default'
      eventObj = {fun: type}
    } else if (arguments.length === 2) {
      eventType = type || 'default'
      eventObj = {fun}
    } else {
      eventType = type || 'default'
      eventObj = {once, fun}
    }

    if (this[listeners][eventType]) {
      this[listeners][eventType][eventId] = eventObj
    } else {
      this[listeners][eventType] = {[eventId]: eventObj}
    }
    return eventId
  }
  /**
   * 移除事件监听
   * @param {String} type 事件类型，可选，默认default
   * @param {String,Function} fun 要移除的事件(事件ID)，必选
   */
  removeListener (type, fun) {
    let eventType, eventId
    if (arguments.length === 1) {
      eventType = 'default'
      eventId = type
    } else {
      eventType = type
      eventId = fun
    }
    const eventTypes = this[listeners][eventType]
    if (isFunction(eventId)) {
      for (const key in eventTypes) {
        if (eventTypes[key].fun === eventId) {
          eventId = key
          break
        }
      }
    }
    if (isString(eventId)) delete eventTypes[eventId]
  }
  /**
   * 触发事件
   * @param {String} type 事件类型，可选，默认default
   * @param {*} data 参数，必选
   */
  dispatch (type, data) {
    let eventParams = {}
    if (arguments.length === 1) {
      eventParams['eventType'] = 'default'
      eventParams['data'] = type
    } else if (arguments.length === 2) {
      eventParams['eventType'] = type || 'default'
      eventParams['data'] = data
    }
    this[ele].dispatchEvent(new CustomEvent(this[dataEvent], {detail: eventParams}))
  }
}
export default EventDom
