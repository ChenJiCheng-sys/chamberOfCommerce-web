import axios from 'axios';
import router from '../router';
import { Loading, Message } from 'element-ui';

const apiHost = 'http://192.168.8.147:9000/';

const service = axios.create({
  baseURL: apiHost, // api 的 base_url
  timeout: 15000 // 请求超时时间
})

let loadingInstance;

service.interceptors.request.use(function (config) {
	loadingInstance = Loading.service({});
	config.headers['token'] = localStorage.getItem('token');
	return config;
})

// 响应拦截  401 token过期处理
service.interceptors.response.use(
	function (response) {
		loadingInstance.close();
		if(response.status == 200){
			if (response.data.code == 200) {
				return response.data;
			}else if(response.data.code == 401){
				return router.push('/login');
			}else {
				Message.error(response.data.msg);
				return Promise.reject(error);
			}
		}
		Message.error(response.status);
		return Promise.reject(error);
	},
	//接口错误状态处理，也就是说无响应时的处理
	function (error){
		loadingInstance.close();
		Message.error('网络连接失败');
		return Promise.reject(error);
	}
);

export default service;