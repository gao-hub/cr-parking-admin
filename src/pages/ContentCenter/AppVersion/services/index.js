import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/appVersion/list', {
    method: 'POST',
    body: params,
  });
}

//   添加
export async function addManage(params) {
  return request(_baseApi + '/appVersion/add', {
    method: 'POST',
    body: params,
  });
}

//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/appVersion/update', {
    method: 'POST',
    body: params,
  });
}

//   删除
export async function deleteManage(params) {
  return request(_baseApi + '/appVersion/delete', {
    method: 'POST',
    body: params,
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/appVersion/info', {
    method: 'POST',
    body: params,
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/appVersion/export', {
    method: 'POST',
    body: params,
  });
}

// 获取下拉列表汇总
export async function getSelectListApi() {
  return request(_baseApi + '/appVersion/getAllSelect', {
    method: 'GET',
  });
}
