import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken, getRefreshToken } from '@/utils/auth'
import qs from 'qs'
import router from '../router'

axios.defaults.headers["Content-Type"] = "application/json";

//用来处理刷新token后重新请求的自定义变量
axios.defaults.isRetryRequest = false
// 创建axios实例
const service = axios.create({
  baseURL: '', // api 的 base_url
  timeout: 5000 // 请求超时时间
})

function refreshToken() {
  let params = {
    grant_type: 'refresh_token',
    refresh_token: getRefreshToken()
  };
  return axios({
    method: 'post',
    url: '/api/oauth/token',
    data: qs.stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: 'qun',
      password: 'qunsecret'
    }
  })
}


// request拦截器
service.interceptors.request.use(
  config => {
      if (store.getters.token) {
        config.headers['Authorization'] = 'Bearer ' + getToken()
      }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
 /*   const res = response.data
    console.log("==========="+res)
    if (res.code !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }*/

    return response
  },
  error => {
    if(error.response){
      if(error.response.status === 401){
        let config = error.config;
        store.dispatch('FedLogOut')
        if(!config.isRetryRequest){
         return  refreshToken().then( res => {
           const data = res.data
            store.dispatch('refreshToke',data)
            config.isRetryRequest = true;
            config.headers.Authorization = 'Bearer ' + data.access_token
            /*这边不需要baseURL是因为会重新请求url
             *url中已经包含baseURL的部分了
             *如果不修改成空字符串，会变成'api/api/xxxx'的情况*/
            config.baseURL = ''
            return axios(config)
          }).catch(() =>{
            store.dispatch('FedLogOut')
            router.replace({ path: 'login', query: {redirect: router.currentRoute.fullPath} })
            throw error
          })
        }
      }
    }else{
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
