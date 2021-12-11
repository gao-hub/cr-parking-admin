import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function fetchList(params) {
  return request(`${_baseApi}/memberGrowthDetail/list`, {
    method: 'POST',
    body: params,
  });
}


//  获取渠道下拉列表
export async function  parentUtmSelector(params) {
  return request(`${_baseApi}/integralBlacklist/parentUtmSelector`, {
    method: 'POST',
    body: params,
  });
}

//   获取成长值类型下拉列表
export async function  growupTypeSelector(params) {
  return request(`${_baseApi}/memberGrowthDetail/selector`, {
    method: 'POST',
    body: params,
  });
}


// 导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/memberGrowthDetail/export`, {
    method: 'POST',
    body: params,
  });
}
