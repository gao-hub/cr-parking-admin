import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
// 秒杀活动列表
export async function getActivityList(params) {
  return request(`${_baseApi}/activity/listSeckill`, {
    method: 'POST',
    body: params,
  });
}

// 添加
export async function addActivity(params) {
  return request(_baseApi + '/activity/addSeckill', {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function editActivity(params) {
  return request(_baseApi + '/activity/updateSeckill', {
    method: 'POST',
    body: params,
  });
}

// 启用禁用
export async function changeStatus(params) {
  return request(_baseApi + '/activity/status', {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deleteActivity(params) {
  return request(_baseApi + '/activity/delete', {
    method: 'POST',
    body: params,
  });
}

// 商品详情
export async function infoSeckillList(params) {
  return request(_baseApi + '/activity/infoSeckillList', {
    method: 'POST',
    body: params,
  });
}

// 活动商品列表
export async function listHome(params) {
  return request(_baseApi + '/activity/listHome', {
    method: 'POST',
    body: params,
  });
}

// 获取商品分类列表
export async function getCategories(params) {
  return request(_baseApi + '/homeStoreCategory/selectStoreCategoryList', {
    method: 'POST',
    body: params,
  });
}

// 添加活动批次
export async function addSpikeBatch(params) {
  return request(_baseApi + '/activity/addSeckillGoods', {
    method: 'POST',
    body: params,
  });
}

// 获取多规格list
export async function getProductAttrValueList(params) {
  return request(_baseApi + '/activity/homeProductAttr', {
    method: 'POST',
    body: params,
  });
}