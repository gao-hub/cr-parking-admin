import moment from 'moment';
import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'commodityManagement',
  state: {
    commodityList: [], // 秒杀活动列表
    total: 0, // 总条数
    listHomeTotal: 0,
    searchInfo: {}, //  搜索条件
    listHome: [], // 活动商品表
    activeBatchList: [], // 商品详情
  },
  effects: {
    // 获取活动列表
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.getActivityList, payload);
      if (response && response.status === 1) {
        response.data.records = addListKey(
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
    *addActivity({ payload }, { call }) {
      return yield call(api.addActivity, payload);
    },
    *editActivity({ payload }, { call }) {
      return yield call(api.editActivity, payload);
    },
    *changeStatus({ payload }, { call }) {
      return yield call(api.changeStatus, payload);
    },
    *deleteActivity({ payload }, { call }) {
      return yield call(api.deleteActivity, payload);
    },
    *infoSeckillList({ payload }, { call, put }) {
      const response = yield call(api.infoSeckillList, payload);
      if (response && response.status === 1) {
        let array = response.data;
        if (array.length == 0) {
          array.push({
            id: new Date().getTime(),
            startTime: undefined,
            activityProductList: [],
            rowSelectionList: [],
            priceSpike: null, // 秒杀价
            virtualInventory: null, // 虚拟库存
            spikeInventory: null, // 秒杀库存
          });
        }
        yield put({
          type: 'setActiveBatchList',
          payload: array,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *listHome({ payload }, { call, put }) {
      const response = yield call(api.listHome, payload);
      if (response && response.status === 1) {
        response.data.records = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setListHome',
          payload: response.data.records,
        });
        yield put({
          type: 'setListHomeTotal',
          payload: response.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *getCategories({ payload }, { call }) {
      return yield call(api.getCategories, payload);
    },
    *addSpikeBatch({ payload }, { call }) {
      return yield call(api.addSpikeBatch, payload);
    },
    *getProductAttrValueList({ payload }, { call }) {
      return yield call(api.getProductAttrValueList, payload);
    },
  },
  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        commodityList: payload,
      };
    },
    setTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
    setListHomeTotal(state, { payload }) {
      return {
        ...state,
        listHomeTotal: payload,
      };
    },
    setListHome(state, { payload }) {
      return {
        ...state,
        listHome: payload,
      };
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload,
      };
    },
    setActiveBatchList(state, { payload }) {
      return {
        ...state,
        activeBatchList: payload,
      };
    },
  },
};
