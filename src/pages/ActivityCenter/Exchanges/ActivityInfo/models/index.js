import * as api from '../services';

export default {
  namespace: 'activityExchangeInfo',
  state: {},
  effects: {
    * getExchangeInfo({ payload }, { call }) {
      return yield call(api.getExchangeInfo, payload);
    },
    * addExchange({ payload }, { call }) {
      return yield call(api.addExchange, payload);
    },
    * editExchange({ payload }, { call }) {
      return yield call(api.editExchange, payload);
    },
  },
};
