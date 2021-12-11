import * as api from '../services';
import { notification } from 'antd';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'buildingManage',

  state: {
    list: [],  //   列表
    total: '',  //   总条数
    searchInfo: {},  //  搜索条件
    modifyInfoData: {}, //  修改详情
    parkingList: [], // 车位列表信息
    developerList: [], // 开发商列表信息
    natureList: [], // 获取新增编辑页面初始数据
    parkingAroundList: [],  //  周边停车状况渲染数据
    regionalPlanningList: [], // 获取新增编辑页面出事数据
    businessAccountList: [] // 物业公司列表信息
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(api.mockList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'setList',
          payload: response.data.records,
        });
        yield put({
          type: 'setTotal',
          payload: response.data.total
        })
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
    },
    // 获取开发商列表接口
    *developerList({ payload }, { call, put }) {
      const response = yield call(api.developerList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'setDeveloperList',
          payload: response.data.records,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
    },
    // 获取物业公司列表接口
    *businessAccountList({ payload }, { call, put }) {
      const response = yield call(api.businessAccountList, payload);
      if (response && response.status === 1) {
        response.data.recordList = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'setBusinessAccountList',
          payload: response.data,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: response.statusDesc,
        })
      }
    },
    // 获取车位列表接口
    *parkingList({ payload }, { call, put }) {
      const response = yield call(api.parkingList, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setParkingList',
          payload: response.data,
        })
      } else {
        notification.error({
          message: '车位列表信息获取失败',
          description: response.statusDesc,
        })
      }
    },

    // 获取开发商列表接口
    *selectList({ payload }, { call, put }) {
      const response = yield call(api.selectList, payload);
      if (response && response.status === 1) {
        yield put({
          type: 'setNatureList',
          payload: response.data.nature,
        });
        yield put({
          type: 'setRegionalPlanningList',
          payload: response.data.regionalPlanning,
        });
        yield put({
          type: 'setParkingAroundList',
          payload: response.data.parkingAround,
        });
      } else {
        notification.error({
          message: '请求错误',
          description: "response.statusDesc",
        })
      }
    },

    // 添加楼盘接口
    *addManage({ payload }, { call }) {
      return yield call(api.addManage, payload);
    },
    // 添加车位出售接口
    *parkingConsultant({ payload }, { call }) {
      return yield call(api.parkingConsultant, payload);
    },
    *getReturnRate({ payload }, { call }) {
      return yield call(api.getReturnRate, payload);
    },
    *modifyManage({ payload }, { call, put }) {
      return yield call(api.modifyManage, payload);
    },
    // 删除车位接口
    *deleteManage({ payload }, { call }) {
      return yield call(api.deleteManage, payload);
    },
    *getModifyInfo({ payload }, { call, put }) {
      const response = yield call(api.getModifyInfo, payload);
      if (response && response.status === 1) {
        let disabledInfo = false
        // 遍历车位列表 找到不是初始状态的车位，更改楼盘锁定标志位
        if (response.data && response.data.parkingList && Array.isArray(response.data.parkingList)) {
          const parkingListLen = response.data.parkingList.length
          for (let i = 0; i < parkingListLen; i++) {
            if (response.data.parkingList[i].parkingSales != 0) {
              disabledInfo = true
              break
            }
          }
        }
        response.data.disabledInfo = disabledInfo
        yield put({
          type: 'setModifyInfo',
          payload: response.data,
        })
      }
      return response;
    },
    *exportExcel({ payload }, { call, put }) {
      const response = yield call(api.exportFile, payload)
    },
    *importExcel({ payload }, { call, put }) {
      return yield call(api.importExcel, payload)
    },
    // 根据车位号选择车位售价
    *getRetailPrice({ payload }, { call }) {
      return yield call(api.getRetailPrice, payload);
    },
    //  已售出的车位可转为在售
    *changeOnSale({ payload }, { call }) {
      return yield call(api.changeOnSale, payload);
    },
    // 楼盘置顶
    *setStickStatus({ payload }, { call }) {
      return yield call(api.setStickStatus, payload);
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
    setParkingList(state, { payload }) {
      return {
        ...state,
        parkingList: payload
      }
    },
    setDeveloperList(state, { payload }) {
      return {
        ...state,
        developerList: payload
      }
    },
    setBusinessAccountList(state, { payload }) {
      return {
        ...state,
        businessAccountList: payload
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
    setNatureList(state, { payload }) {
      return {
        ...state,
        natureList: payload
      }
    },
    setRegionalPlanningList(state, { payload }) {
      return {
        ...state,
        regionalPlanningList: payload
      }
    },
    setParkingAroundList(state, { payload }) {
      return {
        ...state,
        parkingAroundList: payload || []
      }
    },
  }
};
