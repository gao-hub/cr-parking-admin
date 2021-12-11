import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'activityMessage',
  state: {
    message: {
      list: [],
      total: '',
      searchInfo: {},
    },
    record: {
      list: [],
      total: '',
      searchInfo: {},
    },
  },
  effects: {
    *getMessageList({ payload }, { call, put }) {
      const response = yield call(api.getMessageList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setMessageList',
          payload: response.data.recordList,
        });
        yield put({
          type: 'setMessageTotal',
          payload: response.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *setMessageSearchInfo({ payload }, { put }) {
      yield put({
        type: 'setMessageSearch',
        payload,
      });
    },
    *getMessageDetail({ payload }, { call }) {
      return yield call(api.getMessageDetail, payload);
    },
    *addMessage({ payload }, { call }) {
      return yield call(api.addMessage, payload);
    },
    *editMessage({ payload }, { call }) {
      return yield call(api.editMessage, payload);
    },
    *deleteMessage({ payload }, { call }) {
      return yield call(api.deleteMessage, payload);
    },

    *getRecordList({ payload }, { call, put }) {
      const response = yield call(api.getRecordList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setRecordList',
          payload: response.data.recordList,
        });
        yield put({
          type: 'setRecordTotal',
          payload: response.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *setRecordSearchInfo({ payload }, { put }) {
      yield put({
        type: 'setRecordSearch',
        payload,
      });
    },
  },
  reducers: {
    setMessageList(state, { payload }) {
      return {
        ...state,
        message: {
          ...state.message,
          list: payload,
        },
      };
    },
    setMessageTotal(state, { payload }) {
      return {
        ...state,
        message: {
          ...state.message,
          total: payload,
        },
      };
    },
    setMessageSearch(state, { payload }) {
      return {
        ...state,
        message: {
          ...state.message,
          searchInfo: payload,
        },
      };
    },
    setRecordList(state, { payload }) {
      return {
        ...state,
        record: {
          ...state.record,
          list: payload,
        },
      };
    },
    setRecordTotal(state, { payload }) {
      return {
        ...state,
        record: {
          ...state.record,
          total: payload,
        },
      };
    },
    setRecordSearch(state, { payload }) {
      return {
        ...state,
        record: {
          ...state.record,
          searchInfo: payload,
        },
      };
    },
  },
};
