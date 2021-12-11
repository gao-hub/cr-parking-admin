import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function getList(params) {
  return request(`${_baseApi}/homeOrder/list`, {
    method: 'POST',
    body: params,
  });
}

//   所属类目
export async function getSelectStoreCategoryList(params) {
  return request(`${_baseApi}/homeStoreCategory/selectStoreCategoryList`, {
    method: 'POST',
    body: params,
  });
}

//   详情
export async function getInfo(params) {
  return request(`${_baseApi}/homeOrder/info`, {
    method: 'POST',
    body: params,
  });
}

//   发货
export async function PostSend(params) {
  return request(`${_baseApi}/homeOrder/send`, {
    method: 'POST',
    body: params,
  });
}

//   售后
export async function updateOne(params) {
  return request(`${_baseApi}/homeOrder/updateOne`, {
    method: 'POST',
    body: params,
  });
}

//   复审
export async function Review(params) {
  return request(`${_baseApi}/homeOrder/review`, {
    method: 'POST',
    body: params,
  });
}

//   初审
export async function Refund(params) {
  return request(`${_baseApi}/homeOrder/refund`, {
    method: 'POST',
    body: params,
  });
}

export async function exportFile(params) {
  return exportExcel(`${_baseApi}/homeOrder/export`, {
    method: 'POST',
    body: params,
  });
}
