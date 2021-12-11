import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/user/list', {
    method: 'POST',
    body: params
  });
}


//   改变数据状态
export async function statusChangeManage(params) {
  return request(_baseApi + '/user/update', {
    method: 'POST',
    body: params
  });
}

