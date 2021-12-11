import { stringify } from 'qs';
import request from '@/utils/request';

import { _baseApi } from '@/defaultSettings.js';
//   列表
export async function queryMenuInfoList(params) {
  return request(`${_baseApi}/system/menu/list`, {
    method: 'POST',
    body: params
  });
}
//   添加菜单
export async function addMenuManage(params) {
  return request(`${_baseApi}/system/menu/add`, {
    method: 'POST',
    body: params
  });
}
//   菜单详情
export async function getMenuInfo(params) {
  return request(`${_baseApi}/system/menu/info`, {
    method: 'POST',
    body: params
  });
}
//   修改菜单
export async function upDateMenuManage(params) {
  return request(`${_baseApi}/system/menu/update`, {
    method: 'POST',
    body: params
  });
}
//  删除菜单
export async function deleteMenuManage(params) {
  return request(`${_baseApi}/system/menu/delete`, {
    method: 'POST',
    body: params
  });
}