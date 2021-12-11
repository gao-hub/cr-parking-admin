import { queryNotices, queryMenuData, queryPermission, queryCommonInfo } from '@/services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    menus: [],
    commonInfo: {}
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    // 获取菜单
    *fetchMenus({ payload }, { put, call }) {
      // 获取权限
      const permissionList = yield call(queryPermission);
      // 保存权限信息到localStorage
      if (permissionList && permissionList.status === 1) localStorage.setItem('permission', JSON.stringify(permissionList))
      const response = yield call(queryMenuData);
      if(response && response.data && response.status == 1) {
        response.data.unshift({
          icon: "icon-gongzuotai",
          key: 0,
          title: "我的工作台",
          url: "/dashboard/default",
        })
      } else {
        response.data = []
      }
      yield put({
        type: 'setMenuDate',
        payload: response.data,
      });
    },
    // 获取公用信息
    *fetchCommonInfo({ payload }, { put, call}) {
      const commonInfo =  yield call(queryCommonInfo);
      if(commonInfo && commonInfo.status == 1) {
        yield put({
          type: 'setCommenInfo',
          payload: commonInfo.data
        })
      }
    }
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    setMenuDate(state, { payload }) {
      return {
        ...state,
        menus: payload,
      };
    },
    setCommenInfo(state, { payload }) {
      return {
        ...state,
        commonInfo: payload
      }
    }
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
