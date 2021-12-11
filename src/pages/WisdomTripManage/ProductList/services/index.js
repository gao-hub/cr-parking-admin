import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 路途产品列表
export async function mockList(params) {
  return request(_baseApi + '/travelProduct/list', {
    method: 'POST',
    body: params,
  });
}

//   改变数据状态
export async function statusChangeManage(params) {
  return request(_baseApi + '/parkingRent/update', {
    method: 'POST',
    body: params,
  });
}

// 获取标签下拉框
export async function getAllSelect(params) {
  return request(`${_baseApi}/travelTab/select`, {
    method: 'POST',
    body: params
  });
}


// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/travelProduct/export', {
    method: 'POST',
    body: params,
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/poster/info/' + params.id, {
    method: 'POST',
  });
}


// 获取获取自动上架状态
export async function getAutoSale(params) {
  return request(`${_baseApi}/travelProduct/getSyncStatus`, {
    method: 'POST',
    body: params
  });
}

//    启用禁用
export async function updateAutoSale(params) {
  return request(_baseApi + '/travelProduct/synchronize', {
    method: 'POST',
    body: params,
  });
}

//    推荐
export async function updateRecommend(params) {
  return request(_baseApi + '/travelProduct/recommend', {
    method: 'POST',
    body: params,
  });
}

//    上下架
export async function updateSale(params) {
  return request(_baseApi + '/travelProduct/sale', {
    method: 'POST',
    body: params,
  });
}

//    改归属
export async function updateTag(params) {
  return request(_baseApi + '/travelProduct/tag', {
    method: 'POST',
    body: params,
  });
}
