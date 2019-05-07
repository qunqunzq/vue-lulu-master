import { logout, getInfo } from '@/api/login'
import { getToken,setToken, removeToken,setRefreshToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: '',
    refresh_token:'',
    userId:'',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_REFRESH_TOKEN: (state,refreshToken) => {
      state.refresh_token = refreshToken
    },
    SET_USER_ID: (state,userId) => {
      state.userId = userId
    }
  },

  actions: {
    // 登录
    Login({ commit }, loginInfo) {
      return new Promise((resolve) => {
        const data = loginInfo
        setToken(data.access_token)
        setRefreshToken(data.refresh_token)
        commit('SET_TOKEN', data.access_token)
        commit('SET_REFRESH_TOKEN', data.refresh_token)
        resolve()
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.username)
          commit('SET_USER_ID', data.id)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', '')
          commit('SET_USER_ID', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
