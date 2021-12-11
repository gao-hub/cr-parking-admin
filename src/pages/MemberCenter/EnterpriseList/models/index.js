import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'enterpriseManage',

  state: {
    list: [], //   列表
    total: '', //   总条数
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
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
    *statusChangeManage({ payload }, { call }) {
      return yield call(api.statusChangeManage, payload);
    },
    *downloadMember({ payload }, { call }) {
      return yield call(api.downloadMember, payload);
    },
    // 充值初始化
    *rechargeInfo({ payload }, { call }) {
      return yield call(api.rechargeInfoData, payload);
    },
    // 提现交易密码提交接口
    *withdrawTradePsdSubmit({ payload }, { call }) {
      return yield call(api.withdrawTradePsdSubmitApi, payload);
    },
    // 提现短信验证提交接口
    *withdrawSmsCodeSubmit({ payload }, { call }) {
      return yield call(api.withdrawSmsCodeSubmitApi, payload);
    },
    // 获取验证码
    *getCode({ payload }, { call }) {
      return yield call(api.getCode, payload);
    },
    // 获取验证码
    *getCodeSecond({ payload }, { call }) {
      return yield call(api.getCodeSecond, payload);
    },
    // 修改手机号
    *updateMobile({ payload }, { call }) {
      return yield call(api.updateMobile, payload);
    },
    // 修改交易密码
    *updatePassWord({ payload }, { call }) {
      return yield call(api.updatePassWord, payload);
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
