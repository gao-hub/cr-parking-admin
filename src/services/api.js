import { stringify } from 'qs';
import request from '@/utils/request';
import { _baseApi } from '@/defaultSettings.js';

// import { _baseApi } from '@/defaultSettings.js';

/** 本地开发登录接口
 * 本地使用mock假数据登录时登录
 */
export async function developLogin(params) {
  return request('/bace-admin/system/login?validateCode=' + params.validateCode, {
    method: 'POST',
    body: params,
  });
}
/** 本地开发登录接口
 * 本地使用mock假数据登录时登录
 */
export async function accountLogin(params) {
  return request(_baseApi + '/system/login?validateCode=' + params.validateCode, {
    method: 'POST',
    body: params,
  });
}
//  修改手机号 获取手机号验证码
export async function getFakeCaptcha(mobile) {
  return request(`${_baseApi}/user/password/sendCode?validateCode=${mobile.captcha}`, {
    method: 'POST',
    body: mobile,
  });
}

//   下一步验证
export async function nextStep(params) {
  return request(`${_baseApi}/user/password/verifyCode`, {
    method: 'POST',
    body: params,
  });
}

//   重置密码   第二步  提交按钮
export async function ResetPwd(params) {
  return request(`${_baseApi}/user/password/resetPassword`, {
    method: 'POST',
    body: params,
  });
}

//   登录以后   根据旧密码修改新密码
export async function changePassword(params) {
  return request(`${_baseApi}/system/updatePassword`, {
    method: 'POST',
    body: params,
  });
}

//   获取菜单
export async function queryMenuData(params) {

  //  开发菜单  `/bace-admin/menu_data`
  //  联调菜单  `${_baseApi}/system/menu/tree`
  return request(`${_baseApi}/system/menu/tree`, {
    method: 'POST',
    body: params
  });
}

// 获取权限
export async function queryPermission(params) {
  //  联调时打开
  return request(_baseApi + '/system/menu/perms',{
    method: 'POST',
    body: params
  });
}

// 获取公用信息
export async function queryCommonInfo(params) {
  return request(_baseApi + '/index/initConfig', {
    method: 'POST',
    body: params
  });
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}


export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}


