import request from '@/utils/request';

import { _baseApi } from '@/defaultSettings.js';
//   列表
export async function fetchList(params) {
  return request(`${_baseApi}/system/user/list`, {
    method: 'POST',
    body: params
  });
}

/** 添加接口
 * params  请求参数
 */
export async function addandmodify(params) {
  return request(`${_baseApi}/system/user/add`, {
    method: 'POST',
    body: params
  });
}

/** 修改用户状态
 * params  请求参数
 */
export async function modifyState(params) {
  return request(`${_baseApi}/system/user/updateStatus`, {
    method: 'POST',
    body: params
  });
}
/** 重置密码
 * params  请求参数
 */
export async function resetPassword(params) {
  return request(`${_baseApi}/system/user/resetPassword`, {
    method: 'POST',
    body: params
  });
}

/** 获取角色列表
 * 无参数请求
 */
export async function getRoleList(params) {
  return request(`${_baseApi}/system/role/list`, {
    method: 'POST',
    body: params
  });
}
/** 删除管理员
 * params  请求参数
 */
export async function deleteManage(params) {
  return request(`${_baseApi}/system/user/delete`, {
    method: 'POST',
    body: params
  });
}
/** 获取管理员详情
 * params  请求参数
 */
export async function getModifyInfo(params) {
  return request(`${_baseApi}/system/user/info`, {
    method: 'POST',
    body: params
  });
}
/** 修改管理员
 * params  请求参数
 */
export async function changeManageMember(params) {
  return request(`${_baseApi}/system/user/update`, {
    method: 'POST',
    body: params
  });
}