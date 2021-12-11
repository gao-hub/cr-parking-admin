import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 列表
export function getList(params) {
  return request(`${_baseApi}/financeStatisticsParking/list`, {
    method: 'POST',
    body: params,
  });
}

// 详情
export function getInfo(params) {
  return request(`${_baseApi}/financeStatisticsParking/info`, {
    method: 'POST',
    body: params,
  });
}

// 修改
export function changeInfo(params) {
  return request(`${_baseApi}/financeParkingOrderDetail/update`, {
    method: 'POST',
    body: params,
  });
}

// 导出
export function exportFile(params) {
  return exportExcel(`${_baseApi}/financeStatisticsParking/export`, {
    method: 'POST',
    body: params,
  });
}
