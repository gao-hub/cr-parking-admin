import moment from 'moment';
import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'accountManagement',
  state: {
    blackList: [], // 黑名单列表
    channelList: [], // 一级渠道下拉框
    userInfo: {},
    total: 0, // 总条数
    searchInfo: {}, //  搜索条件
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.getBlackList, payload);
      if (response && response.status === 1) {
        response.data.records = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setList',
          payload: response.data.records,
        });
        yield put({
          type: 'setTotal',
          payload: response.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *fetchSelect({ payload }, { call, put }) {
      const response = yield call(api.getAllSelect, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setChannelList',
          payload: response.data.parentUtmTypes,
        });
      }
    },

    *getUserByUserName({ payload }, { call, put }) {
      const response = yield call(api.getUserByUserName, payload);
      // if (response && response.status === 1) {
      //   yield put({
      //     type: 'setUserInfo',
      //     payload: response.data,
      //   });
      // } else {
      //   notification.error({
      //     message: '请求错误',
      //     description: response.statusDesc,
      //   });
      // }
      if (response && response.status !== 1) {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
      yield put({
        type: 'setUserInfo',
        payload: response.data,
      });
    },

    *addBlackUser({ payload }, { call }) {
      return yield call(api.addBlackUser, payload);
    },
    *deleteBlackUser({ payload }, { call }) {
      return yield call(api.deleteBlackUser, payload);
    },
  },
  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        blackList: payload,
      };
    },
    setTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
    setChannelList(state, { payload }) {
      return {
        ...state,
        channelList: payload,
      };
    },
    setUserInfo(state, { payload }) {
      return {
        ...state,
        userInfo: payload,
      };
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload,
      };
    },
  },
};
