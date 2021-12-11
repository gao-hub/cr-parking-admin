import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'newsManage',

  state: {
    list: [], //   列表
    total: '', //   总条数
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
    initData: {}, // 下拉菜单
  },

  effects: {
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
          payload: response.data.total
        })
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
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
    *updateStatus({ payload }, { call }) {
      return yield call(api.updateStatus, payload);
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
    *exportExcel({ payload }, { call, put }) {
      const response = yield call(api.exportFile, payload);
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
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload,
      };
    },
    setTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
    setInitData(state, { payload }) {
      return {
        ...state,
        initData: payload,
      };
    },
    setModifyInfo(state, { payload }) {
      return {
        ...state,
        modifyInfoData: payload,
      };
    },
  },
};
