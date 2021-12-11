import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 获取列表
export async function fetchList(params) {
  return request(`${_baseApi}/businessAccount/list`, {
    method: 'POST',
    body: params
  });
}

// 同步数据
export async function asyncData(params) {
  return request(`${_baseApi  }/businessAccount/synchro/${params.id}`, {
    method: 'POST',
    body: params
  });
}


