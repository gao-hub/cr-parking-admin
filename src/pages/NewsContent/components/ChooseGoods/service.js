import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 列表
export async function getList(params, type) {
  let obj = {
    1: 'article/listBuilding',
    2: 'article/listTravel',
    3: 'article/listHome'
  }
  let url = obj[type];
  return request(`${_baseApi}/${url}`, {
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
