/* eslint-disable */
import Axios from 'axios'
// 在创建实例时设置配置默认值
const instance = Axios.create({
	baseURL: '',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
	timeout: 10000
	// withCredentials:true
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
	// 在发送请求之前做某事
	console.log(config)
	return config;
},function (error) {
	// 请求错误时做些事
	console.log(error)
	return Promise.reject(error);
});

//添加响应拦截器
instance.interceptors.response.use(function(response){
  // loadinginstace.clear()
  if (response.status === 200) {
		response = response.data;
  }
  return response;
},function(error){
	// 请求错误时做些事
	if (error.message.indexOf('timeout') >= 0) {

	}else{
			
	}
	console.log(error)
	return Promise.reject(error);
});
export default instance;
