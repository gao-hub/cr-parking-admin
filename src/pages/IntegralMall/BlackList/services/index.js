import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function fetchList(params) {
  return request(`${_baseApi}/integralBlacklist/list`, {
    method: 'POST',
    body: params,
  });
}

// 获取渠道
export async function parentUtmSelector(params) {
  return request(`${_baseApi}/integralBlacklist/parentUtmSelector`, {
    method: 'POST',
    body: params,
  });
}

//   添加黑名单
export async function saveManage(params) {
  return request(`${_baseApi}/integralBlacklist/add`, {
    method: 'POST',
    body: params,
  });
}

//   获取用户详情
export async function getUserInfo(params) {
  return request(_baseApi + '/user/getByUsername', {
    method: 'POST',
    body: params
  });
}

//   获取黑名单详情
export async function getBlackInfo(params) {
  return request(`${_baseApi}/integralBlacklist/info`, {
    method: 'POST',
    body: params,
  });
}

//   移除黑名单
export async function removeManage(params) {
  return request(`${_baseApi}/integralBlacklist/removeBlackUser`, {
    method: 'POST',
    body: params,
  });
}
