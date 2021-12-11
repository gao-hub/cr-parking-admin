import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'buildingParkingManage',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    pagination: {
      size:10 ,
      current: 1
    },
    modifyInfoData: {}, //  修改详情
    developerList: [], // 开发商列表
    initData: {}, // 筛选条件数据
    searchInfo:{},
    natureList: [], // 获取新增编辑页面出事数据
    regionalPlanningList: [], // 获取新增编辑页面出事数据
  },

  effects: {
    *fetchList({ payload }, { call, put,select }) {
      delete payload['createTime'];
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
        })
        yield put({
          type: 'setPagination',
          payload: {
            size: response.data.size,
            current: response.data.current
          }
        })
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
    },
    *developerList({ payload }, { call, put }) {
      const response = yield call(api.developerList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'setDeveloperList',
          payload: response.data.records,
        });
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
    // 同步信息
    *asyncData({ payload }, { call, put }) {
      return yield call(api.asyncData, payload)
    },
    // 获取所有下拉接口
    *getAllSelect({ payload }, { call, put }) {
      const response =  yield call(api.getAllSelect, payload)
      if(response && response.status === 1) {
        yield put({
          type: 'setInitData',
          payload: response.data
        })
      }
    },

    // 获取开发商列表接口
    *selectList({ payload }, { call, put }) {
      const response = yield call(api.selectList, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setNatureList',
          payload: response.data.nature,
        });
        yield put({
          type: 'setRegionalPlanningList',
          payload: response.data.regionalPlanning,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: "response.statusDesc",
        })
      }
    },

    *updateStatus({ payload }, { call, put }) {
      return yield call(api.updateStatus, payload);
    },
    //  已售出的车位可转为在售
    *changeOnSale({ payload }, { call }) {
      return yield call(api.changeOnSale, payload);
    },
  },

  reducers: {
    setPagination(state, { payload }) {
      return {
        ...state,
        pagination: payload
      };
    },
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
    setDeveloperList(state, { payload }) {
      return {
        ...state,
        developerList: payload
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
    setInitData(state, { payload }) {
      return {
        ...state,
        initData: payload
      };
    },
    setNatureList(state, { payload }) {
      return {
        ...state,
        natureList: payload
      }
    },
    setRegionalPlanningList(state, { payload }) {
      return {
        ...state,
        regionalPlanningList: payload
      }
    },
  }
};
