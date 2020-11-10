import axios from '../utils/axios.js';

export function login(data) {
  return axios({
	  url: 'api/sys/user/login',
	  method: 'post',
	  params: data,
	  header: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

export function logout() {
  return axios({
	  url: 'api/sys/user/logout',
	  method: 'post'
  })
}