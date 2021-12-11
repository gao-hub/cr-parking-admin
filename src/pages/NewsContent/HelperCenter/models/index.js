import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'helperCenter',

  state: {
    category: {
      list: [],
    },
    question: {
      list: [],
      total: '',
      searchInfo: {},
    },
    categorySelect: [],
  },

  effects: {
    *getCategoryList({ payload }, { call, put }) {
      const res = yield call(api.getCategoryList, payload);
      if (res && res.status === 1) {
        yield put({
          type: 'setCategoryList',
          // eslint-disable-next-line no-use-before-define
          payload: addDisabled(res.data),
        });
      } else notification.error({ message: '请求错误', description: res.statusDesc });
    },
    *addCategory({ payload }, { call }) {
      return yield call(api.addCategory, payload);
    },
    *editCategory({ payload }, { call }) {
      return yield call(api.editCategory, payload);
    },
    *deleteCategory({ payload }, { call }) {
      return yield call(api.deleteCategory, payload);
    },
    *getCategory({ payload }, { call }) {
      return yield call(api.getCategoryDetail, payload);
    },
    *moveCategory({ payload }, { call }) {
      return yield call(api.sortCategory, payload);
    },
    *moveQuestion({ payload }, { call }) {
      return yield call(api.sortQuestion, payload);
    },
    *getQuestionList({ payload }, { call, put }) {
      const response = yield call(api.getQuestionList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'test',
          payload: 1,
        });
        yield put({
          type: 'setQuestionList',
          payload: response.data.recordList,
        });
        yield put({
          type: 'setQuestionTotal',
          payload: response.data.total,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    *setQuestionSearchInfo({ payload }, { put }) {
      yield put({
        type: 'setQuestionSearch',
        payload,
      });
    },
    *exportQuestionFile({ payload }, { call }) {
      yield call(api.exportQuestionFile, payload);
    },
    *getCategorySelect({ payload }, { call}) {
      return yield call(api.getCategorySelect, payload);
    },
    *setQuestionStatus({ payload }, { call }) {
      return yield call(api.setQuestionStatus, payload);
    },
    *getQuestion({ payload }, { call }) {
      return yield call(api.getQuestion, payload);
    },
    *addQuestion({ payload }, { call }) {
      return yield call(api.addQuestion, payload);
    },
    *editQuestion({ payload }, { call }) {
      return yield call(api.editQuestion, payload);
    },
    *deleteQuestion({ payload }, { call }) {
      return yield call(api.deleteQuestion, payload);
    },
  },

  reducers: {
    setCategoryList(state, { payload }) {
      return {
        ...state,
        category: {
          ...state.category,
          list: payload,
        },
      };
    },
    setQuestionList(state, { payload }) {
      return {
        ...state,
        question: {
          ...state.question,
          list: payload,
        },
      };
    },
    setQuestionTotal(state, { payload }) {
      return {
        ...state,
        question: {
          ...state.question,
          total: payload,
        },
      };
    },
    setQuestionSearch(state, { payload }) {
      return {
        ...state,
        question: {
          ...state.question,
          searchInfo: payload,
        },
      };
    },
    setCategorySelect(state, payload) {
      return { ...state, categorySelect: payload };
    },
  },
};

// 处理上移下移禁用问题，添加disabledUp,disabledDown
const addDisabled = (list = []) => {
  list.forEach((item, index) => {
    if (index === 0) {
      item.disabledUp = true;
    }
    if (index === list.length-1) {
      item.disabledDown = true;
    }
    if (item.children && item.children.length) {
      addDisabled(item.children);
    }
  })
  return list;
}
