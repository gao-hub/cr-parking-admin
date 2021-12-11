import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { message } from 'antd';
import * as api from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      //  联调时此处修改为
      const response = yield call(api.accountLogin, payload);
      //  本地开发时使用此登录方法
      // const response = yield call(api.developLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          currentAuthority: payload.username,
        },
      });
      // Login successfully
      if (response && response.status === 1) {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      } else {
        callback()
        message.error(response.statusDesc);
      }
    },
    *nextStep({ payload }, { call }) {
      return yield call(api.nextStep, payload);
    },

    *getCaptcha({ payload }, { call }) {
      return yield call(api.getFakeCaptcha, payload);
    },
    //   重置密码第二步
    *ResetPwd({ payload }, { call }) {
      return yield call(api.ResetPwd, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: null,
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        })
      );
    },
    //   使用旧密码更改密码
    *changePassword({ payload }, { call }) {
      return yield call(api.changePassword, payload);
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
