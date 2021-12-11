import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 列表
export async function fetchList(params) {
  return request(_baseApi + '/searchConfig/list', {
    method: 'POST',
    body: params,
  });
}

//   添加
export async function addManage(params) {
  return request(_baseApi + '/searchConfig/add', {
    method: 'POST',
    body: params,
  });
}

//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/searchConfig/update', {
    method: 'POST',
    body: params,
  });
}

//   删除
export async function deleteManage(params) {
  return request(_baseApi + '/searchConfig/delete', {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/ad/info', {
    method: 'POST',
    body: params
  });
}

//    启用禁用
export async function updateStatus(params) {
  return request(_baseApi + '/searchConfig/open', {
    method: 'POST',
    body: params,
  });
}


// 获取标签下拉框
export async function getAllSelect(params) {
  return request(`${_baseApi}/travelTab/select`, {
    method: 'POST',
    body: params
  });
}
