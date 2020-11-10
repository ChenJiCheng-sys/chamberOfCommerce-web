import axios from '../utils/axios.js';

export function getSysUser(data) {
  return axios({
    url: 'api/sys/user/list',
    method: 'get',
    params: data
  })
}

export function createSysUser(data) {
  return axios({
	  url: 'api/sys/user/create',
	  method: 'post',
	  params: data,
	  header: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

export function deleteSysUser(data) {
  return axios({
    url: `api/sys/user/delete`,
    method: 'delete',
    params: data
  })
}

export function updateSysUser(data) {
  return axios({
    url: `api/sys/user/update`,
    method: 'put',
    params: data,
    header: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}