import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';

// 新增系统配置
export async function addManage(params) {
  return request(`${_baseApi}/systemConfig/add`, {
    method: 'POST',
    body: params
  });
}

// 详情
export async function getModifyInfo(params) {
  return request(`${_baseApi}/businessAccount/info`, {
    method: 'POST',
    body: params
  });
}

// 修改
export async function modifyManage(params) {
  return request(`${_baseApi}/systemConfig/update`, {
    method: 'POST',
    body: params
  });
}

// 提现
export async function withdraw(params) {
  return request(`${_baseApi}/businessAccount/withdraw`, {
    method: 'POST',
    body: params
  });
}

//   连连支付短信验证码
export async function lianlianSmsCodeApi(params) {
  return request(`${_baseApi}/businessAccount/validationSms`, {
    method: 'POST',
    body: params,
  });
}
