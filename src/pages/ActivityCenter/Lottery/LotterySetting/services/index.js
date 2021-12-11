import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/activityPrize/list', {
    method: 'POST',
    body: params
  });
}


//   改变数据状态
export async function statusChangeManage(params) {
  return request(_baseApi + '/user/update', {
    method: 'POST',
    body: params
  });
}

export async function deleteData(params) {
  return request(_baseApi + '/activityPrize/delete', {
    method: 'POST',
    body: params
  });
}

//   添加
export async function addManage(params) {
  return request(_baseApi + '/activityPrize/add', {
    method: 'POST',
    body: params
  });
}
//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/activityPrize/update', {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/activityPrize/info', {
    method: 'POST',
    body: params
  });
}

//   修改
export async function modifyStock(params) {
  return request(_baseApi + '/activityPrize/inventoryChange', {
    method: 'POST',
    body: params
  });
}


// 获取发放主体
export async function getDistribution(params) {
  return request(_baseApi + '/activityPrize/getAllSelect', {
    method: 'GET'
  });
}

//  排序
export function sortList(params) {
  return request(_baseApi + '/activityPrize/sort', {
    method: 'POST',
    body: params
  });
}


//  获取默认的图片地址
export function getDefaultImage() {
  return request(_baseApi + '/activityPrize/redEnvelopeImg', {
    method: 'POST',
    body: {}
  });
}
