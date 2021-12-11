import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'msgConfig',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    modifyInfo: {}
  },

  effects: {
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
