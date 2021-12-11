import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function getList(params) {
  return request(`${_baseApi}/activity/accum/timesChange/page`, {
    method: 'POST',
    body: params,
  });
}

// 补发额度
export async function setReissue(params) {
  return request(`${_baseApi}/activity/accum/timesChange/reissue`, {
    method: 'POST',
    body: params,
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/activity/accum/timesChange/export`, {
    method: 'POST',
    body: params,
  });
}

// 获取select
export async function getSelect() {
  return request(`${_baseApi}/activity/accum/timesChange/getAllSelect`, {
    method: 'GET',
  });
}
