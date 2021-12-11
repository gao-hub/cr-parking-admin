import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';




//   添加
export async function addManage(params) {
  return request(_baseApi + '/activityRedPacket/add', {
    method: 'POST',
    body: params
  });
}
//   修改
export async function modifyManage(params) {
  return request(_baseApi + '/activityRedPacket/update', {
    method: 'POST',
    body: params
  });
}

//    获取详情
export async function getModifyInfo(params) {
  return request(_baseApi + '/activityRedPacket/info', {
    method: 'POST',
    body: params
  });
}

