import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'unifiedLotteryActivityManagement',

  state: {
    list: [], //   列表
    total: '', //   总条数
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
    activityTemList: [], // 活动模板列表
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
    // 删除
    *deleteData({ payload }, { call }) {
      return yield call(api.deleteData, payload);
    },
    // 添加
    *addManage({ payload }, { call }) {
      return yield call(api.addManage, payload);
    },
    // 修改
    *modifyManage({ payload }, { call, put }) {
      return yield call(api.modifyManage, payload);
    },
    // 获取详细信息
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

    // 获取活动模板列表
    *activityTemList({ payload }, { call, put }) {
      const response = yield call(api.activityTemList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setActivityTemList',
          payload: response.data.records,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
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
    setActivityTemList(state, { payload }) {
      return {
        ...state,
        activityTemList: payload,
      };
    },
  },
};
