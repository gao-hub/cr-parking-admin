import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function fetchList(params) {
  // /accountRecharge/list
  return request(_baseApi + '/accountRecharge/list', {
    method: 'POST',
    body: params
  });
}

// 获取下拉框
export async function initSelect(params) {
  return request(_baseApi + '/account/getAllSelect', {
    method: 'GET'
  })
}

//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/accountRecharge/update', {
    method: 'POST',
    body: params
  });
}

//   同步
export async function asyncManage(params) {
  return request(_baseApi + '/accountRecharge/delete', {
    method: 'POST',
    body: params
  });
}


// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/accountRecharge/export', {
    method: 'POST',
    body: params
  });
}
