import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function fetchList(params) {
  return request(_baseApi + '/systemConfigLog/list', {
    method: 'POST',
    body: params
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/systemConfigLog/export', {
    method: 'POST',
    body: params
  });
}
