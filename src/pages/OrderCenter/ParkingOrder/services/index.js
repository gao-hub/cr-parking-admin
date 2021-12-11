import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function fetchList(params) {
  return request(`${_baseApi  }/parkingOrder/list`, {
    method: 'POST',
    body: params
  });
}
// 自用版开发票add
export async function invoiceAdd(params) {
  return request(`${_baseApi  }/invoice/add`, {
    method: 'POST',
    body: params
  });
}
// 自用版开发票update
export async function invoiceUpdate(params) {
  return request(`${_baseApi  }/invoice/update`, {
    method: 'POST',
    body: params
  });
}
// 自用版开发票dolad
export async function invoiceDownload(params) {
  return request(`${_baseApi  }/invoice/download`, {
    method: 'POST',
    body: params
  });
}

// 下载协议zip
export async function downLoadPdf(params) {
  return request(`${_baseApi  }/parkingOrder/downLoadPdf`, {
    method: 'POST',
    body: params
  });
}

// 退货
export async function createReturn(params) {
  return request(`${_baseApi  }/order/createReturn`, {
    method: 'POST',
    body: params
  });
}
// 已交割
export async function selfDelivery(params) {
  return request(`${_baseApi  }/parkingOrder/update/selfDeliveryStatus`, {
    method: 'POST',
    body: params
  });
}
//   添加
export async function addManage(params) {
  return request(`${_baseApi  }/parkingOrder/add`, {
    method: 'POST',
    body: params
  });
}

//   修改
export async function modifyManage(params) {
  return request(`${_baseApi  }/parkingOrder/update`, {
    method: 'POST',
    body: params
  });
}

//   删除
export async function deleteManage(params) {
  return request(`${_baseApi  }/parkingOrder/delete`, {
    method: 'POST',
    body: params
  });
}

//    获取自用版详情
export async function getModifyInfo(params) {
  return request(`${_baseApi  }/invoice/info`, {
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
  return exportExcel(`${_baseApi  }/parkingOrder/export`, {
    method: 'POST',
    body: params
  });
}

// 审核
export async function auditManage(params) {
  // /buildingParking/update
  return request(`${_baseApi  }/parkingConsultant/update`, {
    method: 'POST',
    body: params
  });
}

// order
// 获取所有下拉数据
export async function getAllSelect(params) {
  return request(`${_baseApi  }/parkingOrder/getAllSelect`, {
    method: 'GET',
    // body: params
  });
}
