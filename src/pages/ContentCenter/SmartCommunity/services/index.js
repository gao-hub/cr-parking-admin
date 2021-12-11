import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 功能列表
export async function mockList(params) {
  return request(_baseApi + '/communityProduct/list', {
    method: 'POST',
    body: params,
  });
}

// 类型列表
export async function mockBackList(params) {
  return request(_baseApi + '/communityProductGroups/list', {
    method: 'POST',
    body: params,
  });
}

//   改变数据状态
export async function statusChangeManage(params) {
  return request(_baseApi + '/parkingRent/update', {
    method: 'POST',
    body: params,
  });
}

// 获取关联类型下拉
export async function getTypeSelect(params) {
  return request(`${_baseApi}/communityProductGroups/typeList`, {
    method: 'POST',
    // body: params
  });
}
// 添加功能管理
export async function addFunction(params) {
  return request(`${_baseApi}/communityProduct/add`, {
    method: 'POST',
    body: params
  });
}
// 修改功能管理
export async function modifyFunction(params) {
  return request(`${_baseApi}/communityProduct/update`, {
    method: 'POST',
    body: params
  });
}
// 修改功能状态
export async function modifyFcState(params) {
  return request(`${_baseApi}/communityProduct/state`, {
    method: 'POST',
    body: params
  });
}

// 获取功能的详情
export async function getFunctionInfo(params) {
  return request(`${_baseApi}/communityProduct/info`, {
    method: 'POST',
    body: params
  });
}

// 删除功能
export async function deleteFunction(params) {
  return request(`${_baseApi}/communityProduct/delete`, {
    method: 'POST',
    body: params
  });
}

// 添加类型管理
export async function addType(params) {
  return request(`${_baseApi}/communityProductGroups/add`, {
    method: 'POST',
    body: params
  });
}
// 修改类型管理
export async function modifyType(params) {
  return request(`${_baseApi}/communityProductGroups/update`, {
    method: 'POST',
    body: params
  });
}

// 获取类型的详情
export async function getTypeInfo(params) {
  return request(`${_baseApi}/communityProductGroups/info`, {
    method: 'POST',
    body: params
  });
}

// 修改类型状态
export async function modifyTypeState(params) {
  return request(`${_baseApi}/communityProductGroups/state`, {
    method: 'POST',
    body: params
  });
}

// 删除类型
export async function deleteType(params) {
  return request(`${_baseApi}/communityProductGroups/delete`, {
    method: 'POST',
    body: params
  });
}