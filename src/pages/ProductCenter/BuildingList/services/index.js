import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/building/list', {
    method: 'POST',
    body: params,
  });
}

//   添加楼盘
export async function addManage(params) {
  return request(_baseApi + '/building/add', {
    method: 'POST',
    body: params,
  });
}

//   添加车位出售
export async function parkingConsultant(params) {
  return request(_baseApi + '/parkingConsultant/add', {
    method: 'POST',
    body: params,
  });
}

//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/building/update', {
    method: 'POST',
    body: params,
  });
}

//   删除车位接口
export async function deleteManage(params) {
  return request(_baseApi + '/buildingParking/delete', {
    method: 'POST',
    body: params,
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/building/info', {
    method: 'POST',
    body: params,
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/building/export', {
    method: 'POST',
    body: params,
  });
}

// 获取车位列表接口
export async function parkingList(params) {
  return request(_baseApi + '/building/parkingList', {
    method: 'POST',
    body: params,
  });
}

// 获取开发商列表接口
export async function developerList(params) {
  // /developers/list
  return request(_baseApi + '/developers/downlist', {
    method: 'POST',
    body: params,
  });
}

// 获取物业公司列表接口
export async function businessAccountList(params) {
  // /developers/list
  return request(_baseApi + '/building/businessAccount', {
    method: 'POST',
    body: params,
  });
}

// 批量导入接口
export async function importExcel(params) {
  return request(_baseApi + '/building/importExcel', {
    method: 'POST',
    body: params,
  });
}

// 获取分润比例接口
export async function getReturnRate(params) {
  return request(`${_baseApi}/systemConfig/info`, {
    method: 'POST',
    // body: params
  });
}

//   根据车位号选择车位售价
export async function getRetailPrice(params) {
  return request(_baseApi + '/buildingParking/getRetailPrice', {
    method: 'POST',
    body: params,
  });
}

// 获取新增&&编辑页面初始化数据
export async function selectList(params) {
  return request(_baseApi + '/building/getAllSelect ', {
    method: 'POST',
    body: params,
  });
}

//  已售出转在售
export function changeOnSale(params) {
  return request(_baseApi + '/buildingParking/updateParkingSales', {
    method: 'POST',
    body: params,
  });
}
// 楼盘置顶
export function setStickStatus(params) {
  return request(`${_baseApi}/building/topStatus`, {
    method: 'POST',
    body: params,
  });
}
