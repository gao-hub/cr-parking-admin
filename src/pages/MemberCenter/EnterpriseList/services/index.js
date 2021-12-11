import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';
// import exportExcel from '@/utils/exportExcel';
import exportZip from '@/utils/exportZip';

// 测试列表
export async function mockList(params) {
  return request(`${_baseApi}/businessUser/list`, {
    method: 'POST',
    body: params,
  });
}

//   改变数据状态
export async function statusChangeManage(params) {
  return request(`${_baseApi}/businessUser/synchro/${params.id}`, {
    method: 'POST',
    body: params,
  });
}

//   会员下载身份信息
export async function downloadMember(params) {
  return exportZip(`${_baseApi}/user/download/${params}`, {
    method: 'POST',
  });
}

// 充值初始化
export async function rechargeInfoData(params) {
  return request(`${_baseApi}/businessAccount/recharge-info`, {
    method: 'POST',
    body: params,
    // body: {
    //   userId: 1
    // }
  });
}

// 提现交易密码提交接口
export async function withdrawTradePsdSubmitApi(params) {
  return request(`${_baseApi}/businessAccount/withdraw`, {
    method: 'POST',
    body: params,
  });
}

// 提现短信验证提交接口
export async function withdrawSmsCodeSubmitApi(params) {
  return request(`${_baseApi}/businessAccount/validationSms`, {
    method: 'POST',
    body: params,
  });
}

// 获取验证码
export async function getCode(params) {
  return request(`${_baseApi}/businessAccount/sendSmsCode`, {
    method: 'POST',
    body: params,
  });
}
// 获取验证码2
export async function getCodeSecond(params) {
  return request(`${_baseApi}/businessAccount/updateMobile`, {
    method: 'POST',
    body: params,
  });
}
// 修改手机号
export async function updateMobile(params) {
  return request(`${_baseApi}/businessAccount/updateMobileVerify`, {
    method: 'POST',
    body: params,
  });
}

// 修改交易密码
export async function updatePassWord(params) {
  return request(`${_baseApi}/businessAccount/reset`, {
    method: 'POST',
    body: params,
  });
}

