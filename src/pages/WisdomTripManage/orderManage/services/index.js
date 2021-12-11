import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function fetchList(params) {
  return request(`${_baseApi  }/travelOrder/list`, {
    method: 'POST',
    body: params
  });
}

//   添加
export async function addManage(params) {
  return request(`${_baseApi  }/travelOrder/add`, {
    method: 'POST',
    body: params
  });
}

//   修改
export async function modifyManage(params) {
  return request(`${_baseApi  }/travelOrder/update`, {
    method: 'POST',
    body: params
  });
}

//   删除
export async function deleteManage(params) {
  return request(`${_baseApi  }/travelOrder/delete`, {
    method: 'POST',
    body: params
  });
}
//    获取详情
export async function getNoPermissionOrderInfo(params) {
  return request(`${_baseApi  }/travelOrder/infoUpdate`, {
    method: 'POST',
    body: params
  });
}
//    获取详情
export async function getOrderInfo(params) {
  return request(`${_baseApi  }/travelOrder/info`, {
    method: 'POST',
    body: params
  });
}

//   获取时间线
export async function getTimeLineInfo(params) {
  return request(`${_baseApi  }/orderLog/list`, {
    method: 'POST',
    body: params
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi  }/travelOrder/export`, {
    method: 'POST',
    body: params
  });
}

// 初审
export async function auditManage(params) {
  return request(`${_baseApi  }/travelOrder/refund`, {
    method: 'POST',
    body: params
  });
}
// 二次确认
export async function confirmManage(params) {
  return request(`${_baseApi  }/travelOrder/updateOne`, {
    method: 'POST',
    body: params
  });
}
// 复审
export async function reviewManage(params) {
  return request(`${_baseApi  }/travelOrder/review`, {
    method: 'POST',
    body: params
  });
}

// 获取所有下拉数据
export async function getAllSelect(params) {
  return request(`${_baseApi  }/travelOrder/getAllSelect`, {
    method: 'GET',
    // body: params
  });
}
