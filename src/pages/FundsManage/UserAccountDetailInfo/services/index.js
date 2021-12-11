import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';

// 获取列表
export async function fetchList(params) {
  return request(`${_baseApi}/userAccountDetailInfo/list`, {
    method: 'POST',
    body: params
  });
}

//  获取下拉框
export async function initSelect(params) {
  return request(`${_baseApi}/userAccountDetailInfo/getAllSelect`, {
    method: 'GET'
  });
}

// 同步数据
export async function asyncData(params) {
  return request(_baseApi + '', {
    method: 'POST',
    body: params
  });
}

