import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'dataDictionary',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    searchInfo: {},
    initModifyInfo: {}
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.queryDataDictionary, payload);
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
    *addDataDictionary({ payload }, { call, put }) {   //   添加数据字典
      const response =  yield call(api.addDataDictionary, payload);
      return response
    },
    *initModifyInfo({ payload }, { call, put }) {   //   初始化修改信息
      const response =  yield call(api.initModifyInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setInitModifyInfo',
          payload: {
            ...response.data,
          },
        });
      }
    },
    *modifyDataDictionary({ payload }, { call, put }) {   //   修改数据字典
      const response =  yield call(api.modifyDataDictionary, payload);
      return response
    },
    *deleteDataDictionary({ payload }, { call, put }) {   //   删除数据字典
      const response =  yield call(api.deleteDataDictionary, payload);
      return response
    },
    //  同步
    *synchronization({ payload }, { call, put }) {
      yield call(api.synchronization, payload);
    }
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload
      };
    },
    setSearchInfo (state, {payload}) {   //   保存一下检索条件数据
      return {
        ...state,
        searchInfo: payload,
      };
    },
    setInitModifyInfo(state, {payload}) {
      return {
        ...state,
        initModifyInfo: payload,
      };
    }
  }
};
