import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/activity/list', {
    method: 'POST',
    body: params
  });
}


//   改变数据状态
export async function statusChangeManage(params) {
  return request(_baseApi + '/activity/status', {
    method: 'POST',
    body: params
  });
}

export async function deleteData(params) {
  return request(_baseApi + '/activity/delete', {
    method: 'POST',
   body: params
  });
}

//   添加
export async function addManage(params) {
  return request(_baseApi + '/activity/add', {
    method: 'POST',
    body: params
  });
}
//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/activity/update', {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/activity/info', {
    method: 'POST',
    body: params
  });
}

// 获取活动模板列表
export async function activityTemList(params) {
  return request(_baseApi + '/user/list', {
    method: 'POST',
    body: params
  });
}
