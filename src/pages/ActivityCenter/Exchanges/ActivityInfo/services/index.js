import request from '@/utils/request';
import {_baseApi} from '@/defaultSettings.js'

// 获取兑换活动详情
export async function getExchangeInfo(params) {
  return request(`${_baseApi}/activity/accum/info`, {
    method: 'POST',
    body: params
  })
}

// 兑换活动新增
export async function addExchange(params) {
  return request(`${_baseApi}/activity/accum/add`, {
    method: 'POST',
    body: params
  })
}

// 编辑兑换活动
export async function editExchange(params){
  return request(`${_baseApi}/activity/accum/update`, {
    method: 'POST',
    body: params
  })
}
