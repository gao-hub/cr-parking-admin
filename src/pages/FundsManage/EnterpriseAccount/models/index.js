import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'enterpriseAccountManage',

  state: {
    list: [],  //   列表
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
    // 更新
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
    setSearchInfo( state,{ payload }){
      return {
        ...state,
        searchInfo: payload
      }
    }
  }
};
