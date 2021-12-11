import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings';
import exportExcel from '@/utils/exportExcel';

// 列表
export async function fetchList(params) {
  return request(`${_baseApi}/integralGoods/list`, {
    method: 'POST',
    body: params,
  });
}


//   添加商品
export async function addManage(params) {
  return request(`${_baseApi}/integralGoods/add`, {
    method: 'POST',
    body: params,
  });
}

//   计算商品积分
export async function  caculateGoodsIntegral(params) {
  return request(`${_baseApi}/integralConfig/caculateGoodsIntegral`, {
    method: 'POST',
    body: params,
  });
}


//   修改商品
export async function modifyManage(params) {
  return request(`${_baseApi}/integralGoods/update`, {
    method: 'POST',
    body: params,
  });
}


//    获取详情
export async function getModifyInfo(params) {
  return request(`${_baseApi}/integralGoods/info`, {
    method: 'POST',
    body: params,
  });
}

//    上下架
export async function updateStatus(params) {
  return request(`${_baseApi}/integralGoods/highLow`, {
    method: 'POST',
    body: params,
  });
}

//    取消推荐
export async function cancelCommended(params) {
  return request(`${_baseApi}/integralGoods/recommend`, {
    method: 'POST',
    body: params,
  });
}

// 导出
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/integralGoods/export`, {
    method: 'POST',
    body: params,
  });
}
