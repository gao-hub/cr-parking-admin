import * as api from '../services/RoleManage';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'RoleManage',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    modifyInfoData: {}, //  修改详情
    menuAuthorize: [], //   菜单授权
    modifyId: '',    //   修改id
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.queryRoleInfoList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'setRoleList',
          payload: {
            list: response.data.records,
            total: response.data.total
          }
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
    },
    *addRoleManage({ payload }, { call }) {
      return yield call(api.addRoleManage, payload);
    },
    *deleteRole({ payload }, { call }) {
      return yield call(api.deleteRole, payload);
    },
    *disengagement({ payload }, { call }) {
      return yield call(api.disengagement, payload);
    },
    *getModifyRoleInfo({ payload }, { call, put }) {
      const response = yield call(api.getModifyRoleInfo, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setModifyRoleInfo',
          payload: {
            data: response.data,
            id: payload.roleId
          },
        })
      }
      return response;
    },
    //   修改角色管理
    *upDateRoleManage({ payload }, { call, put }) {
      return yield call(api.upDateRoleManage, payload);
    }
  },

  reducers: {
    setRoleList(state, { payload }) {
      return {
        ...state,
        list: payload.list,
        total: payload.total
      };
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload
      };
    },
    setModifyRoleInfo(state, { payload }) {
      return {
        ...state,
        modifyInfoData: payload.data,
        menuAuthorize: payload.data.activeList,
        modifyId: payload.id
      };
    },
    modifyMenuAuthorize(state, { payload }) {
      return {
        ...state,
        menuAuthorize: payload,
      };
    }
  },
};
