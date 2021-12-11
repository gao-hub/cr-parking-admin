import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 测试列表
export async function fetchList(params) {
  // /protocolTemplate/list
  return request(_baseApi + '/protocolTemplate/list', {
    method: 'POST',
    body: params
  });
}

// 获取弹出框下拉菜单接口
export async function selectlist(payload) {
  return request(_baseApi + '/protocolTemplate/getAllSelect', {
    method: 'GET'
  });
}

// 获取模态框已有数据接口
export async function infoInfoAction(payload) {
  return request(_baseApi + '/manager/protocol/infoInfoAction', {
    method: 'POST',
    body: payload
  });
}

// 修改信息接口
export async function updateAction(payload) {
  return request(_baseApi + '/protocolTemplate/update', {
    method: 'POST',
    body: payload
  });
}

// 修改已存在的协议模板接口
export async function updateExistProtocol(payload) {
  return request(_baseApi + '/protocolTemplate/updateExistAction', {
    method: 'POST',
    body: payload
  });
}


// 检验字段唯一的接口
export async function validationProtocolNameAction(payload) {
  return request(_baseApi + '/protocolTemplate/validationProtocolNameAction', {
    method: 'POST',
    body: payload
  });
}

//   添加
export async function insertAction(params) {
  return request(_baseApi + '/protocolTemplate/add', {
    method: 'POST',
    body: params
  });
}

//   删除
export async function deleteManage(params) {
  return request(_baseApi + '/protocolTemplate/delete/' + params.id, {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  // protocolTemplate/info
  return request(`${_baseApi}/protocolTemplate/info/${params.id}`, {
    method: 'POST',
    body: params
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(_baseApi + '/protocolTemplate/export', {
    method: 'POST',
    body: params
  });
}
