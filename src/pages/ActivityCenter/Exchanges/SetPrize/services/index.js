import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';

// 列表
export async function getList(params) {
  return request(`${_baseApi}/activity/accum/prizeList`, {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getInfo(params) {
  return request(`${_baseApi}/activity/accum/prizeInfo`, {
    method: 'POST',
    body: params,
  });
}

// 新增
export async function addPrize(params) {
  return request(`${_baseApi}/activity/accum/addPrize`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function editPrize(params) {
  return request(`${_baseApi}/activity/accum/updatePrize`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deletePrize(params) {
  return request(`${_baseApi}/activity/accum/deletePrize`, {
    method: 'POST',
    body: params,
  });
}

// 获取档位select
export async function getPrizeSelect(params) {
  return request(`${_baseApi}/activity/accum/prize/getAllSelect/${params.activityId}`, {
    method: 'GET',
  });
}

// 获取红包默认图片
export async function getDefaultImage(params) {
  return request(`${_baseApi}//activity/accum/redAccumEnvelope`, {
    method: 'POST',
    body: params,
  });
}
