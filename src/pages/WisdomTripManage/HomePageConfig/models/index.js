import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import moment from 'moment';
import * as api from '../services';

export default {
  namespace: 'homeConfig',

  state: {
    list: [], //   列表
    total: '', //   总条数
    tabList: [], //   列表
    tabTotal: '', //   总条数
    searchInfo: {}, //  搜索条件
    modifyInfoData: {}, //  修改详情
    adSpace: [], // 广告位
    adPlatform: [], // 展示平台
  },

  effects: {
    // 广告位
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.fetchList, payload);
      if (response && response.status === 1) {
        // 去除过期的数据
        // if (Array.isArray(response.data.records) && response.data.records.length > 0) {
        //   const nowTime = moment();
        //   response.data.records.forEach((item, index) => {
        //     if (nowTime.diff(item.endTime) > 0) {
        //       response.data.records.splice(index, 1);
        //     }
        //   });
        // }
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
    // tab页
    *fetchTabList({ payload }, { call, put }) {
      const response = yield call(api.fetchTabList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setTabList',
          payload: response.data.records,
        });
        yield put({
          type: 'setTabTotal',
          payload: response.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },

    *getTabSelect({ payload }, { call, put }) {
      const response = yield call(api.getTabSelectApi, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'save',
          payload: {
            adSpace: response.data,
          },
        });
      }
    },

    *getAdPlatform({ payload }, { call, put }) {
      const response = yield call(api.getAdPlatformApi, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'save',
          payload: {
            adPlatform: response.data,
          },
        });
      }
    },
    // 广告添加
    *addManage({ payload }, { call }) {
      return yield call(api.addManage, payload);
    },

    // tab添加
    *addTabManage({ payload }, { call }) {
      return yield call(api.addTabManage, payload);
    },
    // 广告修改
    *modifyManage({ payload }, { call }) {
      return yield call(api.modifyManage, payload);
    },
    // tab修改
    *modifyTabManage({ payload }, { call }) {
      return yield call(api.modifyTabManage, payload);
    },

    // 广告删除
    *deleteManage({ payload }, { call }) {
      return yield call(api.deleteManage, payload);
    },

    // tab删除
    *tabDeleteManage({ payload }, { call }) {
      return yield call(api.tabDeleteManage, payload);
    },

    // 广告修改
    *getModifyInfo({ payload }, { call, put }) {
      const response = yield call(api.getModifyInfo, payload);
      if (response && response.status === 1) {
        const saveData = response.data;
        saveData.rangeTime = [moment(saveData.startTime), moment(saveData.endTime)];
        yield put({
          type: 'setModifyInfo',
          payload: saveData,
        });
      }
      return response;
    },
    // tab修改
    *getTabModifyInfo({ payload }, { call, put }) {
      const response = yield call(api.getTabModifyInfo, payload);
      if (response && response.status === 1) {
        const resData = response.data;
        resData.commodityType = resData.commodityType ? resData.commodityType.split(',').map(item => item * 1) :[];
        yield put({
          type: 'setModifyInfo',
          payload: resData,
        });
      }
      return response;
    },
    // 广告更新
    *updateStatus({ payload }, { call }) {
      return yield call(api.updateStatus, payload);
    },
    // tab更新
    *updateTabStatus({ payload }, { call }) {
      return yield call(api.updateTabStatus, payload);
    },

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
        list: payload,
      };
    },
    setTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
    setTabList(state, { payload }) {
      return {
        ...state,
        tabList: payload,
      };
    },
    setTabTotal(state, { payload }) {
      return {
        ...state,
        tabTotal: payload,
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
  },
};
