import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 列表
export async function getNoticeList(params) {
  return request(`${_baseApi}/notice/list`, {
    method: 'POST',
    body: params,
  });
}

// 详情
export async function getNotice(params) {
  return request(`${_baseApi}/notice/info`, {
    method: 'POST',
    body: params,
  });
}

// 新增
export async function addNotice(params) {
  return request(`${_baseApi}/notice/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function editNotice(params) {
  return request(`${_baseApi}/notice/update`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deleteNotice(params) {
  return request(`${_baseApi}/notice/delete`, {
    method: 'POST',
    body: params,
  });
}
