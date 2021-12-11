import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'accountManage',
  state: {
    official: {
      list: [],
      total: '',
      searchInfo: {},
    },
    inside: {
      list: [],
      total: '',
      searchInfo: {},
    },
  },
  effects: {
    *getOfficialList({ payload }, { call, put }) {
      const response = yield call(api.getList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setOfficialList',
          payload: response.data.recordList,
        });
        yield put({
          type: 'setOfficialTotal',
          payload: response.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *setOfficialSearchInfo({ payload }, { put }) {
      yield put({
        type: 'setOfficialSearch',
        payload,
      });
    },
    *getDetail({ payload }, { call }) {
      return yield call(api.getDetail, payload);
    },
    *addAccount({ payload }, { call }) {
      return yield call(api.addAccount, payload);
    },
    *editAccount({ payload }, { call }) {
      return yield call(api.editAccount, payload);
    },
    *deleteAccount({ payload }, { call }) {
      return yield call(api.deleteAccount, payload);
    },
    *setStatus({ payload }, { call }) {
      return yield call(api.setStatus, payload);
    },
    *getInsideList({ payload }, { call, put }) {
      const response = yield call(api.getList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setInsideList',
          payload: response.data.recordList,
        });
        yield put({
          type: 'setInsideTotal',
          payload: response.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *setInsideSearchInfo({ payload }, { put }) {
      yield put({
        type: 'setInsideSearch',
        payload,
      });
    },
  },
  reducers: {
    setOfficialList(state, { payload }) {
      return {
        ...state,
        official: {
          ...state.official,
          list: payload,
        },
      };
    },
    setOfficialTotal(state, { payload }) {
      return {
        ...state,
        official: {
          ...state.official,
          total: payload,
        },
      };
    },
    setOfficialSearch(state, { payload }) {
      return {
        ...state,
        official: {
          ...state.official,
          searchInfo: payload,
        },
      };
    },
    setInsideList(state, { payload }) {
      return {
        ...state,
        inside: {
          ...state.inside,
          list: payload,
        },
      };
    },
    setInsideTotal(state, { payload }) {
      return {
        ...state,
        inside: {
          ...state.inside,
          total: payload,
        },
      };
    },
    setInsideSearch(state, { payload }) {
      return {
        ...state,
        inside: {
          ...state.inside,
          searchInfo: payload,
        },
      };
    },
  },
};
