import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'userManage',

  state: {
    list: [], //   列表
    total: '', //   总条数
    searchInfo: {}, //  搜索条件
    initData: {}, // 搜索条件选项
    modifyInfoData: {}, //  修改详情
    spreadsList: [],
    spreadsTotal: 0,

    updateChannelRecordList: [], // 渠道修改记录列表
    updateChannelRecordListTotal: 0,
    historyIntegrayList:[],
    historyIntegrayListTotal:0
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.mockList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setList',
          payload: response.data.recordList,
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
    *statusChangeManage({ payload }, { call }) {
      return yield call(api.statusChangeManage, payload);
    },
    // 修改推荐人
    *updateSpreads({ payload }, { call }) {
      return yield call(api.updateSpreads, payload);
    },
    // 修改渠道
    *updateUtm({ payload }, { call }) {
      return yield call(api.updateUtm, payload);
    },

    // 客户修改员工
    *updateCRole({ payload }, { call }) {
      return yield call(api.updateCRole, payload);
    },

    // 推荐人变更记录
    *spreadsLog({ payload }, { put, call }) {
      const response = yield call(api.spreadsLogData, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'save',
          payload: {
            spreadsList: response.data.records,
            spreadsTotal: response.data.total,
          },
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *downloadMember({ payload }, { call }) {
      return yield call(api.downloadMember, payload);
    },
    *initSelect({ payload }, { call, put }) {
      const response = yield call(api.initSelect, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setInitData',
          payload: response.data,
        });
      }
    },
    /** 查看手机号
     * payload 参数
     */
    *showMobile({ payload }, { call }) {
      return yield call(api.showMobileApi, payload);
    },

    /**
     * @desc 修改渠道
     */
    *updateChannel({ payload }, { call }) {
      return yield call(api.updateChannelApi, payload);
    },

    /**
     * @desc 获取渠道修改记录列表
     */
    *updateChannelRecord({ payload }, { put, call }) {
      const res = yield call(api.updateChannelRecordApi, payload);
      if (res && res.status === 1) {
        res.data.recordList = addListKey(res.data.records, payload.currPage, payload.pageSize);
        yield put({
          type: 'save',
          payload: {
            updateChannelRecordList: res.data.records,
            updateChannelRecordListTotal: res.data.total,
          },
        });
      } else {
        notification.error({
          message: '请求错误',
          description: res.statusDesc,
        });
      }
    },
    /**
     * 获取积分详情
     */
    *getIntegralInfo({ payload }, { put, call }) {
      const res = yield call(api.getIntegralApi, payload);
      if (res && res.status === 1) {
        res.data.recordList = addListKey(res.data.records, payload.currPage, payload.pageSize);
        yield put({
          type: 'setIntegral',
          payload: {
            integrayList:res.data.records,
            integrayListTotal:res.data.total
          },
        });
      } else {
        notification.error({
          message: '请求错误',
          description: res.statusDesc,
        });
      }
    },
    /**
     * 获取成长值详情
     */
     *getGrowupInfo({ payload }, { put, call }) {
      const res = yield call(api.getIntegralApi, payload);
      if (res && res.status === 1) {
        res.data.recordList = addListKey(res.data.records, payload.currPage, payload.pageSize);
        yield put({
          type: 'setIntegral',
          payload: {
            integrayList:res.data.records,
            integrayListTotal:res.data.total
          },
        });
      } else {
        notification.error({
          message: '请求错误',
          description: res.statusDesc,
        });
      }
    },
    // 修改积分
    *updateIntegral({ payload }, { put, call }) {
      return yield call(api.updateIntegralApi, payload);
    }
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
    setModifyInfo(state, { payload }) {
      return {
        ...state,
        modifyInfoData: payload,
      };
    },
    setInitData(state, { payload }) {
      return {
        ...state,
        initData: payload,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setIntegral(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  },
};
