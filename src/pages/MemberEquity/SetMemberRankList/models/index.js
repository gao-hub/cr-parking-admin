import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import moment from 'moment';
import * as api from '../services';

export default {
  namespace: 'MemberRank',

  state: {
    list: [], //   列表
    total: '', //   总条数
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
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

   
    // 获取详情（修改）
    *getModifyInfo({ payload }, { call, put }) {
      const response = yield call(api.getModifyInfo, payload);
      if (response && response.status === 1) {
        const data = response.data;
        yield put({
          type: 'setModifyInfo',
          payload: data,
        });
      }
      return response;
    },
    // 提交售后
    *modifyManage({ payload }, { call }) {
      return yield call(api.modifyManage, payload);
    },

    // 修改会员等级设置
    *modifyDeliverId({ payload }, { call }){
      return yield call(api.modifyDeliverId, payload);
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
