import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'platformAccountDetailManage',

  state: {
    list: [],  //   列表
    initData: [], // 初始化下拉框
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
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
    *initSelect({ payload }, { call, put }) {
      const response = yield call(api.initSelect, payload);
      if(response && response.status == 1) {
        yield put({
          type: 'setInitData',
          payload: response.data
        })
      }
    },
    *asyncData({ payload }, { call }) {
      return yield call(api.asyncData, payload);
    },
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload
      };
    },
    setInitData(state, { payload }) {
      return {
        ...state,
        initData: payload
      }
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload
      };
    }
  }
};
