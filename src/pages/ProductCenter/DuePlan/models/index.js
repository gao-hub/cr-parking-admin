import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'duePlanManage',

  state: {
    list: [], //   列表
    total: '', //   总条数
    numJson: {}, //   表格底部数据
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
    initData: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.mockList, payload);
      if (response && response.status === 1) {
        const { data = {} } = response;
        const { parkingOrderDueVOIPage = {}, sumAmount = {} } = data;
        let { records = [] } = parkingOrderDueVOIPage;
        records = addListKey(records, payload.currPage, payload.pageSize);

        yield put({
          type: 'setList',
          payload: records,
        });
        yield put({
          type: 'setTotal',
          payload: parkingOrderDueVOIPage.total,
        });
        yield put({
          type: 'setNumJson',
          payload: sumAmount,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *statusChangeManage({ payload }, { call }) {
      return yield call(api.statusChangeManage, payload);
    },
    *getAllSelect({ payload }, { call, put }) {
      const response = yield call(api.getAllSelect, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setInitData',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
      return response;
    },
    *exportFile({ payload }, { call }) {
      yield call(api.exportFile, payload);
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
    setModifyInfo(state, { payload }) {
      return {
        ...state,
        modifyInfoData: payload,
      };
    },
    setInitData(state, { payload }) {
      return {
        ...state,
        initData: payload,
      };
    },
    setNumJson(state, { payload }) {
      return {
        ...state,
        numJson: payload,
      };
    },
  },
};
