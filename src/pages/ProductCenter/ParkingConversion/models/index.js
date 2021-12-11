import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services/index';

export default {
  namespace: 'parkingConversionModel',

  state: {
    list: [], //   列表
    total: '', //   总条数
    searchInfo: {}, //  搜索条件
    info: null,
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
    *fetchInfo({ payload }, { call, put }) {
      const response = yield call(api.getInfo, payload);
      if (response && response.status === 1) {
        const { data = {} } = response;

        yield put({
          type: 'setInfo',
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
    setInfo(state, { payload }) {
      return {
        ...state,
        info: payload,
      };
    },
  },
};
