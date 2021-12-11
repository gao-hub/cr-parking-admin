import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'lotteryBlacklist',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    userInfoData:{},  //用户信息
    parentUtmTypes: []
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.fetchList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'setList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
    },

    *add({ payload }, { call }) {
      return yield call(api.add, payload);
    },

    // 获取用户信息
    *searchUser({ payload }, { call, put }) {
      const response = yield call(api.getUserInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setUserInfo',
          payload: response.data,
        })
      }
      return response;
    },

    // 删除
    *deleteData({ payload }, { call }) {
      return yield call(api.deleteData, payload);
    },
    *getAllSelect({ payload }, { call, put }) {
      const response = yield call(api.getAllSelect, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setParentUtmTypes',
          payload: response.data.parentUtmTypes,
        })
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
      return response;
    },
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload
      };
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload
      };
    },

    setUserInfo(state, { payload }) {
      return {
        ...state,
        userInfoData: payload
      };
    },
    setParentUtmTypes(state, { payload }) {
      return {
        ...state,
        parentUtmTypes: payload
      };
    },
  }
};
