import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'parkingOrderManage',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    modifyInfoData: {}, //  修改详情
    timeLineInfo: {},
    initData: {}, // 筛选数据字典
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.fetchList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'setList',
          payload: response.data,
        });
        yield put({
          type: 'setTotal',
          payload: response.data.total
        })
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
      } else {
        yield put({
          type: 'setModifyInfo',
          payload: {}
        })
      }
      return response;
    },
    *getTimeLine({ payload }, { call, put }) {
      const response = yield call(api.getTimeLineInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setTimeLineInfo',
          payload: response.data,
        })
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
      return response;
    },
    // 审核操作
    *auditManage({ payload }, { call, put }) {
      return yield call(api.auditManage, payload);
    },
    // 下载协议zip
    *downLoadPdf({ payload },{ call, put }){
      return yield call(api.downLoadPdf,payload)
    },
    // 自用版开发票add
    *invoiceAdd({ payload },{ call, put}){
      return yield call(api.invoiceAdd,payload)
    },
     // 自用版开发票invoiceUpdate
     *invoiceUpdate({ payload },{ call, put}){
      return yield call(api.invoiceUpdate,payload)
    },
     // 自用版开发票invoiceDownload
     *invoiceDownload({ payload },{ call, put}){
      return yield call(api.invoiceDownload,payload)
    },
    // 退货
    *createReturn({payload},{call,put}){
      return yield call(api.createReturn,payload)
    },
     // 已交割
     *selfDelivery({payload},{call,put}){
      return yield call(api.selfDelivery,payload)
    },
    *exportExcel({ payload }, { call, put }) {
      const response = yield call(api.exportFile, payload)
    },
    *getAllSelect({ payload }, { call, put }) {
      const response = yield call(api.getAllSelect, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setInitData',
          payload: response.data,
        })
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
      return response;
    },
    
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload
      };
    },
    setTotal(state, { payload }) {
      return {
        ...state,
        total: payload
      }
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload
      };
    },
    setModifyInfo(state, { payload }) {
      return {
        ...state,
        modifyInfoData: payload
      };
    },
    setTimeLineInfo(state, { payload }) {
      return {
        ...state,
        timeLineInfo: payload
      }
    },
    setInitData(state,{payload}){
      return {
        ...state,
        initData: payload
      }
    }
  }
};
