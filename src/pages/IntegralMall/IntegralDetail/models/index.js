import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import moment from 'moment';
import * as api from '../services';

export default {
  namespace: 'IntegralDetail',

  state: {
    data:{
      list: [], //   列表
      pagination: {}, //  分页
    },
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
    selectData: [], //  存储渠道下拉列表
    businessTypeData: [] //  存储订单下拉列表
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
          payload: response.data,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },

    // 渠道下拉
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
    // 订单下拉
    *businessTypeSelector({ payload }, { call, put }) {
      const response = yield call(api.businessTypeSelector, payload);
      if(response && response.status == 1) {
        const saveData = response.data;
        yield put({
          type: 'businessTypeData',
          payload: saveData,
        });
      }
      return response;
    },
    *exportExcel({ payload }, { call }) {
      yield call(api.exportFile, payload);
    },
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        data: {
          list: payload.recordList,
          pagination: {
            current: payload.current,
            pageSize: payload.size,
            total: payload.total
          },
        },
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
    setSelectData(state, { payload }) {
      return {
        ...state,
        selectData: payload
      }
    },
    businessTypeData(state, { payload }) {
      return {
        ...state,
        businessTypeData: payload
      }
    }
  },
};
