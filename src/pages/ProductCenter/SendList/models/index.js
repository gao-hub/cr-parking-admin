import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'sendManage',

  state: {
    list: [], //   列表
    total: '', //   总条数
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
    totalAmount: 0, // 待发放金额总计
    returnList: [], //   到期退货列表
    returnTotal: '', //   到期退货总条数
    returnSearchInfo: {}, //  到期退货搜索条件
    returnTotalAmount: 0, // 到期退货金额总计,
    initData: {},
  },

  effects: {
    *postManualDistributionRentReturns({ payload }, { call }) {
      return yield call(api.postManualDistributionRentReturns, payload);
    },
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.mockList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
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
    // 到期退货
    *returnFetchList({ payload }, { call, put }) {
      const response = yield call(api.returnFetchList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'save',
          payload: {
            returnList: response.data.records,
            returnTotal: response.data.total,
          },
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *sumData({ payload }, { call, put }) {
      const response = yield call(api.sumData, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setTotalAmount',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *returnSumData({ payload }, { call, put }) {
      const response = yield call(api.returnSumData, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'save',
          payload: {
            returnTotalAmount: response.data ? response.data : {},
          },
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *batchAllocate({ payload }, { call }) {
      return yield call(api.batchAllocate, payload);
    },

    *returnBatchAllocate({ payload }, { call }) {
      return yield call(api.returnBatchAllocate, payload);
    },

    // 信息导入
    *importFile({ payload }, { call }) {
      const response = yield call(api.importFile, payload);
      if (response && response.status === 1) {
        return true;
      }
      return response.statusDesc;
    },
    // 到期退货信息导出
    *exportFile({ payload }, { call }) {
      yield call(api.exportFile, payload);
    },

    *returnExportFile({ payload }, { call }) {
      yield call(api.returnExportFile, payload);
    },

    // 同步状态
    *asyncData({ payload }, { call }) {
      return yield call(api.asyncData, payload);
    },
    // 同步状态
    *returnAsyncData({ payload }, { call }) {
      return yield call(api.returnAsyncData, payload);
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
    setReturnSearchInfo(state, { payload }) {
      return {
        ...state,
        returnSearchInfo: payload,
      };
    },
    setTotalAmount(state, { payload }) {
      return {
        ...state,
        totalAmount: payload,
      };
    },
    setModifyInfo(state, { payload }) {
      return {
        ...state,
        modifyInfoData: payload,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setInitData(state, { payload }) {
      return {
        ...state,
        initData: payload,
      };
    },
  },
};
