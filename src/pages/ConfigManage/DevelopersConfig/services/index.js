import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function fetchList(params) {
  return request(`${_baseApi}/developers/list`, {
    method: 'POST',
    body: params
  });
}

//   添加
export async function addManage(params) {
  return request(_baseApi + '/developers/add', {
    method: 'POST',
    body: params
  });
}

export async function checkDeveloperName(params) {
  return request(`${_baseApi}/developers/checkname`, {
    method: 'POST',
    body: params
  });
}

//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/developers/update', {
    method: 'POST',
    body: params
  });
}

//   删除
export async function deleteManage(params) {
  return request(_baseApi + '/developers/delete', {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/developers/info/'+ params.id, {
    method: 'POST',
    // body: params
  });
}

//     启用/禁用
export async function updateManage(params) {
  return request(_baseApi + '/developers/openstatus', {
    method: 'POST',
    body: params
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/developers/export', {
    method: 'POST',
    body: params
  });
}
