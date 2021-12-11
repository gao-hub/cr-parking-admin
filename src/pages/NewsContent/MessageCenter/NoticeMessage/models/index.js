import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'noticeMessage',

  state: {
    list: [],
    total: '',
    searchInfo: {},
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(api.getNoticeList, payload);
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
    *addNotice({ payload }, { call }) {
      return yield call(api.addNotice, payload);
    },
    *editNotice({ payload }, { call }) {
      return yield call(api.editNotice, payload);
    },
    *getNotice({ payload }, { call }) {
      return yield call(api.getNotice, payload);
    },
    *deleteNotice({ payload }, { call }) {
      return yield call(api.deleteNotice, payload);
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
