import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 获取列表
export async function fetchList(params) {
  return request(`${_baseApi}/activityTimesChange/list`, {
    method: 'POST',
    body: params
  });
}

// 信息导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/activityTimesChange/export`, {
    method: 'POST',
    body: params
  });
}

// 获取所有下拉数据
export async function getAllSelect(params) {
  return request(`${_baseApi  }/activityTimesChange/getAllSelect`, {
    method: 'GET',
    // body: params
  });
}

