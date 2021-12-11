import * as api from '../services';

export default {
  namespace: 'memberDetail',
  state: {},
  effects: {
    *getMemberDetail({ payload }, { call, put }) {
      return yield call(api.getMembetDetail, payload);
    },
    reducers: {},
  },
};
