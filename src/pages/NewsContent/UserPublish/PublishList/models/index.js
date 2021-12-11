import moment from 'moment';
import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
export default {
  namespace: 'userRelease',
  state: {
    list: [],
    total: 0, // 总条数
    searchInfo: {}, //  搜索条件
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.fetchList, payload);
      if (response && response.status === 1) {
        response.data.records = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setList',
          payload: response.data.records
        });
        yield put({
          type: 'setTotal',
          payload: response.data.total
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *deleteList({ payload }, { call }) {
      return yield call(api.deleteList, payload);
    }
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
  }
}