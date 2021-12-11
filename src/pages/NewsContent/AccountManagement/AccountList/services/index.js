import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 获取官方账号/小马甲列表，通过类型区分
export async function getList(params) {
  return request(`${_baseApi}/userArtAccount/list`, {
    method: 'POST',
    body: params,
  });
}

// 获取账号详情
export async function getDetail(params) {
  return request(`${_baseApi}/userArtAccount/info`, {
    method: 'POST',
    body: params,
  });
}

// 新增账号
export async function addAccount(params) {
  return request(`${_baseApi}/userArtAccount/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑活动消息
export async function editAccount(params) {
  return request(`${_baseApi}/userArtAccount/update`, {
    method: 'POST',
    body: params,
  });
}

// 修改账号状态
export async function setStatus(params) {
  return request(`${_baseApi}/userArtAccount/updateStatus`, {
    method: 'POST',
    body: params,
  });
}

// 删除账号
export async function deleteAccount(params) {
  return request(`${_baseApi}/userArtAccount/delete`, {
    method: 'POST',
    body: params,
  });
}
