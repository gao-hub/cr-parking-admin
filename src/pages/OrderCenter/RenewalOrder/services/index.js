import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/autoRenew/list', {
    method: 'POST',
    body: params
  });
}

// 获取所有下拉数据
export async function getAllSelect(params) {
  return request(`${_baseApi  }/autoRenew/getAllSelect`, {
    method: 'GET',
    // body: params
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/autoRenew/export', {
    method: 'POST',
    body: params
  });
}
