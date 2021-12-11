import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/parkingRent/list', {
    method: 'POST',
    body: params
  });
}


// 测试列表
export async function fetchPlanList(params) {
  params.useType = 0;
  return request(_baseApi + '/autoRenew/listRent', {
    method: 'POST',
    body: params
  });
}

//   改变数据状态
export async function statusChangeManage(params) {
  return request(_baseApi + '/parkingRent/update', {
    method: 'POST',
    body: params
  });
}


// 导出到期计划
export async function exportFile(params) {
  params.useType = 0;
  return exportExcel(_baseApi + '/autoRenew/exportRent', {
    method: 'POST',
    body: params
  });
}
