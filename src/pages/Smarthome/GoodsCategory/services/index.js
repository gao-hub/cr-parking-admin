import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 查询列表
export async function fetchList(data) {
  return request(`${_baseApi}/homeStoreCategory/list`, {
    method: 'POST',
    body: data,
  });
}

// 添加类目
export async function addCategory(data) {
  return request(`${_baseApi}/homeStoreCategory/add`, {
    method: 'POST',
    body: data,
  });
}

// 删除类目
export async function deleteCategory(data) {
  return request(`${_baseApi}/homeStoreCategory/delete`, {
    method: 'POST',
    body: data,
  });
}

// 更新类目
export async function updateCategory(data) {
  return request(`${_baseApi}/homeStoreCategory/update`, {
    method: 'POST',
    body: data,
  });
}

// 类目排序
export async function updateSort(data) {
  return request(`${_baseApi}/homeStoreCategory/updateSort`, {
    method: 'POST',
    body: data,
  });
}

// 应用列表
export async function fetchAppList(data) {
  return request(`${_baseApi}/homeStoreScene/list`, {
    method: 'POST',
    body: data,
  });
}

// 应用删除
export async function deleteScene(data) {
  return request(`${_baseApi}/homeStoreScene/delete`, {
    method: 'POST',
    body: data,
  });
}

// 应用启用禁用
export async function updateStatusScene(data) {
  return request(`${_baseApi}/homeStoreScene/updateStatus`, {
    method: 'POST',
    body: data,
  });
}

// 应用新增
export async function addScene(data) {
  return request(`${_baseApi}/homeStoreScene/add`, {
    method: 'POST',
    body: data,
  });
}

// 应用更新
export async function updateScene(data) {
  return request(`${_baseApi}/homeStoreScene/update`, {
    method: 'POST',
    body: data,
  });
}
