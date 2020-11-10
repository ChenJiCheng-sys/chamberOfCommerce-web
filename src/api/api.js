import axios from '../utils/axios.js';

export function getSysLog(data) {
  return axios({
    url: 'api/sys/log/list',
    method: 'get',
    params: data
  })
}
