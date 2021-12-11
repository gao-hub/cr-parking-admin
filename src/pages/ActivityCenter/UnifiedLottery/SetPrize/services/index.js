import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';

// 列表
export async function getList(params) {
  return request(`${_baseApi}/activityCodePrize/list`, {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getInfo(params) {
  return request(`${_baseApi}/activityCodePrize/info`, {
    method: 'POST',
    body: params,
  });
}

// 新增
export async function addPrize(params) {
  return request(`${_baseApi}/activityCodePrize/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function editPrize(params) {
  return request(`${_baseApi}/activityCodePrize/update`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deletePrize(params) {
  return request(`${_baseApi}/activityCodePrize/delete`, {
    method: 'POST',
    body: params,
  });
}

// 获取档位select
export async function getPrizeSelect() {
  return request(`${_baseApi}/activityCodePrize/getAllSelect`, {
    method: 'GET',
  });
  // return request(`${_baseApi}/activityCodePrize/getAllSelect/${params.activityId}`, {
  //   method: 'GET',
  // });
}

// 获取红包默认图片
export async function getDefaultImage(params) {
  return request(`${_baseApi}//activity/accum/redAccumEnvelope`, {
    method: 'POST',
    body: params,
  });
}
