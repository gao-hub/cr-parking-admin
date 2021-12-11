import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function getList(params) {
  return request(`${_baseApi}/activityRedPacketWin/list`, {
    method: 'POST',
    body: params,
  });
}
// 导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/activityRedPacketWin/export`, {
    method: 'POST',
    body: params,
  });
}



// 获取select
export async function getSelect() {
  return request(`${_baseApi}/activity/accum/record/getAllSelect`, {
    method: 'GET'
  })
}
