import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 列表
export async function getList(params) {
  return request(`${_baseApi}/dynamicArt/list`, {
    method: 'POST',
    body: params,
  });
}

// 详情
export async function getData(params) {
  return request(`${_baseApi}/dynamicArt/info`, {
    method: 'POST',
    body: params,
  });
}

// 新增
export async function addData(params) {
  return request(`${_baseApi}/dynamicArt/add`, {
    method: 'POST',
    body: params,
  });
}

// 修改
export async function editData(params) {
  return request(`${_baseApi}/dynamicArt/update`, {
    method: 'POST',
    body: params,
  });
}

// 状态修改
export async function setStatus(params) {
  return request(`${_baseApi}/dynamicArt/updateStatus`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deleteData(params) {
  return request(`${_baseApi}/dynamicArt/delete`, {
    method: 'POST',
    body: params,
  });
}
