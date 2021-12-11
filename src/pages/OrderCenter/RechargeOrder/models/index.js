import { notification, message } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'rechargeOrder',

  state: {
    list: [],
    total: '',
    searchInfo: {},
    initData: {},
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(api.getRechargeOrderList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setList',
          payload: response.data.recordList,
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
    *exportFile({ payload }, { call }) {
      const response = yield call(api.exportFiles, payload);
      if (response && response.statusDesc) {
        message.error(response.statusDesc);
      }
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
  },
};
