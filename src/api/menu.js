import axios from '../utils/axios.js';

export function getMenu(data) {
  return axios({
    url: 'api/sys/menu/list',
    method: 'get',
    params: data
  })
}

export function createMenu(data) {
  return axios({
	  url: 'api/sys/menu/create',
	  method: 'post',
	  params: data,
	  header: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

export function deleteMenu(data) {
  return axios({
    url: `api/sys/menu/delete`,
    method: 'delete',
    params: data
  })
}

export function updateMenu(data) {
  return axios({
    url: `api/sys/menu/update`,
    method: 'put',
    params: data,
    header: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}