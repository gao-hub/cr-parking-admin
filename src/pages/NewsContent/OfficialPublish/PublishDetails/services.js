import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 获取详情信息
export async function getPublishInfo(params) {
  return request(`${_baseApi}/article/info`, {
    method: 'POST',
    body: params,
  });
}

// 添加
export async function add(params) {
  return request(`${_baseApi}/article/add`, {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function examineApi(params) {
  return request(`${_baseApi}/article/auditForOfficial`, {
    method: 'POST',
    body: params,
  });
}

// 获取发布人
export async function getUserApi() {
  return request(`${_baseApi}/userArtAccount/getlist`, {
    method: 'POST',
    body: {},
  });
}

//专栏
export async function getContactType(params) {
  return request(`${_baseApi}/article/getAllSelect`, {
    method: 'POST',
    body: params,
  });
}
