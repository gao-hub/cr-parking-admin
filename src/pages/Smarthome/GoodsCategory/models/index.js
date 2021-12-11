import { notification } from 'antd';
import { addListKey, addParent } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'goodsCategoryManage',

  state: {
    list: [], //   列表
    total: '', //   总条数
    appList: [], //   应用列表
    appTotal: '', //
    searchInfo: {}, //   搜索信息
    tableIndex: null, //
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const res = yield call(api.fetchList, payload);
      if (res && res.status === 1) {
        res.data.records = addListKey(res.data.records, payload.currPage, payload.pageSize);
        res.data.records = addParent(res.data.records);
        yield put({
          type: 'setList',
          payload: res.data.records,
        });
        yield put({
          type: 'setTotal',
          payload: res.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: res.statusDesc,
        });
      }
    },
    *addCategory({ payload }, { call }) {
      return yield call(api.addCategory, payload);
    },
    *fetchAppList({ payload }, { call, put }) {
      const res = yield call(api.fetchAppList, payload);
      if (res && res.status === 1) {
        res.data.records = addListKey(res.data.records, payload.currPage, payload.pageSize);

        yield put({
          type: 'setAppList',
          payload: res.data.records,
        });
        yield put({
          type: 'setAppTotal',
          payload: res.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: res.statusDesc,
        });
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
    setAppList(state, { payload }) {
      return {
        ...state,
        appList: payload,
      };
    },
    setAppTotal(state, { payload }) {
      return {
        ...state,
        appTotal: payload,
      };
    },
    setTableIndex(state, { payload }) {
      return {
        ...state,
        tableIndex: payload,
      };
    },
  },
};
