import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function mockList(params) {
  return request(_baseApi + '/news/list', {
    method: 'POST',
    body: params,
  });
}

//   添加
export async function addManage(params) {
  return request(_baseApi + '/news/add', {
    method: 'POST',
    body: params,
  });
}

//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/news/update', {
    method: 'POST',
    body: params,
  });
}

//   删除
export async function deleteManage(params) {
  return request(_baseApi + '/news/delete/'+params.id, {
    method: 'POST',
    body: params,
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/news/info/'+params.id, {
    method: 'POST',
    body: params,
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/news/export', {
    method: 'POST',
    body: params,
  });
}

// 获取拉菜单接口
export async function initSelect(payload) {
  return request(_baseApi + '/news/getAllSelect', {
    method: 'GET'
  });
}


// 启用禁用
export async function updateStatus(params) {
  const {id, newsStatus} = params;
  return request(_baseApi + '/news/updateStatus', {
    method: 'POST',
    body: {
      id, 
      newsStatus
    },
  });
}
