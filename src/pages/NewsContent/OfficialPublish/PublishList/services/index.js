import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
// 列表
export async function fetchList(params) {
  return request(`${_baseApi}/article/listForOfficial`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deleteList(params) {
  return request(_baseApi + '/article/delete', {
    method: 'POST',
    body: params,
  });
}