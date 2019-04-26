/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const reg  =  /^[\u4e00-\u9fa5]+$/
  return  !reg.test(str.trim())
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
