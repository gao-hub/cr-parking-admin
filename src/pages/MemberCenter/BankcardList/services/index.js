import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';


// 测试列表
export async function mockList(params) {
  return request(`${_baseApi}/bankCard/list`, {
    method: 'POST',
    body: params,
  });
}

