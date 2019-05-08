import Cookies from 'js-cookie'

const TokenKey = 'TokenKey'
const RefreshToken = "RefreshToken"

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshToken)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshToken, token,{ expires: 7 })
}

export function removeRefreshToken(token) {
  return Cookies.remove(RefreshToken)
}
