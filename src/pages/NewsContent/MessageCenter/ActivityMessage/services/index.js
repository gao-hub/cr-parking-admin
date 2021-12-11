import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 获取活动消息列表
export async function getMessageList(params) {
  return request(`${_baseApi}/activityMsgPlan/list`, {
    method: 'POST',
    body: params,
  });
}

// 获取活动消息详情
export async function getMessageDetail(params) {
  return request(`${_baseApi}/activityMsgPlan/info`, {
    method: 'POST',
    body: params,
  });
}

// 新增活动消息
export async function addMessage(params) {
  return request(`${_baseApi}/activityMsgPlan/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑活动消息
export async function editMessage(params) {
  return request(`${_baseApi}/activityMsgPlan/update`, {
    method: 'POST',
    body: params,
  });
}

// 删除活动消息
export async function deleteMessage(params) {
  return request(`${_baseApi}/activityMsgPlan/delete`, {
    method: 'POST',
    body: params,
  });
}

// 获取信息记录列表
export async function getRecordList(params) {
  return request(`${_baseApi}/activityMsgLog/list`, {
    method: 'POST',
    body: params,
  });
}
