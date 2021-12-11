import { stringify } from 'qs';
import request from '@/utils/request';

import { _baseApi } from '@/defaultSettings.js';
//   列表
export async function queryRoleInfoList(params) {
  return request(`${_baseApi}/system/role/list`, {
    method: 'POST',
    body: params
  });
}
//   添加
export async function addRoleManage(params) {
  return request(`${_baseApi}/system/role/add`, {
    method: 'POST',
    body: params
  });
}
//   删除
export async function deleteRole(params) {
  return request(`${_baseApi}/system/role/delete`, {
    method: 'POST',
    body: params
  });
}
//   解除关系
export async function disengagement(params) {
  return request(`${_baseApi}/system/role/deleteRelation`, {
    method: 'POST',
    body: params
  });
}
//    获取详情
export async function getModifyRoleInfo(params) {
  return request(`${_baseApi}/system/role/info`, {
    method: 'POST',
    body: params
  });
}
//    修改角色管理
export async function upDateRoleManage(params) {
  return request(`${_baseApi}/system/role/update`, {
    method: 'POST',
    body: params
  });
}