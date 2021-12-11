import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
import exportExcel from '@/utils/exportExcel';

// 获取列表
export async function fetchList(params) {
  return request(`${_baseApi}/platformAccount/list`, {
    method: 'POST',
    body: params
  });
}

// 同步数据
export async function asyncData(params) {
  return request(`${_baseApi  }/platformAccount/synchro`, {
    method: 'POST',
    body: params
  });
}


// 提现提交
export async function withdrawSubmit(params) {
  // {
  //   "accountCode": "",
  //   "amount": 0,
  //   "cardNo": ""
  // }
  return request(`${_baseApi  }/platformAccountWithdraw/withdraw`, {
    method: 'POST',
    body: params
    // body: {
    //   accountCode: 'MCHOWN'
    // }
  });
}

// 划拨提交
export async function transferData(params) {
  return request(`${_baseApi  }/platformAccount/transfer`, {
    method: 'POST',
    body: params
  });
}

// 充值初始化
export async function rechargeInfoData(params) {
  return request(`${_baseApi  }/platformAccount/recharge-info`, {
    method: 'POST',
    body: params
    // body: {
    //   accountCode: 'MCHOWN'
    // }
  });
}

// 提现初始化
export async function withdrawInfoData(params) {
  return request(`${_baseApi  }/platformAccount/withdraw-info`, {
    method: 'POST',
    body: params
    // body: {
    //   accountCode: 'MCHOWN'
    // }
  });
}
