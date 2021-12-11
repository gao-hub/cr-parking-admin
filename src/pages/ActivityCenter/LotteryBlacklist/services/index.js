import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 获取列表
export async function fetchList(params) {
  return request(`${_baseApi}/activityBlacklist/list`, {
    method: 'POST',
    body: params
  });
}

// 添加黑名单
export async function add(params) {
  return request(`${_baseApi}/activityBlacklist/add`, {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getUserInfo(params) {
  return request(_baseApi + '/user/getByUsername', {
    method: 'POST',
    body: params
  });
}

// 添加黑名单
export async function deleteData(params) {
  return request(`${_baseApi}/activityBlacklist/delete`, {
    method: 'POST',
    body: params
  });
}

// 获取所有下拉数据
export async function getAllSelect(params) {
  return request(`${_baseApi  }/activityBlacklist/getAllSelect`, {
    method: 'GET',
    // body: params
  });
}

