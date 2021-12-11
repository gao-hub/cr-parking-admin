import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'SmarthomeOrderManage',

  state: {
    list: [], //   列表
    total: 0, // 数据总条数
    searchInfo: {}, //  搜索条件
    storeCategoryList: [],
    orderInfo: null,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.getList, payload);
      if (response && response.status === 1) {
        const { data = {} } = response;
        let { records = [] } = data;
        records = addListKey(records, payload.currPage, payload.pageSize);
        yield put({
          type: 'setList',
          payload: records,
        });
        yield put({
          type: 'setTotal',
          payload: data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *getSelectStoreCategoryList({ payload }, { call, put }) {
      const response = yield call(api.getSelectStoreCategoryList, payload);
      yield put({
        type: 'setStoreCategoryList',
        payload: response,
      });
    },
    *getOrderInfo({ payload }, { call, put }) {
      const response = yield call(api.getInfo, payload);
      if (response && response.status === 1) {
        const { data = {} } = response;
        yield put({
          type: 'setOrderInfo',
          payload: data,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *exportFile({ payload }, { call }) {
      yield call(api.exportFile, payload);
    },
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    setTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload,
      };
    },
    setStoreCategoryList(state, { payload }) {
      return {
        ...state,
        storeCategoryList: payload,
      };
    },
    setOrderInfo(state, { payload }) {
      return {
        ...state,
        orderInfo: payload,
      };
    },
  },
};
