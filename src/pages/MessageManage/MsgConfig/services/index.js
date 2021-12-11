import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';

// 新增系统配置
export async function addManage(params) {
  return request(`${_baseApi}/smsConfig/add`, {
    method: 'POST',
    body: params
  });
}

// 详情
export async function getModifyInfo(params) {
  return request(`${_baseApi}/smsConfig/info`, {
    method: 'POST',
    // body: params
  });
}

// 修改
export async function modifyManage(params) {
  return request(`${_baseApi}/smsConfig/update`, {
    method: 'POST',
    body: params
  });
}
