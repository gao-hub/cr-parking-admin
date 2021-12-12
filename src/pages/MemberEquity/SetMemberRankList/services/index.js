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

//   修改
export async function modifyDeliverId(params) {
  return request(`${_baseApi}/integralOrder/update`, {
    method: 'POST',
    body: params,
  });
}

