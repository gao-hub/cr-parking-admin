import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
// 黑名单列表
export async function getBlackList(params) {
  return request(`${_baseApi}/userBlackList/list`, {
    method: 'POST',
    body: params,
  });
}

// 获取渠道下拉框
export async function getAllSelect() {
  return request(`${_baseApi}/userBlackList/getAllSelect`, {
    method: 'GET'
  });
}

// 根据用户名查询用户
export async function getUserByUserName(params) {
  return request(`${_baseApi}/userBlackList/getUserByUserName`, {
    method: 'POST',
    body: params
  });
}

// 添加
export async function addBlackUser(params) {
  return request(_baseApi + '/userBlackList/add', {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deleteBlackUser(params) {
  return request(_baseApi + '/userBlackList/delete', {
    method: 'POST',
    body: params,
  });
}
