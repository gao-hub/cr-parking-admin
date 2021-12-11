import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'productsManage',

  state: {
    list: [], //   列表
    total: 0, // 数据总条数
    searchInfo: {}, //  搜索条件
    storeCategoryList: [], // 类目列表
    specSelectData: [], // 规格数据
    tableData: [], // 规格列表
    infoData: null, // 商品信息
    tableIndex: null, //
    isChanged: false, //
    totalStocks: 0, // 商品库存
    allSceneList: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.getList, payload);

      if (response && response.status === 1) {
        const { data = {} } = response;
        let { records = [] } = data;
        records = addListKey(records, payload.currPage, payload.pageSize);
        yield put({
          type: 'setList',
          payload: records,
        });
        yield put({
          type: 'setTotal',
          payload: data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *getSelectStoreCategoryList({ payload }, { call, put }) {
      const response = yield call(api.getSelectStoreCategoryList, payload);
      yield put({
        type: 'setStoreCategoryList',
        payload: response,
      });
    },
    *getAllSceneList({ payload }, { call, put }) {
      const response = yield call(api.allSceneList, payload);
      if (response && response.status === 1) {
        const { data = [] } = response;
        yield put({
          type: 'setAllSceneList',
          payload: data,
        });
      }
    },
    *AddProduct({ payload }, { call }) {
      const response = yield call(api.addProduct, payload);
      if (response && response.status === 1) {
        return response;
      }
      notification.error({
        message: '请求错误',
        description: response.statusDesc,
      });
      return undefined;
    },
    *getInfo({ payload }, { call, put }) {
      const response = yield call(api.getInfo, payload);

      if (response && response.status === 1) {
        const { data = {} } = response;
        yield put({
          type: 'setInfoData',
          payload: data,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *exportFile({ payload }, { call }) {
      yield call(api.exportFile, payload);
    },
  },

  reducers: {
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
    setStoreCategoryList(state, { payload }) {
      return {
        ...state,
        storeCategoryList: payload,
      };
    },
    setSpecSelectData(state, { payload }) {
      return {
        ...state,
        specSelectData: payload,
      };
    },
    setTableData(state, { payload }) {
      return {
        ...state,
        tableData: payload,
      };
    },
    setInfoData(state, { payload }) {
      return {
        ...state,
        infoData: payload,
      };
    },
    setTableIndex(state, { payload }) {
      return {
        ...state,
        tableIndex: payload,
      };
    },
    setIsChanged(state, { payload }) {
      return {
        ...state,
        isChanged: payload,
      };
    },
    setTotalStocks(state, { payload }) {
      return {
        ...state,
        totalStocks: payload,
      };
    },
    setAllSceneList(state, { payload }) {
      return {
        ...state,
        allSceneList: payload,
      };
    },
  },
};
