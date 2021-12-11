import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function getList(params) {
  return request(`${_baseApi}/activity/accum/record/page`, {
    method: 'POST',
    body: params,
  });
}

// 发货
export async function sendGoods(params) {
  return request(`${_baseApi}/activity/accum/record/delivery`, {
    method: 'POST',
    body: params,
  });
}

// 修改物流信息
export async function editExpress(params) {
  return request(`${_baseApi}/activity/accum/record/updateDeliveryId`, {
    method: 'POST',
    body: params,
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/activity/accum/record/export`, {
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
