import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function getList(params) {
  return request(`${_baseApi}/homeNews/list`, {
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

// 产品列表
export async function getProList(params) {
  return request(`${_baseApi}/homeStoreProduct/productList`, {
    method: 'POST',
    body: params,
  });
}

// 新增文章
export async function AddNew(params) {
  return request(`${_baseApi}/homeNews/add`, {
    method: 'POST',
    body: params,
  });
}

// 更新文章
export async function updateNew(params) {
  return request(`${_baseApi}/homeNews/update`, {
    method: 'POST',
    body: params,
  });
}

// 删除文章
export async function deleteNew(params) {
  return request(`${_baseApi}/homeNews/delete`, {
    method: 'POST',
    body: params,
  });
}

// 更新状态
export async function updateStatusNew(params) {
  return request(`${_baseApi}/homeNews/updateStatus`, {
    method: 'POST',
    body: params,
  });
}

// 详情
export async function getInfo(params) {
  return request(`${_baseApi}/homeNews/info`, {
    method: 'POST',
    body: params,
  });
}
