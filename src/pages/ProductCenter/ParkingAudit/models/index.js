import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'parkingAuditManage',

  state: {
    list: [], //   列表
    total: '', //   总条数
    pagination: {
      size: 10,
      current: 1,
    },
    modifyInfoData: {}, //  修改详情
    developerList: [], // 开发商列表
    initData: {}, // 筛选条件数据
    searchInfo: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      delete payload['createTime'];
      const response = yield call(api.mockList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
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
        yield put({
          type: 'setPagination',
          payload: {
            size: response.data.size,
            current: response.data.current,
          },
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *developerList({ payload }, { call, put }) {
      const response = yield call(api.developerList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setDeveloperList',
          payload: response.data.records,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *addManage({ payload }, { call }) {
      return yield call(api.addManage, payload);
    },
    *modifyManage({ payload }, { call }) {
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
        });
      }
      return response;
    },
    *exportExcel({ payload }, { call }) {
      const response = yield call(api.exportFile, payload);
    },
    // 同步信息
    *asyncData({ payload }, { call }) {
      return yield call(api.asyncData, payload);
    },
    // 出售发放
    *updateSynchroSale({ payload }, { call }) {
      return yield call(api.updateSynchroSale, payload);
    },
    // 获取所有下拉接口
    *getAllSelect({ payload }, { call, put }) {
      const response = yield call(api.getAllSelect, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setInitData',
          payload: response.data,
        });
      }
    },

    // 审核操作
    *auditManage({ payload }, { call }) {
      return yield call(api.auditManage, payload);
    },

    // 运营审核操作
    *operateAuditManage({ payload }, { call }) {
      return yield call(api.operateAuditManage, payload);
    },

    // 连连支付短信验证码
    *lianlianSmsCode({ payload }, { call }) {
      return yield call(api.lianlianSmsCodeApi, payload);
    },
    /**
     * @desc 获取手机号
     */
    *getPhone({ payload }, { call }) {
      return yield call(api.getPhone, payload);
    },
  },

  reducers: {
    setPagination(state, { payload }) {
      return {
        ...state,
        pagination: payload,
      };
    },
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
    setDeveloperList(state, { payload }) {
      return {
        ...state,
        developerList: payload,
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
  },
};
