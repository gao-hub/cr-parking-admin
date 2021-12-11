import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'tripProductManage',

  state: {
    list: [], //   列表
    total: 0, // 数据总条数
    numJson: {}, //   表格底部数据
    searchInfo: {}, //  搜索条件
    backSearchInfo: {}, //  到期退货搜索条件
    modifyInfoData: {}, //  修改详情
    initData: [],
    autoSaleData:0,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.mockList, payload);
      if (response && response.status === 1) {
        const { data = {} } = response;
        let { records = [] } = data;
        records = addListKey(records, payload.currPage, payload.pageSize);
        yield put({
          type: 'setList',
          payload: records,
        });
        yield put({
          type: 'setTotal',
          payload: data.total,
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

    *getModifyInfo({ payload }, { call, put }) {
      const response = yield call(api.getModifyInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setModifyInfo',
          payload: response.data,
        });
      }
      return response;
    },


    *updateAutoSale({ payload }, { call }) {
      return yield call(api.updateAutoSale, payload);
    },

    *getAutoSale({ payload }, { call, put }) {
      return yield call(api.getAutoSale, payload);
    },

    *updateRecommend({ payload }, { call }) {
      return yield call(api.updateRecommend, payload);
    },
    *updateSale({ payload }, { call }) {
      return yield call(api.updateSale, payload);
    },
    *updateTag({ payload }, { call }) {
      return yield call(api.updateTag, payload);
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
    setAutoSaleData(state, { payload }) {
      return {
        ...state,
        autoSaleData: payload,
      };
    },
  },
};
