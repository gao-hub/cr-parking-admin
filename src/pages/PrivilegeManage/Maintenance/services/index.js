import request from '@/utils/request';
import{ _baseApi } from '@/defaultSettings';


// ----------- 系统中心  ---->   数据字典 -------------
// 数据字典请求列表接口
export async function queryDataDictionary(payload) {
  return request(`${_baseApi}/dict/list`, {
    method: 'POST',
    body: payload
  });
}

// 添加数据字典
export async function addDataDictionary(payload) {
    return request(`${_baseApi}/dict/add`, {
      method: 'POST',
      body: payload
    });
  }
  
// 初始化修改数据字典信息
export async function initModifyInfo(payload) {
    return request(`${_baseApi}/dict/info`, {
      method: 'POST',
      body: payload
    });
  }
// 修改数据字典
export async function modifyDataDictionary(payload) {
    return request(`${_baseApi}/dict/update`, {
      method: 'POST',
      body: payload
    });
  }
  
// 删除数据字典
export async function deleteDataDictionary(payload) {
    return request(`${_baseApi}/dict/delete`, {
      method: 'POST',
      body: payload
    });
  }

//   同步数据字典
export async function synchronization() {
  return request(`${_baseApi}/dict/synchronize`, {
    method: 'GET',
  });
}
