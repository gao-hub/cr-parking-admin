import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';


//   保存
export async function saveManage(params) {
  return request(`${_baseApi}/memberConfigLog/update`, {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getInfoData(params) {
  return request(`${_baseApi}/memberConfig/info`, {
    method: 'POST',
    body: params,
  });
}



