import axios from '../utils/axios.js';
import qs from 'qs';

export function getSysRole(data) {
  return axios({
    url: 'api/sys/role/list',
    method: 'get',
    params: data
  })
}

export function createSysRole(data) {
  return axios({
	  url: 'api/sys/role/create',
	  method: 'post',
	  params: data,
	  header: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

export function deleteSysRole(data) {
  return axios({
    url: `api/sys/role/delete`,
    method: 'delete',
    params: data
  })
}

export function updateSysRole(data) {
  return axios({
    url: `api/sys/role/update`,
    method: 'put',
    data: qs.stringify(data),
    header: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}