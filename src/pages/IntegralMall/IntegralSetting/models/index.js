import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import moment from 'moment';
import * as api from '../services';

export default {
  namespace: 'IntegralSetting',

  state: {
    infoData: {} // 存储积分汇率详情
  },

  effects: {
    *getInfoData({ payload }, { call, put }) {
      const response = yield call(api.getInfoData, payload);
      if (response && response.status === 1) {
        const data = response.data;
        yield put({
          type: 'setInfoData',
          payload: data,
        });
      }
      return response;
    },
    *saveManage({ payload }, { call, put }) {
      const response = yield call(api.saveManage, payload);
      return response;
    }

  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    setInfoData(state, { payload }) {
      return {
        ...state,
        infoData: payload,
      };
    }

    
  },
};
