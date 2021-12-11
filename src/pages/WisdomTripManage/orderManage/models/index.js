import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'tripOrderManage',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    OrderInfoData: {}, //  详情
    noPermissionOrderInfoData: {}, //  详情
    timeLineInfo: {},
    initData: {}, // 筛选数据字典
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
    *addManage({ payload }, { call }) {
      return yield call(api.addManage, payload);
    },
    *modifyManage({ payload }, { call, put }) {
      return yield call(api.modifyManage, payload);
    },
    *deleteManage({ payload }, { call }) {
      return yield call(api.deleteManage, payload);
    },
    *getNoPermissionOrderInfo({ payload }, { call, put }) {
      const response = yield call(api.getNoPermissionOrderInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setNoPermissionOrderInfo',
          payload: response.data,
        })
      } else {
        yield put({
          type: 'setNoPermissionOrderInfo',
          payload: {}
        })
      }
      return response;
    },
    *getOrderInfo({ payload }, { call, put }) {
      const response = yield call(api.getOrderInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setOrderInfo',
          payload: response.data,
        })
      } else {
        yield put({
          type: 'setOrderInfo',
          payload: {}
        })
      }
      return response;
    },
    *getTimeLine({ payload }, { call, put }) {
      const response = yield call(api.getTimeLineInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setTimeLineInfo',
          payload: response.data,
        })
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
      return response;
    },
    // 初审
    *auditManage({ payload }, { call, put }) {
      return yield call(api.auditManage, payload);
    },
    // 二次确认
    *confirmManage({ payload }, { call, put }) {
      return yield call(api.confirmManage, payload);
    },
    // 复审
    *reviewManage({ payload }, { call, put }) {
      return yield call(api.reviewManage, payload);
    },
    *exportExcel({ payload }, { call, put }) {
      const response = yield call(api.exportFile, payload)
    },
    *getAllSelect({ payload }, { call, put }) {
      const response = yield call(api.getAllSelect, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setInitData',
          payload: response.data,
        })
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
      return response;
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
    setNoPermissionOrderInfo(state, { payload }) {
      return {
        ...state,
        noPermissionOrderInfoData: payload
      };
    },
    setOrderInfo(state, { payload }) {
      return {
        ...state,
        OrderInfoData: payload
      };
    },
    setTimeLineInfo(state, { payload }) {
      return {
        ...state,
        timeLineInfo: payload
      }
    },
    setInitData(state,{payload}){
      return {
        ...state,
        initData: payload
      }
    }
  }
};
