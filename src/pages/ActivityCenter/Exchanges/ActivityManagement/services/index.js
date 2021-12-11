import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/activity/accum/page', {
    method: 'POST',
    body: params
  });
}


//   改变数据状态
export async function statusChangeManage(params) {
  return request(_baseApi + '/activity/accum/status', {
    method: 'POST',
    body: params
  });
}

export async function deleteData(params) {
  return request(_baseApi + '/activity/accum/delete', {
    method: 'POST',
   body: params
  });
}

//   添加
export async function addManage(params) {
  return request(_baseApi + '/activity/accum/add', {
    method: 'POST',
    body: params
  });
}
//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/activity/accum/update', {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/activity/accum/info', {
    method: 'POST',
    body: params
  });
}
