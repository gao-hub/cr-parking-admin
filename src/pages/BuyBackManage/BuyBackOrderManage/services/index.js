import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 获取列表
export async function fetchList(params) {
  return request(`${_baseApi}/order/returnOrders`, {
    method: 'POST',
    body: params,
  });
}

// 获取下拉框
export async function initSelect() {
  return request(`${_baseApi}/order/getAllSelect`, {
    method: 'GET',
  });
}

export async function getModifyInfo(params) {
  return request(`${_baseApi}/order/info`, {
    method: 'POST',
    body: params,
  });
}

//   获取时间线
export async function getTimeLineInfo(params) {
  return request(`${_baseApi}/orderLog/list`, {
    method: 'POST',
    body: params,
  });
}

//   审核
export async function verifyOperate(params) {
  return request(`${_baseApi}/order/audit`, {
    method: 'POST',
    body: params,
  });
}

//   连连支付短信验证码
export async function lianlianSmsCodeApi(params) {
  return request(`${_baseApi}/order/validationSms`, {
    method: 'POST',
    body: params,
  });
}
//   自用版连连支付短信验证码
export async function lianlianSmsCodeApiSelf(params) {
  return request(`${_baseApi}/order/validationSmsSelf`, {
    method: 'POST',
    body: params,
  });
}

// 同步信息
export async function asyncData(params) {
  return request(`${_baseApi}/order/updateSynchro`, {
    method: 'POST',
    body: params,
  });
}

// 信息导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/order/returnOrdersExport`, {
    method: 'POST',
    body: params
  });
}

// 获取手机号
export async function getPhone(params) {
  return request(`${_baseApi}/businessAccount/getBusinessIdForSale`, {
    method: 'POST',
    body: params,
  });
}
