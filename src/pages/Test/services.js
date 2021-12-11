import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
// 模拟开户
export async function businessAccountOpen(params) {
  return request(`${_baseApi}/businessAccount/open`, {
    method: 'POST',
    body: params,
  });
}

// 物业开户后协议申请
export async function businessAccountApply(params) {
  return request(`${_baseApi}/businessAccount/apply`, {
    method: 'POST',
    body: params,
  });
}

// 物业开户后更新合作银行账号
export async function businessAccountUserinfo(params) {
  return request(`${_baseApi}/businessAccount/userinfo`, {
    method: 'POST',
    body: params,
  });
}
