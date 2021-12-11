import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'rentManage',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    modifyInfoData: {}, //  修改详情
    planList: [],  //   到期计划列表
    planTotal: '',  //   到期计划总条数
    planSearchInfo: {},  //  到期计划搜索条件
    planModifyInfoData: {}, //  到期计划修改详情
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.mockList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'setList',
          payload: response.data.records,
        });
        yield put({
          type: 'setTotal',
          payload: response.data.total
        })
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
    },
    *fetchPlanList({ payload }, { call, put }) {
      const response = yield call(api.fetchPlanList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'save',
          payload: {
            planList: response.data.records,
            planTotal: response.data.total
          },
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
    },
    *exportFile({ payload }, { call }) {
      yield call(api.exportFile, payload);
    },
    *statusChangeManage({ payload }, { call }) {
      return yield call(api.statusChangeManage, payload);
    },
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload
      };
    },
    setTotal(state, { payload }) {
      return {
        ...state,
        total: payload
      }
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload
      };
    },
    setPlanSearchInfo(state, { payload }) {
      return {
        ...state,
        planSearchInfo: payload
      };
    },
    setModifyInfo(state, { payload }) {
      return {
        ...state,
        modifyInfoData: payload
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    }
  }
};
