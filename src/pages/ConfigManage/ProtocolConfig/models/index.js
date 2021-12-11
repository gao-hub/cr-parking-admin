import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'protocolTemplateManage',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    modifyInfoData: {}, //  修改详情
    formData: {},  //  保存模态框对象的数据
    selectData: []  // 保存下拉框数据的对象
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.fetchList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(response.data.records, payload.currPage, payload.pageSize)
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
        })
      }
    },
    // 获取弹窗下拉信息接口
    *selectlist({ payload }, { call, put }) {
      const response = yield call(api.selectlist, payload);
      if (response && response.status === 1) yield put({ type: 'setSelectData', payload: response.data })
    },
    // 修改已存在的模板信息接口
    *updateExistProtocol({ payload }, { call, put }) {
      const response = yield call(api.updateExistProtocol, payload)
      if (response && response.status === 1) return true
      else return false
    },
    *insertAction({ payload }, { call }) {
      return yield call(api.insertAction, payload);
    },
    *deleteManage({ payload }, { call }) {
      return yield call(api.deleteManage, payload);
    },
    // 修改信息接口
    *updateAction({ payload }, { call, put }) {
      const response = yield call(api.updateAction, payload)
      if (response && response.status === 1) return true
      else return false
    },
    *getModifyInfo({ payload }, { call, put }) {
      const response = yield call(api.getModifyInfo, payload)
      if (response && response.status === 1) {
        response.data.protocolVersion = addListKey(response.data.protocolVersion, payload.currPage, payload.pageSize)
        yield put({
          type: 'setFormData',
          payload: response.data
        })
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
      return response
    },
    // 检验字段唯一接口
    *validationProtocolNameAction({ payload }, { call, put }) {
      const response = yield call(api.validationProtocolNameAction, payload)
      return response
    },
    *exportExcel({ payload }, { call, put }) {
      const response = yield call(api.exportFile, payload)
    }
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        list: payload
      };
    },
    setTotal(state, { payload }) {
      return {
        ...state,
        total: payload
      }
    },
    setFormData(state, { payload }) {
      return {
        ...state,
        formData: payload
      };
    },
    setSelectData(state, { payload }) {
      return {
        ...state,
        selectData: payload
      }
    },
    setSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload
      };
    },
    setModifyInfo(state, { payload }) {
      return {
        ...state,
        modifyInfoData: payload
      };
    },
  }
};
