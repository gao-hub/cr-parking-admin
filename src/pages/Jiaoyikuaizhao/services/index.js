import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 产品列表
export async function getSnapshot(params) {
  return request(`${_baseApi}/homeOrder/snapshot`, {
    method: 'POST',
    body: params,
  });
}
