import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
// import exportExcel from '@/utils/exportExcel';
import exportZip from '@/utils/exportZip';

// 测试列表
export async function mockList(params) {
  return request(`${_baseApi}/user/list`, {
    method: 'POST',
    body: params,
  });
}

// 修改推荐人
export async function updateSpreads(params) {
  return request(`${_baseApi}/user/updateSpreads`, {
    method: 'POST',
    body: params,
  });
}

// 修改推荐人
export async function updateUtm(params) {
  return request(`${_baseApi}/user/updateUtm`, {
    method: 'POST',
    body: params,
  });
}

// 客户修改为员工接口
export async function updateCRole(params) {
  return request(`${_baseApi}/user/update-role`, {
    method: 'POST',
    body: params,
  });
}

//   会员下载身份信息
export async function downloadMember(params) {
  return exportZip(`${_baseApi}/user/download/${params}`, {
    method: 'POST',
  });
}
// 推荐人变更记录
export async function spreadsLogData(params) {
  return request(`${_baseApi}/userSpreadsLog/list`, {
    method: 'POST',
    body: params,
  });
}
// 启用禁用
export async function statusChangeManage(params) {
  return request(`${_baseApi}/user/update`, {
    method: 'POST',
    body: params,
  });
}

// 获取下拉框
export async function initSelect() {
  return request(`${_baseApi}/user/getAllSelect`, {
    method: 'GET',
  });
}

/** 查看手机号
 * params  请求参数
 */
export async function showMobileApi(params) {
  return request(`${_baseApi}/user/mobile`, {
    method: 'POST',
    body: params,
  });
}

// 修改渠道
export async function updateChannelApi(params) {
  return request(`${_baseApi}/user/updateParentUtm`, {
    method: 'POST',
    body: params,
  });
}

// 获取渠道修改记录列表
export async function updateChannelRecordApi(params) {
  return request(`${_baseApi}/userParentUtmLog/list`, {
    method: 'POST',
    body: params,
  });
}

// 获取积分列表
export async function getIntegralApi(params) {
  return request(`${_baseApi}/userIntegralModifyLog/list`, {
    method: 'POST',
    body: params,
  });
}

// 修改积分
export async function  updateIntegralApi(params) {
  return request(`${_baseApi}/userIntegralModifyLog/add`, {
    method: 'POST',
    body: params,
  });
}