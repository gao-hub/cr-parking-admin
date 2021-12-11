import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 违约金发放列表
export async function mockList(params) {
  return request(_baseApi + '/saleCapital/falsifyList', {
    method: 'POST',
    body: params,
  });
}

// 到期退货列表
export async function mockBackList(params) {
  params.useType = 1;
  return request(_baseApi + '/saleCapital/searchReturnList', {
    method: 'POST',
    body: params,
  });
}

//   改变数据状态
export async function statusChangeManage(params) {
  return request(_baseApi + '/parkingRent/update', {
    method: 'POST',
    body: params,
  });
}

// 获取所有下拉数据
export async function getAllSelect(params) {
  return request(`${_baseApi}/saleCapital/getAllSelect`, {
    method: 'GET',
    // body: params
  });
}

// 单条发放
export async function batchAllocate(params) {
  return request(`${_baseApi}/saleCapital/batchDistributionFalsify`, {
    method: 'POST',
    body: params,
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/saleCapital/falsifyExport', {
    method: 'POST',
    body: params,
  });
}
// 导出（到期退货）
export async function exportBackFile(params) {
  params.useType = 1;
  return exportExcel(_baseApi + '/saleCapital/searchReturnExport', {
    method: 'POST',
    body: params,
  });
}

// 违约金发放(批量发放)
export async function penaltyBatchHandOutApi(params) {
  return request(_baseApi + '/saleCapital/batchDistributionFalsify', {
    method: 'POST',
    body: params,
  });
}

// 违约金发放(手动发放)
export async function penaltyHandOutApi(params) {
  return request(_baseApi + '/saleCapital/manualDistributionFalsify', {
    method: 'POST',
    body: params,
  });
}

// 违约金发放 短信二次校验
export async function penaltyHandOutSmsCodeApi(params) {
  return request(_baseApi + '/saleCapital/validationSmsMaturity', {
    method: 'POST',
    body: params,
  });
}

// 到期退货发放(手动发放)
export async function returnHandOutApi(params) {
  return request(_baseApi + '/saleCapital/manualDistributionReturn', {
    method: 'POST',
    body: params,
  });
}

// 到期退货发放(失败重发)
export async function reReturnHandOutApi(params) {
  return request(_baseApi + '/saleCapital/updateSynchro', {
    method: 'POST',
    body: params,
  });
}

// 到期退货 短信二次校验
export async function returnHandOutSmsCodeApi(params) {
  return request(_baseApi + '/saleCapital/validationSms', {
    method: 'POST',
    body: params,
  });
}


// 获取手机号
export async function getPhone(params) {
  return request(_baseApi + '/businessAccount/getBusinessIdForSale', {
    method: 'POST',
    body: params,
  });
}


// 获得金额数据
export async function getReturnSum(params) {
  return request(_baseApi + '/saleCapital/getReturnSum', {
    method: 'POST',
    body: params,
  });
}


// 发放接口
export async function postManualDistributionReturnAll(params) {
  return request(_baseApi + '/saleCapital/manualDistributionReturnAll', {
    method: 'POST',
    body: params,
  });
}