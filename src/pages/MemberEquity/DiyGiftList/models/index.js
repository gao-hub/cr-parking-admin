import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'diyGiftConfig',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    modifyInfo: undefined
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
    // 新增
    *addManage({ payload }, { call, put }) {
      return yield call(api.addManage, payload);
    },
   
    *getModifyInfo({ payload }, { call, put }) {
      const response =  yield call(api.getModifyInfo, payload)
      if(response && response.status == 1){
        yield put({
          type: 'setModifyInfo',
          payload: response.data
        })
      }
    },
    *modifyManage({ payload }, { call, put }) {
      return yield call(api.modifyManage, payload);
    },
    *deleteData({ payload }, { call }) {
      return yield call(api.deleteData, payload);
    },
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload
      };
    },
    setModifyInfo(state, { payload }) {
      return {
        ...state,
        modifyInfo: payload
      }
    }
  }
};
