import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'buybackOrderManage',

  state: {
    list: [], //   列表
    initData: [],
    total: '', //   总条数
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
    timeLineInfo: {},
    pagination: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      delete payload['createTime'];
      delete payload['updateTime'];
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
        yield put({
          type: 'setTotal',
          payload: response.data.total,
        });
        yield put({
          type: 'setPagination',
          payload: {
            current: response.data.current,
            size: response.data.size,
          },
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },

    *initSelect({ payload }, { call, put }) {
      const response = yield call(api.initSelect, payload);
      if (response && response.status == 1) {
        yield put({
          type: 'setInitData',
          payload: response.data,
        });
      }
    },

    *getModifyInfo({ payload }, { call, put }) {
      const response = yield call(api.getModifyInfo, payload);
      if (response && response.status == 1) {
        yield put({
          type: 'setInfo',
          payload: response.data,
        });
      }
    },

    *getTimeLine({ payload }, { call, put }) {
      const response = yield call(api.getTimeLineInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setTimeLineInfo',
          payload: response.data,
        });
      }
      return response;
    },

    *verifyOperate({ payload }, { call }) {
      return yield call(api.verifyOperate, payload);
    },

    // 同步信息
    *asyncData({ payload }, { call }) {
      return yield call(api.asyncData, payload);
    },

    // 连连支付短信验证码
    *lianlianSmsCode({ payload }, { call }) {
      return yield call(api.lianlianSmsCodeApi, payload);
    },
    // 自用版连连支付短信验证码
    *lianlianSmsCodeSelf({ payload }, { call }) {
      return yield call(api.lianlianSmsCodeApiSelf, payload);
    },
    
    // 信息导出
    *exportFile({ payload }, { call }) {
      yield call(api.exportFile, payload)
    },
    /**
     * @desc 获取手机号
     */
    *getPhone({ payload }, { call }) {
      return yield call(api.getPhone, payload);
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
    setInitData(state, { payload }) {
      return {
        ...state,
        initData: payload,
      };
    },
    setInfo(state, { payload }) {
      return {
        ...state,
        modifyInfoData: payload,
      };
    },
    setTimeLineInfo(state, { payload }) {
      return {
        ...state,
        timeLineInfo: payload,
      };
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload,
      };
    },
    setPagination(state, { payload }) {
      return {
        ...state,
        pagination: payload,
      };
    },
  },
};
