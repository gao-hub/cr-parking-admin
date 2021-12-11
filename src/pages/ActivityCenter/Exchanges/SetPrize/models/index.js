import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'setPrize',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    modifyInfoData: {}, //  修改详情
    activityTemList: [],  // 活动模板列表
    gradesSelect: [],// 档位select
    businessSelect: [], // 发放主体select
    defaultImage: '', // 默认图片
    isStart: false, // 活动是否启用
  },

  effects: {
    * fetchList({ payload }, { call, put }) {
      const response = yield call(api.getList, payload);
      if (response && response.status === 1) {
        response.data = addListKey(response.data);
        if (response.data.length && response.data[0].isStart === 1) {
          yield put({
            type: 'setIsStart',
            payload: true
          })
        } else {
          yield put({
            type: 'setIsStart',
            payload: false
          })
        }
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
    // 删除
    * deletePrize({ payload }, { call }) {
      return yield call(api.deletePrize, payload);
    },
    // 添加
    * addPrize({ payload }, { call }) {
      return yield call(api.addPrize, payload);
    },
    // 修改
    * editPrize({ payload }, { call }) {
      return yield call(api.editPrize, payload);
    },
    // 获取详细信息
    * getInfo({ payload }, { call }) {
      return yield call(api.getInfo, payload);
    },
    // 获取档位select
    * getPrizeSelect({ payload }, { call, put }) {
      const res = yield call(api.getPrizeSelect, payload);
      if (res && res.status === 1) {
        yield put({
          type: 'setGradesSelect',
          payload: res.data.grades
        })
       yield put({
          type: 'setBusinessAccounts',
          payload: res.data.businessAccounts
        })
      }
    },
    // 获取红包默认图片
    * getDefaultImage({ payload }, { call, put }) {
      const res = yield call(api.getDefaultImage, payload);
      if (res && res.status === 1) {
       yield put({
          type: 'setDefaultImage',
          payload: res.data
        })
      }

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
    setGradesSelect(state, {payload}) {
      return {
        ...state,
        gradesSelect: payload
      }
    },
    setBusinessAccounts(state, { payload }) {
      return {
        ...state,
        businessSelect: payload
      }
    },
    setDefaultImage(state, { payload }) {
      return {
        ...state,
        defaultImage: payload
      }
    },
    setIsStart(state, {payload}) {
      return {
        ...state,
        isStart: payload
      }
    }
  },
};
