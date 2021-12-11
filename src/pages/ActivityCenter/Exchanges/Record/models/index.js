import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'exchangeRecord',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    channelOption: [], // 渠道select
  },

  effects: {
    * getList({ payload }, { call, put }) {
      const response = yield call(api.getList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(response.data.records, payload.currPage, payload.pageSize);
        yield put({
          type: 'setList',
          payload: response.data.records,
        });
        yield put({
          type: 'setTotal',
          payload: response.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    // 发货
    * sendGoods({ payload }, { call }) {
      return yield call(api.sendGoods, payload);
    },
    // 修改物流信息
    * editExpress({ payload }, { call }) {
      return yield call(api.editExpress, payload);
    },
    // 导出
    * exportFile({ payload }, { call }) {
      return yield call(api.exportFile, payload);
    },
    // 获取select
    *getSelect({payload}, {call, put}) {
      const res = yield call(api.getSelect, payload);
      if (res && res.status === 1) {
        yield put({
          type: 'setChannelSelect',
          payload: res.data.parentUtmTypes
        })
      }
    }
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
    setChannelSelect(state, {payload}) {
      return {
        ...state,
        channelOption: payload
      }
    }
  },
};
