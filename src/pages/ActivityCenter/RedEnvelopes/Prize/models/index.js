import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'prizeManage',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    modifyInfoData: {}, //  修改详情
    prizeSelect:[], // 发放主体
    isStart:false
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
        });
        if(response.data.records.some(v=>v.isStart === 0) || response.data.records.length === 0){
          yield put({
            type: 'setStart',
            payload: true
          });
        }
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
    *exportExcel({ payload }, { call, put }) {
      const response = yield call(api.exportFile, payload)
    },
    *updateStatus({ payload }, { call, put }) {
      return yield call(api.updateStatus, payload);
    },
   
    // 获取发放主体数据
    *getPrizeSelect({ payload }, { call, put }){
      const response = yield call(api.getPrizeSelect,payload)
      if(response && response.status === 1){
        yield put({
          type:'setPrizeSelect',
          payload:response.data.businessAccounts
        })
      }
    }
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload
      };
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload
      };
    },
    setTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
    setModifyInfo(state, { payload }) {
      return {
        ...state,
        modifyInfoData: payload
      };
    },
    // 获取发放主体
    setPrizeSelect(state,{ payload }){
      return {
        ...state,
        prizeSelect: payload
      }
    },
    setStart(state,{ payload }){
      return {
        ...state,
        isStart: payload
      }
    },
  }
};
