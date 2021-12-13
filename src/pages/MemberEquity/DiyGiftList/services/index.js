import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 获取列表
export async function fetchList(params) {
  return request(`${_baseApi}/memberProduct/list`, {
    method: 'POST',
    body: params
  });
}

// 新增代理商
export async function addManage(params) {
  return request(`${_baseApi}/memberProduct/add`, {
    method: 'POST',
    body: params
  });
}

// 校验会员等级名称唯一性
export async function checkLevelName(params) {
  return request(`${_baseApi}/memberProduct/checkname`, {
    method: 'POST',
    body: params
  });
}

// 校验认购标准唯一性
export async function checkLevelStandard(params) {
  return request(`${_baseApi}/memberProduct/checkstandard`, {
    method: 'POST',
    body: params
  });
}

// 详情
export async function getModifyInfo(params) {
  return request(`${_baseApi}/memberProduct/info/${params.id}`, {
    method: 'POST',
    // body: params
  });
}

// 修改
export async function modifyManage(params) {
  return request(`${_baseApi}/memberProduct/update`, {
    method: 'POST',
    body: params
  });
}

// 删除数据
export async function deleteData(params) {
  return request(_baseApi + '/memberProduct/delete/'+ params.id, {
    method: 'POST',
    // body: params
  });
}
