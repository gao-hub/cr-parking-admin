import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import moment from 'moment';
import * as api from '../services';

export default {
  namespace: 'EquityManage',

  state: {
    data:{
      list: [], //   列表
      pagination: {}, //  分页
    },
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
    caculateData: {} // 存储商品积分
  },

  effects: {
    // 列表
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.fetchList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize,
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

    // 添加商品
    *addManage({ payload }, { call }) {
      return yield call(api.addManage, payload);
    },

    // 修改商品
    *modifyManage({ payload }, { call }) {
      return yield call(api.modifyManage, payload);
    },

    // 获取详情
    *getModifyInfo({ payload }, { call, put }) {
      const response = yield call(api.getModifyInfo, payload);
      if (response && response.status === 1) {
        const saveData = response.data;
        yield put({
          type: 'setModifyInfo',
          payload: saveData,
        });
        yield put({
          type: 'setCaculate',
          payload: {
            integralPrice: saveData.integralPrice, 
            exchangeAmountRatio: saveData.exchangeAmountRatio
          },
        });
      }
      return response;
    },

    // 计算商品积分
    *caculateGoodsIntegral({ payload }, { call, put }) {
      const response = yield call(api.caculateGoodsIntegral, payload);
      if(response && response.status == 1) {
        yield put({
          type:  'setCaculate',
          payload: response.data
        })
      }
    },
    
    // 上下架
    *updateStatus({ payload }, { call, put }) {
      return yield call(api.updateStatus, payload);
    },

    // 取消推荐
    *cancelCommended({ payload }, { call, put}) {
      return yield call(api.cancelCommended, payload);
    },

    // 导出
    *exportExcel({ payload }, { call }) {
      yield call(api.exportFile, payload);
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
    setCaculate(state, { payload }) {
      return {
        ...state,
        caculateData: payload
      }
    },
    setModifyInfo(state, { payload }) {
      return {
        ...state,
        modifyInfoData: payload,
      };
    },
  },
};
