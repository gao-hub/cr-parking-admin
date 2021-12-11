import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(`${_baseApi}/issueRecord/list`, {
    method: 'POST',
    body: params,
  });
}
// 到期退货列表
export async function returnFetchList(params) {
  params.useType = 0;
  return request(`${_baseApi}/saleCapital/searchReturnList`, {
    method: 'POST',
    body: params,
  });
}

// 单条发放
export async function batchAllocate(params) {
  return request(`${_baseApi}/issueRecord/release`, {
    method: 'POST',
    body: params,
  });
}

// 到期到货发放状态
export async function returnBatchAllocate(params) {
  return request(`${_baseApi}/saleCapital/manualDistributionRentReturn`, {
    method: 'POST',
    body: params,
  });
}

// 信息导入
export async function importFile(params) {
  return request(`${_baseApi}/issueRecord/importExcel`, {
    method: 'POST',
    body: params,
  });
}

// 信息导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/issueRecord/export`, {
    method: 'POST',
    body: params,
  });
}

// 信息导出
export async function returnExportFile(params) {
  params.useType = 0;
  return exportExcel(`${_baseApi}/saleCapital/searchReturnExport`, {
    method: 'POST',
    body: params,
  });
}

// 同步状态
export async function asyncData(params) {
  return request(`${_baseApi}/issueRecord/updateSynchro`, {
    method: 'POST',
    body: params,
  });
}
// 退货申请同步状态
export async function returnAsyncData(params) {
  return request(`${_baseApi}/saleCapital/updateSynchroRent`, {
    method: 'POST',
    body: params,
  });
}

// 请求总待发金额
export async function sumData(params) {
  return request(`${_baseApi}/issueRecord/sum`, {
    method: 'POST',
    body: params,
  });
}

// 到期退货总额
export async function returnSumData(params) {
  return request(`${_baseApi}/saleCapital/getSum`, {
    method: 'POST',
    body: params,
  });
}

// 获取所有下拉数据
export async function getAllSelect(params) {
  return request(`${_baseApi}/autoRenew/getAllSelect`, {
    method: 'GET',
    // body: params
  });
}

// 批量发放 全部发放接口 (idList为空是全部)
export async function postManualDistributionRentReturns(params) {
  return request(`${_baseApi}/saleCapital/manualDistributionRentReturns `, {
    method: 'POST',
    body: params,
  });
}
