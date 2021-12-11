import { notification } from 'antd';
import { addListKey } from '@/utils/utils';
import * as api from '../services';

export default {
  namespace: 'notifyPush',
  state: {
    listData: [],
    record: {
      list: [],
      total: '',
      searchInfo: {},
    },
    template: {
      list: [],
      total: '',
      searchInfo: {},
    },
    category: {
      list: [],
      total: '',
      searchInfo: {},
    },
  },
  effects: {
    *getRecordList({ payload }, { call, put }) {
      const response = yield call(api.getRecordList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setRecordList',
          payload: response.data.recordList,
        });
        yield put({
          type: 'setRecordTotal',
          payload: response.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *setRecordSearchInfo({ payload }, { put }) {
      yield put({
        type: 'setRecordSearch',
        payload,
      });
    },
    *getTemplateList({ payload }, { call, put }) {
      const response = yield call(api.getTemplateList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setTemplateList',
          payload: response.data.recordList,
        });
        yield put({
          type: 'setTemplateTotal',
          payload: response.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *setTemplateSearchInfo({ payload }, { put }) {
      yield put({
        type: 'setTemplateSearch',
        payload,
      });
    },
    *getTemplateInfo({ payload }, { call }) {
      return yield call(api.getTemplateInfo, payload);
    },
    *setTemplate({ payload }, { call }) {
      return yield call(api.setTemplateInfo, payload);
    },
    *editTemplate({ payload }, { call }) {
      return yield call(api.editTemplate, payload);
    },
    *setTemplateStatus({ payload }, { call }) {
      return yield call(api.setTemplateStatus, payload);
    },
    *deleteTemplate({ payload }, { call }) {
      return yield call(api.deleteTemplate, payload);
    },
    *getCategoryList({ payload }, { call, put }) {
      const response = yield call(api.getCategoryList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'setCategoryList',
          payload: response.data.recordList,
        });
        yield put({
          type: 'setCategoryTotal',
          payload: response.data.total,
        });
      }
    },
    *setCategorySearchInfo({ payload }, { put }) {
      yield put({
        type: 'setCategorySearch',
        payload,
      });
    },
    *getCategoryInfo({ payload }, { call }) {
      return yield call(api.getCategoryInfo, payload);
    },
    *editCategory({ payload }, { call }) {
      return yield call(api.editCategory, payload);
    },
    *setCategoryStatus({ payload }, { call }) {
      return yield call(api.setCategoryStatus, payload);
    },
    *deleteCategory({ payload }, { call }) {
      return yield call(api.deleteCategory, payload);
    },
    *addCategory({ payload }, { call }) {
      return yield call(api.addCategory, payload);
    },
    *getCategorySelect({ payload }, { call }) {
      return yield call(api.getCategorySelect, payload);
    },
  },
  reducers: {
    setRecordList(state, { payload }) {
      return {
        ...state,
        record: {
          ...state.record,
          list: payload,
        },
      };
    },
    setRecordTotal(state, { payload }) {
      return {
        ...state,
        record: {
          ...state.record,
          total: payload,
        },
      };
    },
    setRecordSearch(state, { payload }) {
      return {
        ...state,
        record: {
          ...state.record,
          searchInfo: payload,
        },
      };
    },
    setTemplateList(state, { payload }) {
      return {
        ...state,
        template: {
          ...state.template,
          list: payload,
        },
      };
    },
    setTemplateTotal(state, { payload }) {
      return {
        ...state,
        template: {
          ...state.template,
          total: payload,
        },
      };
    },
    setTemplateSearch(state, { payload }) {
      return {
        ...state,
        template: {
          ...state.template,
          searchInfo: payload,
        },
      };
    },
    setCategoryList(state, { payload }) {
      return {
        ...state,
        category: {
          ...state.category,
          list: payload,
        },
      };
    },
    setCategoryTotal(state, { payload }) {
      return {
        ...state,
        category: {
          ...state.category,
          total: payload,
        },
      };
    },
    setCategorySearch(state, { payload }) {
      return {
        ...state,
        category: {
          ...state.category,
          searchInfo: payload,
        },
      };
    },
  },
};
