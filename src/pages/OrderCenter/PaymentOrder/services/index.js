import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(`${_baseApi  }/order/payOrders`, {
    method: 'POST',
    body: params
  });
}

//   添加
export async function addManage(params) {
  return request(`${_baseApi  }/order/add`, {
    method: 'POST',
    body: params
  });
}

//   修改
export async function modifyManage(params) {
  return request(`${_baseApi  }/offlinePayInfo/audit`, {
    method: 'POST',
    body: params
  });
}

//   删除
export async function deleteManage(params) {
  return request(`${_baseApi  }/order/delete`, {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(`${_baseApi  }/offlinePayInfo/info`, {
    method: 'POST',
    body: params
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi  }/order/export`, {
    method: 'POST',
    body: params
  });
}

// 获取所有下拉数据
export async function getAllSelect(params) {
  return request(`${_baseApi  }/order/getAllSelect`, {
    method: 'GET',
    // body: params
  });
}
