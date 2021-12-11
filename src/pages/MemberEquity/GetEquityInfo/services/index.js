import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 获取列表
export async function fetchList(params) {
  return request(`${_baseApi}/integralOrder/list`, {
    method: 'POST',
    body: params,
  });
}

//  获取渠道下拉列表
export async function  parentUtmSelector(params) {
  return request(`${_baseApi}/integralBlacklist/parentUtmSelector`, {
    method: 'POST',
    body: params,
  });
}

//  发货
export async function  onDelivery(params) {
  return request(`${_baseApi}/integralOrder/delivery`, {
    method: 'POST',
    body: params,
  });
}

//  获取详情(售后)
export async function getModifyInfo(params) {
  return request(`${_baseApi}/integralOrder/info`, {
    method: 'POST',
    body: params,
  });
}

//  修改售后退货积分
export async function modifyManage(params) {
  return request(`${_baseApi}/integralOrder/refund`, {
    method: 'POST',
    body: params,
  });
}

//   修改物流单号
export async function modifyDeliverId(params) {
  return request(`${_baseApi}/integralOrder/update`, {
    method: 'POST',
    body: params,
  });
}

//    获取权益名称
export async function getEquityName(params) {
  return request(`${_baseApi}/integralOrder/orderStatusSelector`, {
    method: 'POST',
    body: params,
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/integralOrder/export`, {
    method: 'POST',
    body: params,
  });
}
