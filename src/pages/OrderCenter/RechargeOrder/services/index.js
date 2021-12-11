import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 充值订单列表
// eslint-disable-next-line import/prefer-default-export
export async function getRechargeOrderList(params) {
  return request(`${_baseApi}/mobileRechargeOrder/list`, {
    method: 'POST',
    body: params,
  });
}
// 信息导出
export async function exportFiles(params) {
  return exportExcel(`${_baseApi}/mobileRechargeOrder/export`, {
    method: 'POST',
    body: params,
  });
}
