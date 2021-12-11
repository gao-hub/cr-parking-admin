import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  params.useType = 1;
  return request(_baseApi + '/parkingOrder/dueList', {
    method: 'POST',
    body: params
  });
}

// 获取所有下拉数据
export async function getAllSelect(params) {
  return request(`${_baseApi  }/parkingOrder/getAllSelect`, {
    method: 'GET',
    // body: params
  });
}

//   改变数据状态
export async function statusChangeManage(params) {
  return request(_baseApi + '/parkingRent/update', {
    method: 'POST',
    body: params
  });
}

// 导出
export async function exportFile(params) {
  params.useType = 1;
  return exportExcel(_baseApi + '/parkingOrder/dueExport', {
    method: 'POST',
    body: params
  });
}

