import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/activityRedPacket/list', {
    method: 'POST',
    body: params
  });
}


//   改变数据状态
export async function statusChangeManage(params) {
  return request(_baseApi + '/activityRedPacket/use', {
    method: 'POST',
    body: params
  });
}

export async function deleteData(params) {
  return request(_baseApi + '/activityRedPacket/delete', {
    method: 'POST',
   body: params
  });
}

//   添加
export async function addManage(params) {
  return request(_baseApi + '/activityRedPacket/add', {
    method: 'POST',
    body: params
  });
}
//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/activityRedPacket/update', {
    method: 'POST',
    body: params
  });
}

