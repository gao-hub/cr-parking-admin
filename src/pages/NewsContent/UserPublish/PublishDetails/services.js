import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';

// 获取详情信息
export async function getPublishInfo(params) {
  return request(`${_baseApi}/article/info`, {
    method: 'POST',
    body: params,
  });
}

// 获取图片视频详情信息
export async function getPublishInfoForImage(params) {
  return request(`${_baseApi}/article/infoVM`, {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function examineApi(params) {
  return request(`${_baseApi}/article/auditForUser`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deletePublish(params) {
  return request(`${_baseApi}/article/delete`, {
    method: 'POST',
    body: params,
  });
}

//专栏
export async function getContactType(params) {
  return request(`${_baseApi}/article/getAllSelect`, {
    method: 'POST',
    body: params,
  });
}

export function getDefaultImage() {
  return request(_baseApi + '/activityPrize/redEnvelopeImg', {
    method: 'POST',
    body: {}
  });
}

//获取凭证
export function getPlayAuth(params) {
  return request(_baseApi + '/articleConfig/getVideoPlayAuth', {
    method: 'POST',
    body: params
  });
}

