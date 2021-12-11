import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'SmartCommunity',

  state: {
    list: [], //   列表
    typeManageList: [], //   类型列表
    total: 0, // 数据总条数
    typeTotal: 0,// 类型数据总条数
    numJson: {}, //   表格底部数据
    searchInfo: {}, //  搜索条件
    backSearchInfo: {}, //  类型管理
    functionInfoData: {}, //  功能修改详情
    functionId: {}, //  功能id
    typeInfoData: {}, //  类型修改详情
    typeId: {}, //  类型id
    typeList: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.mockList, payload);
      if (response && response.status === 1) {
        const { data = {} } = response;
        const { records = [], total = 0 } = data;
        const newList = addListKey(records, payload.currPage, payload.pageSize);
        yield put({
          type: 'setList',
          payload: newList,
        });
        yield put({
          type: 'setTotal',
          payload: total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *fetchBackList({ payload }, { call, put }) {
      const response = yield call(api.mockBackList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'saveTypeList',
          payload: response.data.records,
        });
        yield put({
          type: 'saveTotal',
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
    *getTypeSelect({ payload }, { call, put }) {
      const response = yield call(api.getTypeSelect, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setTypeList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
      return response;
    },
    /**
     * 添加功能管理
     * */
     *addFunction({ payload }, { call }) {
      return yield call(api.addFunction, payload);
    },
    /**
     * 修改功能管理
     * */
     *modifyFunction({ payload }, { call }) {
      return yield call(api.modifyFunction, payload);
    },
    /**
     * 获取某个功能管理详情
     * */
    *getFunctionInfo({ payload }, { call, put }) {
      const response = yield call(api.getFunctionInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setFunctionInfo',
          payload: {
            data: response.data,
            id: payload.id
          },
        })
      }
      return response;
    },
    /**
     * 删除功能
     * */
     *delete({ payload }, { call }) {
      return yield call(api.deleteFunction, payload);
    },
    
    /**
     * 修改功能状态
     * */
     *modifyFcState({ payload }, { call }) {
      return yield call(api.modifyFcState, payload);
    },
    /**
     * 获取某个类型管理详情
     * */
     *getTypeInfo({ payload }, { call, put }) {
      const response = yield call(api.getTypeInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setTypeInfo',
          payload: {
            data: response.data,
            id: payload.id
          },
        })
      }
      return response;
    },
    /**
     * 添加类型管理
     * */
     *addType({ payload }, { call }) {
      return yield call(api.addType, payload);
    },
    /**
     * 修改类型管理
     * */
     *modifyType({ payload }, { call }) {
      return yield call(api.modifyType, payload);
    },
    
    /**
     * 删除功能
     * */
     *deleteType({ payload }, { call }) {
      return yield call(api.deleteType, payload);
    },
    
    /**
     * 修改功能状态
     * */
     *modifyTypeState({ payload }, { call }) {
      return yield call(api.modifyTypeState, payload);
    },
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    saveTypeList(state, { payload }) {
      return {
        ...state,
        typeManageList: payload,
      };
    },
    setTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
    saveTotal(state, { payload }) {
      return {
        ...state,
        typeTotal: payload,
      };
    },
    setNumJson(state, { payload }) {
      return {
        ...state,
        numJson: payload,
      };
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload,
      };
    },
    setBackSearchInfo(state, { payload }) {
      return {
        ...state,
        backSearchInfo: payload,
      };
    },
    setFunctionInfo(state, { payload }) {
      return {
        ...state,
        functionInfoData: payload.data,
        functionId: payload.id
      };
    },
    setTypeInfo(state, { payload }) {
      return {
        ...state,
        typeInfoData: payload.data,
        typeId: payload.id
      };
    },
    setTypeList(state, { payload }) {
      return {
        ...state,
        typeList: payload,
      };
    },
  },
};
