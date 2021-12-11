import * as api from '../services';
import { notification } from 'antd';

export default {
  namespace: 'MenuManage',

  state: {
    list: [],  //   列表
    menuInfo: {},   //   编辑详情
    menuType: 'M',  //   菜单类型
    modifyMenuId: '', //   修改id
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.queryMenuInfoList, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setRoleList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
    },
    *addMenuManage({ payload }, { call }) {
      return yield call(api.addMenuManage, payload)
    },
    *getMenuInfo({ payload }, { call, put }) {
      const response = yield call(api.getMenuInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setMenuInfo',
          payload: {
            data: response.data,
            modifyMenuId: payload.menuId,
          },
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
      return response;
    },
    *upDateMenuManage({ payload }, { call }) {
      return yield call(api.upDateMenuManage, payload)
    },
    *deleteMenuManage({ payload }, { call }) {
      return yield call(api.deleteMenuManage, payload)
    }
  },

  reducers: {
    setRoleList(state, { payload }) {
      return {
        ...state,
        list: payload
      };
    },
    setMenuInfo(state, { payload }) {
      return {
        ...state,
        menuInfo: payload.data,
        modifyMenuId: payload.modifyMenuId,
      };
    },
    modifyMenuType(state, { payload }) {
      return {
        ...state,
        menuType: payload
      };
    }
  },
};
