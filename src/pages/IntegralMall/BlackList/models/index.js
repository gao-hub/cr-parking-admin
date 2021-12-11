import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import moment from 'moment';
import * as api from '../services';

export default {
  namespace: 'BlackList',

  state: {
    list: [], //   列表
    total: '', //   总条数
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
    selectData: [], // 存储渠道
    userInfo: {}, // 存储用户信息
    blackInfo: {} // 存储黑名单详情
  },

  effects: {
    // 列表
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
    // 获取渠道
    *parentUtmSelector({ payload }, { call, put }) {
      const response = yield call(api.parentUtmSelector, payload);
      if(response && response.status == 1) {
        const saveData = response.data;
        yield put({
          type: 'setSelectData',
          payload: saveData,
        });
      }
      return response;
    },
    // 获取用户信息
    *getUserInfo({ payload }, { call, put }) {
      const response = yield call(api.getUserInfo, payload);
      if(response && response.status == 1) {
        yield put({
          type: 'setUserInfo',
          payload: response.data,
        });
      }
      return response;
    },
    // 获取黑名单详情
    *getBlackInfo({ payload }, { call, put }) {
      const response = yield call(api.getBlackInfo, payload);
      if(response && response.status == 1) {
        const saveData = response.data;
        yield put({
          type: 'setUserInfo',
          payload: saveData,
        });
      }
      return response;
    },
    // 添加
    *saveManage({ payload }, { call }) {
      return yield call(api.saveManage, payload);
    },

    // 移除
    *removeManage({ payload }, { call }) {
      return yield call(api.removeManage, payload);
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
    setUserInfo(state, { payload }) {
      return {
        ...state,
        userInfo: payload,
      };
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload,
      };
    },
    setSelectData(state, { payload }) {
      return {
        ...state,
        selectData: payload
      }
    }
  },
};
