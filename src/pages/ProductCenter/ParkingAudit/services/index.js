import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(`${_baseApi}/parkingConsultant/list`, {
    method: 'POST',
    body: params,
  });
}

//   添加
export async function addManage(params) {
  return request(`${_baseApi}/buildingParking/add`, {
    method: 'POST',
    body: params,
  });
}

//   修改
export async function modifyManage(params) {
  return request(`${_baseApi}/buildingParking/update`, {
    method: 'POST',
    body: params,
  });
}

//   删除
export async function deleteManage(params) {
  return request(`${_baseApi}/buildingParking/delete`, {
    method: 'POST',
    body: params,
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(`${_baseApi}/parkingConsultant/info`, {
    method: 'POST',
    body: params,
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/parkingConsultant/export`, {
    method: 'POST',
    body: params,
  });
}

// 获取开发商列表接口
export async function developerList(params) {
  return request(`${_baseApi}/developers/downlist`, {
    method: 'POST',
    body: params,
  });
}

// 同步
export async function asyncData(params) {
  return request(`${_baseApi}/parkingConsultant/updateSynchro`, {
    method: 'POST',
    body: params,
  });
}

// 出售发放
export async function updateSynchroSale(params) {
  return request(`${_baseApi}/parkingConsultant/updateSynchroSale`, {
    method: 'POST',
    body: params,
  });
}

// 获取下拉框数据
export async function getAllSelect() {
  return request(`${_baseApi}/parkingConsultant/getAllSelect`, {
    method: 'GET',
  });
}

// 审核
export async function auditManage(params) {
  // /buildingParking/update
  return request(`${_baseApi}/parkingConsultant/update`, {
    method: 'POST',
    body: params,
  });
}

// 运营审核
export async function operateAuditManage(params) {
  // /buildingParking/update
  return request(`${_baseApi}/parkingConsultant/updateOperateAudit`, {
    method: 'POST',
    body: params,
  });
}
//   连连支付短信验证码
export async function lianlianSmsCodeApi(params) {
  return request(`${_baseApi}/parkingConsultant/validationSms`, {
    method: 'POST',
    body: params,
  });
}


// 获取手机号
export async function getPhone(params) {
  return request(`${_baseApi}/businessAccount/getBusinessIdForSale`, {
    method: 'POST',
    body: params,
  });
}
