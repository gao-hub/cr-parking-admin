import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'posterManage',

  state: {
    list: [], //   列表
    total: '', //   总条数
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
    adSpace: [], // 广告位
    adPlatform: [], // 展示平台
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.fetchList, payload);
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

    *getAdSpace({ payload }, { call, put }) {
      const response = yield call(api.getAdSpaceApi, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'save',
          payload: {
            adSpace: response.data,
          },
        });
      }
    },

    *getAdPlatform({ payload }, { call, put }) {
      const response = yield call(api.getAdPlatformApi, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'save',
          payload: {
            adPlatform: response.data,
          },
        });
      }
    },

    *addManage({ payload }, { call }) {
      return yield call(api.addManage, payload);
    },

    *modifyManage({ payload }, { call }) {
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
        });
      }
      return response;
    },

    *updateStatus({ payload }, { call }) {
      return yield call(api.updateStatus, payload);
    },

    *exportExcel({ payload }, { call }) {
      yield call(api.exportFile, payload);
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    setInitData(state, { payload }) {
      return {
        ...state,
        initData: payload,
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
  },
};
