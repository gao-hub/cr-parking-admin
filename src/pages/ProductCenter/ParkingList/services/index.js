import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(`${_baseApi  }/buildingParking/list`, {
    method: 'POST',
    body: params
  });
}

//   添加
export async function addManage(params) {
  return request(`${_baseApi  }/buildingParking/add`, {
    method: 'POST',
    body: params
  });
}

//   修改
export async function modifyManage(params) {
  return request(`${_baseApi  }/buildingParking/update`, {
    method: 'POST',
    body: params
  });
}

//   删除
export async function deleteManage(params) {
  return request(`${_baseApi  }/buildingParking/delete`, {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(`${_baseApi  }/buildingParking/info`, {
    method: 'POST',
    body: params
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi  }/buildingParking/export`, {
    method: 'POST',
    body: params
  });
}


// 获取开发商列表接口
export async function developerList(params) {
  return request(`${_baseApi  }/developers/downlist`, {
    method: 'POST',
    body: params
  });
}

// 同步
export async function asyncData(params) {
  return request(`${_baseApi}/parkingConsultant/updateSynchro`, {
    method: 'POST',
    body: params
  });
}


// 获取下拉框数据
export async function getAllSelect(params) {
  return request(`${_baseApi  }/buildingParking/getAllSelect`, {
    method: 'GET'
  });
}

//    上架下架
export async function updateStatus(params) {
  return request(_baseApi + '/buildingParking/updateParkingStatus', {
    method: 'POST',
    body: params
  });
}

// 获取新增&&编辑页面初始化数据
export async function selectList(params) {
  return request(_baseApi + '/building/getAllSelect', {
    method: 'POST',
    body: params
  });
}

//  已售出转在售
export function changeOnSale(params) {
  return request(_baseApi + '/buildingParking/updateParkingSales', {
    method: 'POST',
    body: params
  });
}
