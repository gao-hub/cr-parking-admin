import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

/** 管理员列表
 * list: Array   列表数据
 * pagination: Obj  分页数据
 * modifyInfo： Obj  修改详情
 * roleList : Array  角色列表
 */

export default {
  namespace: 'manageMember',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    modifyInfo: {},
    roleList: [],
  },

  effects: {
    /** 获取列表数据
     * payload 参数
     */
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.fetchList, payload);
      if (response && response.status === 1) {
        response.data.records = addListKey(
          response.data.records,
          payload.currPage,
          payload.pageSize
        );
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'saveList',
          payload: {
            records: [],
            total: 0,
          },
        });
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        });
      }
    },
    /** 添加
     * payload 参数
     */
    *addandmodify({ payload }, { call }) {
      return yield call(api.addandmodify, payload);
    },
    /** 获取修改详情
     * payload 参数
     */
    *getModifyInfo({ payload }, { call, put }) {
      const res = yield call(api.getModifyInfo, payload);
      if (res && res.status === 1) {
        yield put({
          type: 'saveInfo',
          payload: res.data,
        });
      } else if (res && res.status !== 1) {
        yield put({
          type: 'saveInfo',
          payload: {},
        });
        notification.error({
          message: '请求错误',
          description: res.statusDesc,
        });
      }
    },
    /** 修改管理员信息
     * payload 参数
     */
    *changeManageMember({ payload }, { call }) {
      return yield call(api.changeManageMember, payload);
    },
    /** 状态改变
     * payload 参数
     */
    *modifyState({ payload }, { call }) {
      return yield call(api.modifyState, payload);
    },
    /** 重置密码
     * payload 参数
     */
    *resetPassword({ payload }, { call }) {
      return yield call(api.resetPassword, payload);
    },
    /** 删除管理员
     * payload 参数
     */
    *deleteManage({ payload }, { call }) {
      return yield call(api.deleteManage, payload);
    },
    /** 获取角色列表
     * 无请求参数
     */
    *getRoleList({ payload }, { call, put }) {
      const res = yield call(api.getRoleList, {
        ...payload,
        current: 1,
        pageSize: 500,
      });
      if (res && res.status === 1) {
        yield put({
          type: 'saveRoleList',
          payload: res.data.records,
        });
      } else if (res && res.status !== 1) {
        yield put({
          type: 'saveRoleList',
          payload: [],
        });
        notification.error({
          message: '请求错误',
          description: res.statusDesc,
        });
      }
    },
  },

  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        data: {
          list: payload.records,
          pagination: {
            current: payload.current,
            pageSize: payload.size,
            total: payload.total,
          },
        },
      };
    },
    saveRoleList(state, { payload }) {
      return {
        ...state,
        roleList: payload,
      };
    },
    saveInfo(state, { payload }) {
      return {
        ...state,
        modifyInfo: payload,
      };
    },
  },
};
