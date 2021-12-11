import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 获取会员信息
// eslint-disable-next-line import/prefer-default-export
export async function getMembetDetail(params) {
  return request(`${_baseApi}/user/info`, {
    method: 'POST',
    body: params,
  });
}
