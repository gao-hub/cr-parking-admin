import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import moment from 'moment';
import * as api from '../services';

export default {
  namespace: 'GrowupInfoList',

  state: {
    data:{
      list: [], //   列表
      pagination: {}, //  分页
    },
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
    selectData: [], //  存储渠道下拉列表
    growupTypeData: [] //  存储成长值类型下拉列表
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
    // 成长值类型下拉
    *growupTypeSelector({ payload }, { call, put }) {
      const response = yield call(api.growupTypeSelector, payload);
      if(response && response.status == 1) {
        const saveData = response.data;
        yield put({
          type: 'growupTypeData',
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
    growupTypeData(state, { payload }) {
      return {
        ...state,
        growupTypeData: payload
      }
    }
  },
};
