import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'orderManage',

  state: {
    list: [],  //   列表
    initData: [], // 下拉框
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    modifyInfoData: {}, //  修改详情
    timeLineInfo: {}
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
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
    },
    *initSelect({ payload }, { call, put }) {
      const response = yield call(api.initSelect, payload);
      if(response && response.status == 1) {
        yield put({
          type: 'setInitData',
          payload: response.data
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
    *getModifyInfo({ payload }, { call, put }) {
      const response = yield call(api.getModifyInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setModifyInfo',
          payload: response.data,
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
      }
      return response;
    },
    *exportExcel({ payload }, { call, put }) {
      const response = yield call(api.exportFile, payload)
    }
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload
      };
    },
    setInitData(state, { payload }) {
      return {
        ...state,
        initData: payload
      }
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload
      };
    },
    setModifyInfo(state, { payload }) {
      return {
        ...state,
        modifyInfoData: payload
      };
    },
    setTimeLineInfo(state, { payload }) {
      return {
        ...state,
        timeLineInfo: payload
      }
    }
  }
};
