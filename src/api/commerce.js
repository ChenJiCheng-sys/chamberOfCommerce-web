import axios from '../utils/axios.js';
import qs from 'qs';

export function getCommerce(data) {
  return axios({
    url: 'api/sys/commerce/list',
    method: 'get',
    params: data
  })
}

export function getCommerceDetail(data) {
  return axios({
    url: `api/sys/commerce/commerceDetail`,
    method: 'get',
    params: data
  })
}

export function createCommerce(data) {
  return axios({
	  url: 'api/sys/commerce/create',
	  method: 'post',
	  params: data,
	  header: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

export function updateCommerce(data) {
  return axios({
    url: `api/sys/commerce/update`,
    method: 'put',
    data: qs.stringify(data),
    header: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}