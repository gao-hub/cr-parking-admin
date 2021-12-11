import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'tripAccountManage',

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
      return yield call(api.getModifyInfo, payload)
    },
    *modifyManage({ payload }, { call, put }) {
      return yield call(api.modifyManage, payload);
    },
    *withdraw({ payload }, { call, put }) {
      return yield call(api.withdraw, payload);
    },
    *lianlianSmsCode({ payload }, { call, put }) {
      return yield call(api.lianlianSmsCodeApi, payload);
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
