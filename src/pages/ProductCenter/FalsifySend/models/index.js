import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'falsifySendManage',

  state: {
    list: [], //   列表
    total: 0, // 数据总条数
    numJson: {}, //   表格底部数据
    searchInfo: {}, //  搜索条件
    backSearchInfo: {}, //  到期退货搜索条件
    modifyInfoData: {}, //  修改详情
    initData: {},
    sumData: {}, // 总额数据
  },

  effects: {
    *postManualDistributionReturnAll({ payload }, { call }) {
      return yield call(api.postManualDistributionReturnAll, payload);
    },
    *getReturnSum({ payload }, { call, put }) {
      const response = yield call(api.getReturnSum, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setSum',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
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
    *fetchBackList({ payload }, { call, put }) {
      const response = yield call(api.mockBackList, payload);
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
    *batchAllocate({ payload }, { call }) {
      return yield call(api.batchAllocate, payload);
    },
    *exportFile({ payload }, { call }) {
      yield call(api.exportFile, payload);
    },
    /**
     * 到期退货导出功能
     * */
    *exportBackFile({ payload }, { call }) {
      yield call(api.exportBackFile, payload);
    },

    /**
     * @desc 违约金发放(批量发放)
     */
    *penaltyBatchHandOut({ payload }, { call }) {
      return yield call(api.penaltyBatchHandOutApi, payload);
    },

    /**
     * @desc 违约金发放(手动发放)
     */
    *penaltyHandOut({ payload }, { call }) {
      return yield call(api.penaltyHandOutApi, payload);
    },

    /**
     * @desc 违约金发放 短信二次校验
     */
    *penaltyHandOutSmsCode({ payload }, { call }) {
      return yield call(api.penaltyHandOutSmsCodeApi, payload);
    },

    /**
     * @desc 到期退货发放(手动发放)
     */
    *returnHandOut({ payload }, { call }) {
      return yield call(api.returnHandOutApi, payload);
    },

    /**
     * @desc 到期退货发放(失败重发)
     */
    *reReturnHandOut({ payload }, { call }) {
      return yield call(api.reReturnHandOutApi, payload);
    },

    /**
     * @desc 到期退货 短信二次校验
     */
    *returnHandOutSmsCode({ payload }, { call }) {
      return yield call(api.returnHandOutSmsCodeApi, payload);
    },
    /**
     * @desc 获取手机号
     */
    *getPhone({ payload }, { call }) {
      return yield call(api.getPhone, payload);
    },
  },

  reducers: {
    setSum(state, { payload }) {
      return {
        ...state,
        sumData: payload,
      };
    },
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
    setNumJson(state, { payload }) {
      return {
        ...state,
        numJson: payload,
      };
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload,
      };
    },
    setBackSearchInfo(state, { payload }) {
      return {
        ...state,
        backSearchInfo: payload,
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
  },
};
