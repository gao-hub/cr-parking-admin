import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function fetchList(params) {
  return request(`${_baseApi  }/account/list`, {
    method: 'POST',
    body: params
  });
}

//   添加
export async function addManage(params) {
  return request(`${_baseApi  }/userAccount/add`, {
    method: 'POST',
    body: params
  });
}

//   修改
export async function modifyManage(params) {
  return request(`${_baseApi  }/userAccount/update`, {
    method: 'POST',
    body: params
  });
}
//   同步
export async function asyncManage(params) {
  return request(`${_baseApi  }/account/synchro/${params.id}`, {
    method: 'POST',
    body: params
  });
}
//   删除
export async function deleteManage(params) {
  return request(`${_baseApi  }/userAccount/delete`, {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(`${_baseApi  }/userAccount/info`, {
    method: 'POST',
    body: params
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi  }/userAccount/export`, {
    method: 'POST',
    body: params
  });
}
