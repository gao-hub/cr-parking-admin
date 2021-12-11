import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function fetchList(params) {
  return request(_baseApi + '/ad/list', {
    method: 'POST',
    body: params,
  });
}


//   添加
export async function addManage(params) {
  return request(_baseApi + '/ad/add', {
    method: 'POST',
    body: params,
  });
}

//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/ad/update', {
    method: 'POST',
    body: params,
  });
}

//   删除
export async function deleteManage(params) {
  return request(_baseApi + '/ad/delete', {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/ad/info', {
    method: 'POST',
    body: params
  });
}

//    启用禁用
export async function updateStatus(params) {
  return request(_baseApi + '/ad/status', {
    method: 'POST',
    body: params,
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/poster/export', {
    method: 'POST',
    body: params,
  });
}
