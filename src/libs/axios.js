import axios from 'axios'
import store from '@/store'
import { getToken} from '@/libs/util'
import router from '@/router'
import Cookies from 'js-cookie'

const noErrTips = ['notice/imgdelete']
// import { Spin } from 'iview'
// const addErrorLog = errorInfo => {
//   const { statusText, status, request: { responseURL } } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
// }

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl}
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      if(res.status == "200"){
        if(res.data.status == "401"){// token失效
          Cookies.remove('token')
          router.replace({
            name: 'login' // 到登录页重新获取token
          })
        }
        return res.data
      }else{
        return { data: res.data, status: res.status }
      }
    }, error => {
      if(noErrTips.indexOf(url) !== -1) return
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      return Promise.reject(error)
    })
  }
  request (options) {
    console.log('Authorization:' + getToken())
    const instance = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        //'Content-Type': 'application/json;charset=UTF-8',
        'Authorization' : getToken() || ''
      },
      timeout: 10000
    })
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
