import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 分类列表
export async function getCategoryList(params) {
  return request(`${_baseApi}/helpType/tree`, {
    method: 'POST',
    body: params,
  });
}

// 新增分类
export async function addCategory(params) {
  return request(`${_baseApi}/helpType/add`, {
    method: 'POST',
    body: params,
  });
}

// 获取分类详情
export async function getCategoryDetail(params) {
  return request(`${_baseApi}/helpType/info`, {
    method: 'POST',
    body: params,
  });
}

// 修改分类
export async function editCategory(params) {
  return request(`${_baseApi}/helpType/update`, {
    method: 'POST',
    body: params,
  });
}

// 删除分类
export async function deleteCategory(params) {
  return request(`${_baseApi}/helpType/delete`, {
    method: 'POST',
    body: params,
  });
}

// 分类排序
export async function sortCategory(params) {
  return request(`${_baseApi}/helpType/sort`, {
    method: 'POST',
    body: params,
  });
}

// 问题列表
export async function getQuestionList(params) {
  return request(`${_baseApi}/helpInfo/list`, {
    method: 'POST',
    body: params,
  });
}

// 问题列表导出
export async function exportQuestionFile(params) {
  return exportExcel(`${_baseApi}/helpInfo/export`, {
    method: 'POST',
    body: params,
  });
}

// 获取分类select使用
export async function getCategorySelect() {
  return request(`${_baseApi}/helpInfo/getAllSelect`, {
    method: 'GET',
  });
}

// 新增问题
export async function addQuestion(params) {
  return request(`${_baseApi}/helpInfo/add`, {
    method: 'POST',
    body: params,
  });
}

// 删除问题
export async function deleteQuestion(params) {
  return request(`${_baseApi}/helpInfo/delete`, {
    method: 'POST',
    body: params,
  });
}

// 问题详情
export async function getQuestion(params) {
  return request(`${_baseApi}/helpInfo/info`, {
    method: 'POST',
    body: params,
  });
}

// 问题排序
export async function sortQuestion(params) {
  return request(`${_baseApi}/helpInfo/sort`, {
    method: 'POST',
    body: params,
  });
}

// 问题状态修改
export async function setQuestionStatus(params) {
  return request(`${_baseApi}/helpInfo/status`, {
    method: 'POST',
    body: params,
  });
}

// 编辑问题
export async function editQuestion(params) {
  return request(`${_baseApi}/helpInfo/update`, {
    method: 'POST',
    body: params,
  });
}
