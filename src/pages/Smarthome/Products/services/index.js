import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 产品列表
export async function getList(params) {
  return request(`${_baseApi}/homeStoreProduct/list`, {
    method: 'POST',
    body: params,
  });
}

//   所属类目
export async function getSelectStoreCategoryList(params) {
  return request(`${_baseApi}/homeStoreCategory/selectStoreCategoryList`, {
    method: 'POST',
    body: params,
  });
}

//   新增商品
export async function addProduct(params) {
  return request(`${_baseApi}/homeStoreProduct/add`, {
    method: 'POST',
    body: params,
  });
}

//   上下架
export async function changeSale(params) {
  return request(`${_baseApi}/homeStoreProduct/sale`, {
    method: 'POST',
    body: params,
  });
}

//   推荐
export async function changeRecommend(params) {
  return request(`${_baseApi}/homeStoreProduct/recommend`, {
    method: 'POST',
    body: params,
  });
}

//   详情
export async function getInfo(params) {
  return request(`${_baseApi}/homeStoreProduct/info`, {
    method: 'POST',
    body: params,
  });
}

//   更新
export async function updateInfo(params) {
  return request(`${_baseApi}/homeStoreProduct/update`, {
    method: 'POST',
    body: params,
  });
}

// 导出文件
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/homeStoreProduct/export`, {
    method: 'POST',
    body: params,
  });
}

// 场景下拉
export async function allSceneList(params) {
  return request(`${_baseApi}/homeStoreScene/allList`, {
    method: 'POST',
    body: params,
  });
}
