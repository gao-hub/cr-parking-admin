import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 广告位列表
export async function fetchList(params) {
  return request(`${_baseApi}/travelAdvert/list`, {
    method: 'POST',
    body: params,
  });
}

// tab标签列表
export async function fetchTabList(params) {
  return request(`${_baseApi}/travelTab/list`, {
    method: 'POST',
    body: params,
  });
}

// 获取tab标题列表
export async function getTabSelectApi() {
  return request(`${_baseApi}/travelTab/select`, {
    method: 'POST',
  });
}

// 获取广告位平台列表
export async function getAdPlatformApi() {
  return request(`${_baseApi}/poster/getPosterType`, {
    method: 'GET',
  });
}

//   广告添加
export async function addManage(params) {
  return request(`${_baseApi}/travelAdvert/add`, {
    method: 'POST',
    body: params,
  });
}

//   tab添加
export async function addTabManage(params) {
  return request(`${_baseApi}/travelTab/add`, {
    method: 'POST',
    body: params,
  });
}

//   广告修改
export async function modifyManage(params) {
  return request(`${_baseApi}/travelAdvert/update`, {
    method: 'POST',
    body: params,
  });
}

//   tab修改
export async function modifyTabManage(params) {
  return request(`${_baseApi}/travelTab/update`, {
    method: 'POST',
    body: params,
  });
}

//   广告删除
export async function deleteManage(params) {
  return request(`${_baseApi}/travelAdvert/delete`, {
    method: 'POST',
    body: params,
  });
}

//   tab删除
export async function tabDeleteManage(params) {
  return request(`${_baseApi}/travelTab/delete`, {
    method: 'POST',
    body: params,
  });
}

//    获取广告详情
export async function getModifyInfo(params) {
  return request(`${_baseApi}/travelAdvert/info`, {
    method: 'POST',
    body: params,
  });
}

//    获取tab详情
export async function getTabModifyInfo(params) {
  return request(`${_baseApi}/travelTab/info`, {
    method: 'POST',
    body: params,
  });
}

//    广告启用禁用
export async function updateStatus(params) {
  return request(`${_baseApi}/travelAdvert/status`, {
    method: 'POST',
    body: params,
  });
}

//    tab启用禁用
export async function updateTabStatus(params) {
  return request(`${_baseApi}/travelTab/status`, {
    method: 'POST',
    body: params,
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/poster/export`, {
    method: 'POST',
    body: params,
  });
}
