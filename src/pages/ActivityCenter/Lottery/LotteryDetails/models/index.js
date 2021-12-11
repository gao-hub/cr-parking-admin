import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'lotteryDetails',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    parentUtmTypes: []
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
        yield put({
          type: 'setTotal',
          payload: response.data.total
        })
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
    },

    // 信息导出
    *exportFile({ payload }, { call }) {
      yield call(api.exportFile, payload)
    },
    *getAllSelect({ payload }, { call, put }) {
      const response = yield call(api.getAllSelect, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setParentUtmTypes',
          payload: response.data.parentUtmTypes || [],
        })
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
      return response;
    },
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload
      };
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload
      };
    },
    setParentUtmTypes(state, { payload }) {
      return {
        ...state,
        parentUtmTypes: payload
      };
    },
  }
};
