import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function fetchList(params) {
  return request(_baseApi + '/poster/list', {
    method: 'POST',
    body: params,
  });
}

// 获取广告位列表
export async function getAdSpaceApi() {
  return request(_baseApi + '/poster/getAllSelect', {
    method: 'GET',
  });
}

// 获取广告位平台列表
export async function getAdPlatformApi() {
  return request(_baseApi + '/poster/getPosterType', {
    method: 'GET',
  });
}

//   添加
export async function addManage(params) {
  return request(_baseApi + '/poster/add', {
    method: 'POST',
    body: params,
  });
}

//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/poster/update', {
    method: 'POST',
    body: params,
  });
}

//   删除
export async function deleteManage(params) {
  return request(_baseApi + '/poster/delete/' + params.id, {
    method: 'POST',
    // body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/poster/info/' + params.id, {
    method: 'POST',
  });
}

//    启用禁用
export async function updateStatus(params) {
  return request(_baseApi + '/poster/openstatus', {
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
