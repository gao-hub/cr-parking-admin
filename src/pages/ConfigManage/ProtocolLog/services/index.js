import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/protocolLog/list', {
    method: 'POST',
    body: params
  });
}

//   添加
export async function addManage(params) {
  return request(_baseApi + '/protocolLog/add', {
    method: 'POST',
    body: params
  });
}

//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/protocolLog/update', {
    method: 'POST',
    body: params
  });
}

//   删除
export async function deleteManage(params) {
  return request(_baseApi + '/protocolLog/delete', {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/protocolLog/info', {
    method: 'POST',
    body: params
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/protocolLog/export', {
    method: 'POST',
    body: params
  });
}
