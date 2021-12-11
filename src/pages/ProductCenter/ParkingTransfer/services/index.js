import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 测试列表
export async function mockList(params) {
  return request(`${_baseApi}/transfer/list`, {
    method: 'POST',
    body: params,
  });
}

//   修改
export async function modifyManage(params) {
  return request(`${_baseApi}/transfer/update`, {
    method: 'POST',
    body: params,
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(`${_baseApi}/transfer/info`, {
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

// 获取下拉框数据
export async function getAllSelect(params) {
  return request(`${_baseApi}/transfer/statusList`, {
    method: 'POST',
    body: params,
  });
}

// 获取下拉框数据
export async function getChannelList() {
  return request(`${_baseApi}/user/getAllSelect`, {
    method: 'GET',
  });
}
