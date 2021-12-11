import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/utm/list', {
    method: 'POST',
    body: params
  });
}

//   添加
export async function addManage(params) {
  return request(_baseApi + '/utm/add', {
    method: 'POST',
    body: params
  });
}

//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/utm/update', {
    method: 'POST',
    body: params
  });
}

//   删除
export async function deleteManage(params) {
  return request(_baseApi + '/utm/delete/'+params.id, {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/utm/info/'+params.id, {
    method: 'POST',
    body: params
  });
}

//    获取默认链接
export async function getDefaultInfo(params) {
  return request(_baseApi + '/utm/default-info', {
    method: 'POST',
    body: params
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/utm/export', {
    method: 'POST',
    body: params
  });
}

//    启用禁用
export async function updateStatus(params) {
  return request(_baseApi + '/utm/openstatus', {
    method: 'POST',
    body: params
  });
}

//    获取一级渠道列表信息
export async function getParentUtmList() {
  return request(_baseApi + '/utm/getParentUtmList', {
    method: 'POST'
  });
}
