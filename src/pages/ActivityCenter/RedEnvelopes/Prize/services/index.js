import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/activityRedPacketPrize/list', {
    method: 'POST',
    body: params
  });
}

//   添加
export async function addManage(params) {
  return request(_baseApi + '/activityRedPacketPrize/add', {
    method: 'POST',
    body: params
  });
}

//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/activityRedPacketPrize/update', {
    method: 'POST',
    body: params
  });
}

//   删除
export async function deleteManage(params) {
  return request(_baseApi + '/activityRedPacketPrize/delete', {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/activityRedPacketPrize/info', {
    method: 'POST',
    body: params
  });
}



// 获取档位select
export async function getPrizeSelect() {
  return request(`${_baseApi}/activityPrize/getAllSelect`, {
    method: 'GET',
  });
}
