import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function getList(params) {
  return request(`${_baseApi}/activityCodeTimesChange/list`, {
    method: 'POST',
    body: params,
  });
}

// 详情
export async function getDrawInfo(params) {
  return request(`${_baseApi}/activityCodeTimesChange/getDrawInfo`, {
    method: 'POST',
    body: params,
  });
}

// 更新
export async function updateDrawInfo(params) {
  return request(`${_baseApi}/activityCodeTimesChange/updateDrawInfo`, {
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
  return exportExcel(`${_baseApi}/activityCodeTimesChange/export`, {
    method: 'POST',
    body: params,
  });
}

// 获取select
export async function getSelect() {
  return request(`${_baseApi}/activityCodeTimesChange/getAllSelect`, {
    method: 'GET',
  });
}
