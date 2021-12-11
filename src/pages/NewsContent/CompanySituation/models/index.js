import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'companySituation',

  state: {
    list: [],
    total: '',
    searchInfo: {},
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(api.getList, payload);
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
    *addData({ payload }, { call }) {
      return yield call(api.addData, payload);
    },
    *editData({ payload }, { call }) {
      return yield call(api.editData, payload);
    },
    *getData({ payload }, { call }) {
      return yield call(api.getData, payload);
    },
    *setStatus({ payload }, { call }) {
      return yield call(api.setStatus, payload);
    },
    *deleteData({ payload }, { call }) {
      return yield call(api.deleteData, payload);
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
