import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 获取信息记录列表
export async function getRecordList(params) {
  return request(`${_baseApi}/msgLog/list`, {
    method: 'POST',
    body: params,
  });
}

// 获取消息模板列表
export async function getTemplateList(params) {
  return request(`${_baseApi}/msgTemplate/list`, {
    method: 'POST',
    body: params,
  });
}

// 获取消息模板信息
export async function getTemplateInfo(params) {
  return request(`${_baseApi}/msgTemplate/info`, {
    method: 'POST',
    body: params,
  });
}

// 添加消息模板
export async function setTemplateInfo(params) {
  return request(`${_baseApi}/msgTemplate/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑消息模板
export async function editTemplate(params) {
  return request(`${_baseApi}/msgTemplate/update`, {
    method: 'POST',
    body: params,
  });
}

// 修改消息模板状态
export async function setTemplateStatus(params) {
  return request(`${_baseApi}/msgTemplate/status`, {
    method: 'POST',
    body: params,
  });
}

// 删除消息模板
export async function deleteTemplate(params) {
  return request(`${_baseApi}/msgTemplate/delete`, {
    method: 'POST',
    body: params,
  });
}

// 获取消息类别列表
export async function getCategoryList(params) {
  return request(`${_baseApi}/msgTemplateType/list`, {
    method: 'POST',
    body: params,
  });
}

// 获取消息类别信息
export async function getCategoryInfo(params) {
  return request(`${_baseApi}/msgTemplateType/info`, {
    method: 'POST',
    body: params,
  });
}

// 新增消息类别
export async function addCategory(params) {
  return request(`${_baseApi}/msgTemplateType/add`, {
    method: 'POST',
    body: params,
  });
}

// 修改消息类别信息
export async function editCategory(params) {
  return request(`${_baseApi}/msgTemplateType/update`, {
    method: 'POST',
    body: params,
  });
}

// 删除消息类别
export async function deleteCategory(params) {
  return request(`${_baseApi}/msgTemplateType/delete`, {
    method: 'POST',
    body: params,
  });
}

// 修改消息类别状态
export async function setCategoryStatus(params) {
  return request(`${_baseApi}/msgTemplateType/status`, {
    method: 'POST',
    body: params,
  });
}

// 获取消息类别下拉选择
export async function getCategorySelect() {
  return request(`${_baseApi}/msgTemplate/getAllSelect`, {
    method: 'GET',
    // body: params,
  });
}
