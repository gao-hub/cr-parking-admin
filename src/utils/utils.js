import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import { message } from 'antd';

import provinces from 'china-division/dist/provinces.json';
import cities from 'china-division/dist/cities.json';
import areas from 'china-division/dist/areas.json';

// 正数后保留两位小数
// export const posRemain2 = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/
// 整数不大于9位，小数2位
export const posRemain2 = /^[0-9]{1,9}(\.[0-9]{1,2})?$/;

// 整数部分不能超过8位，小数部分不能超过2位(不能为0，010, .2)
export const rateReg = /^(?:0\.\d{1,2}|(?!0)\d{1,8}(?:\.\d{1,2})?)$/;

// 正整数正则表达式
export const regNum = /^[+]{0,1}(\d+)$/;

//   cookie
export function cookie() {
  const cookie = {
    set: function(key, val, maxAge = 1200) {
      //设置cookie方法
      // let date=new Date(); //获取当前时间
      // let expiresDays=time;  //将date设置为n天以后的时间
      // date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
      document.cookie = `${key}=${val};path=/;max-age=${maxAge}`; //设置cookie
    },
    get: function(key) {
      //获取cookie方法
      /*获取cookie参数*/
      let getCookie = document.cookie.replace(/[ ]/g, ''); //获取cookie，并且将获得的cookie格式化，去掉空格字符
      let arrCookie = getCookie.split(';'); //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
      let tips; //声明变量tips
      for (let i = 0; i < arrCookie.length; i++) {
        //使用for循环查找cookie中的tips变量
        let arr = arrCookie[i].split('='); //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
        if (key == arr[0]) {
          //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
          tips = arr[1]; //将cookie的值赋给变量tips
          break; //终止for循环遍历
        }
      }
      return tips;
    },
    delete: function(key, maxAge) {
      //删除cookie方法
      let date = new Date(); //获取当前时间
      date.setTime(date.getTime() - 10000); //将date设置为过去的时间
      document.cookie = `${key}=v; path=/; expires =${date.toGMTString()};max-age=${maxAge}`; //设置cookie
    },
  };
  return cookie;
}

//   富文本上传图片限制大小
export function myValidateFn(file) {
  const isLt3M = file.size / 1024 / 1024 < 3;
  const imgType = ['image/jpeg', 'image/png', 'image/gif'];
  const videoType = ['video/mp4'];
  let typeText = '文件'; // 文件类型中文描述
  if (imgType.includes(file.type)) {
    typeText = '图片';
  } else if (videoType.includes(file.type)) {
    typeText = '视频';
  }
  if (!isLt3M) {
    message.error(typeText + '必须小于3MB!');
    return false;
  }
  return true;
}

// 上传图片限制扩展名和大小
export function beforeUpload(file, uploadConfig = { fileType: ['image'], size: 1 }) {
  console.log(1111);
  // 判断上传文件规定类型与文件类型都为图片类型
  const isImage = () => {
    if (uploadConfig.fileType.includes('image')) {
      const type = uploadConfig.notIncludeGif ? ['image/jpeg', 'image/png'] : ['image/jpeg', 'image/png', 'image/gif'];
      // 返回 类型是否包含规定图片格式
      return type.includes(file.type);
    }
    return false;
  };
  const isVedio = () => {
    if (uploadConfig.fileType.includes('video/*')) {
      const type = 'video';
      // 返回 类型是否包含规定图片格式
      return file.type.indexOf('video') != -1;
    }
    return false;
  };
  // 判断上传文件规定类型与文件类型都为文件类型
  const isFile = () => {
    if (uploadConfig.fileType.includes('file')) {
      const type = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf',
      ];
      return type.includes(file.type);
    }
    return false;
  };
  // 判断上传文件规定类型与文件类型都为PDF类型
  const isPDF = () => {
    if (uploadConfig.fileType.includes('PDF')) {
      const type = ['application/pdf'];
      return type.includes(file.type);
    }
    return false;
  };
  // 判断文件是否超出最大限制
  const fileLimitSize = () => {
    const limitSize = file.size / 1024 / 1024 < uploadConfig.size;
    return limitSize;
  };
  // 验证图片大小
  const verfFileWidth = async (width, height) => {
    return await new Promise(function(resolve, reject) {
      let filereader = new FileReader();
      filereader.onload = e => {
        let src = e.target.result;
        const image = new Image();
        image.onload = function() {
          // 验证比例是否一致
          if (width && this.width / this.height !== width / height) {
            reject();
          } else {
            resolve();
          }
        };
        image.onerror = reject;
        image.src = src;
      };
      filereader.readAsDataURL(file);
    });
  };
  return new Promise(async (resolve, reject) => {
    if (!isImage() && !isFile() && !isPDF() && !isVedio()) {
      // 文件类型符合规定类型校验提示  例：规定为图片类型，且文件为图片类型
      let resStr = '你需要上传';
      for (let i = 0; i < uploadConfig.fileType.length; i++) {
        const type = uploadConfig.fileType[i];
        // 文件类型提示文案处理
        const typeTransfer = type === 'image' ? '图片格式' : type;
        resStr +=
          typeTransfer +
          (i == uploadConfig.fileType.length - 1 ? '' : ',') +
          (i == uploadConfig.fileType.length - 1 ? '的文件' : '');
      }
      message.error(resStr);
      reject();
    } else if (!fileLimitSize()) {
      // 文件大小限制校验提示
      const typeText = isImage() ? '图片' : isVedio() ? '视频' : '文件';
      message.error(`${typeText}必须小于${uploadConfig.size}MB!`);
      reject();
    } else if (uploadConfig.imgSize) {
      // 仅在设置图片尺寸时验证图片尺寸
      // 验证图片尺寸
      const {
        imgSize: { width, height },
      } = uploadConfig;
      // 取配置的限制宽高
      await verfFileWidth(width, height)
        .then(() => {
          resolve(file);
        })
        .catch(() => {
          message.error(`请上传比例为${width}px x ${height}px的图片`);
          reject();
        });
    } else {
      resolve(file);
    }
  });
}

// 函数截流
export function debounce(fn, interval) {
  // 在debounce中可以可以把interval理解成 用户停止了某个连续的操作后 再推迟interval执行fn
  var timerId = null;
  return function() {
    var current = +new Date();
    var args = [].slice.call(arguments, 0);
    var context = this;
    // 如果调用很密集 可以保证fn永远不会触发 必须等到有前后两个调用的间隔大于等于interval fn才能被执行
    // 如果调用很少 fn会在interval结束后被执行
    clearTimeout(timerId);
    timerId = setTimeout(function() {
      fn.apply(context, args);
    }, interval);
  };
}

// 根据身份证号计算性别、生日、年龄
export function CertificateNoParse(certificateNo) {
  var pat = /^\d{6}(((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}([0-9]|x|X))|(\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}))$/;
  if (!pat.test(certificateNo)) return null;
  var parseInner = function(certificateNo, idxSexStart, birthYearSpan) {
    var res = {};
    var idxSex = 1 - (certificateNo.substr(idxSexStart, 1) % 2);
    res.gender = idxSex == '1' ? '女' : '男';
    var year = (birthYearSpan == 2 ? '19' : '') + certificateNo.substr(6, birthYearSpan);
    var month = certificateNo.substr(6 + birthYearSpan, 2);
    var day = certificateNo.substr(8 + birthYearSpan, 2);
    res.birthday = year + '-' + month + '-' + day;

    var d = new Date(); //获取当前时间
    var monthFloor =
      d.getMonth() + 1 < parseInt(month, 10) ||
      (d.getMonth() + 1 == parseInt(month, 10) && d.getDate() < parseInt(day, 10))
        ? 1
        : 0;
    res.age = d.getFullYear() - parseInt(year, 10) - monthFloor;
    return res;
  };
  return parseInner(
    certificateNo,
    certificateNo.length == 15 ? 14 : 16,
    certificateNo.length == 15 ? 2 : 4
  );
}

//   统计密码评分标准
export function score(s) {
  let num = 0;
  if (s.length < 10) {
    num += 5;
  } else if (s.length >= 10 && s.length <= 12) {
    num += 10;
  } else {
    num += 25;
  }
  if (s.match(/[A-Za-z]/g) == null) {
    num += 0;
  } else if (s.match(/[A-Z]/g) == null) {
    num += 10;
  } else if (s.match(/[a-z]/g) == null) {
    num += 10;
  } else if (/[A-Z]/.test(s) && /[a-z]/.test(s)) {
    num += 20;
  }
  if (s.match(/\d/g) == null) {
    num += 0;
  } else if (s.match(/\d/g).length == 1) {
    num += 10;
  } else if (s.match(/\d/g).length > 1) {
    num += 20;
  }
  if (s.match(/[\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]/g) == null) {
    num += 0;
  } else if (
    s.match(/[\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]/g).length == 1
  ) {
    num += 10;
  } else if (
    s.match(/[\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]/g).length > 1
  ) {
    num += 25;
  }
  if (
    /\d/.test(s) &&
    /[a-z]/.test(s) &&
    /[A-Z]/.test(s) &&
    /[\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]/.test(s)
  ) {
    num += 5;
  } else if (
    /\d/.test(s) &&
    /[a-zA-Z]/.test(s) &&
    /[\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]/.test(s)
  ) {
    num += 3;
  } else if (/\d/.test(s) && /[a-zA-Z]/.test(s)) {
    num += 2;
  }
  return num;
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

// 将url网址转换成对象
export function queryURL(url) {
  let arr1 = url.split('?');
  //进行分割成数组
  let params = arr1.length > 1 ? arr1[1].split('&') : [];
  let obj = {}; //声明对象
  for (let i = 0; i < params.length; i++) {
    let param = params[i].split('='); //进行分割成数组
    obj[param[0]] = param[1]; //为对象赋值
  }
  return obj;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

// 为表格数据增加序号key
export function addListKey(arr = [], current = 1, pageSize = 10) {
  if (Array.isArray(arr)) {
    arr.map((item, index) => (item['key'] = index + 1 + (current - 1) * pageSize));
  }
  return arr;
}

// 为表格数据增加ParentRef
export function addParent(arr = []) {
  arr.forEach((item, index) => {
    const itemRef = item;
    if (arr.length === 1) {
      itemRef.isShowSort = false;
    } else {
      itemRef.isShowSort = true;
      itemRef.isOutShowUpSort = true;
      itemRef.isOutShowDownSort = true;
      if (index === 0) {
        itemRef.isOutShowUpSort = false;
      }
      if (index === arr.length - 1) {
        itemRef.isOutShowDownSort = false;
      }
    }

    itemRef.children.forEach((child, index1) => {
      const childRef = child;
      childRef.parentRef = itemRef;
      if (itemRef.children.length === 1) {
        childRef.isShowSort = false;
      } else {
        childRef.isShowSort = true;
        childRef.isShowUpSort = true;
        childRef.isShowDownSort = true;
        if (index1 === 0) {
          childRef.isShowUpSort = false;
        }
        if (index1 === itemRef.children.length - 1) {
          childRef.isShowDownSort = false;
        }
      }
    });
  });
  return arr;
}

/** 搜索框自适应布局栅格 */
export function selfAdaption() {
  return {
    inputConfig: {
      xxl: { span: 6 },
      xl: { span: 6 },
      lg: { span: 10 },
      md: { span: 12 },
      sm: { span: 16 },
      xs: { span: 20 },
    },
    timeConfig: {
      xxl: { span: 5 },
      xl: { span: 8 },
      lg: { span: 8 },
      md: { span: 10 },
      sm: { span: 24 },
    },
    formItemConfig: {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
    colConfig: {
      xxl: { span: 24 },
      xl: { span: 24 },
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
      xs: { span: 24 },
    },
    searchConfig: {
      xxl: { span: 4 },
      xl: { span: 5 },
      lg: { span: 7 },
      md: { span: 7 },
      sm: { span: 8 },
      xs: { span: 10 },
    },
  };
}

export function getLocation(locationArr) {
  const provincesLen = provinces.length;
  const citiesLen = cities.length;
  const areasLen = areas.length;

  const resObj = {};

  // 省
  for (let i = 0; i < provincesLen; i++) {
    if (provinces[i].code === locationArr[0]) {
      resObj.provinceName = provinces[i].name;
      resObj.provinceCode = provinces[i].code;
      break;
    }
  }

  // 市
  for (let i = 0; i < citiesLen; i++) {
    if (cities[i].code === locationArr[1]) {
      resObj.cityName = cities[i].name;
      resObj.cityCode = cities[i].code;
      break;
    }
  }

  // 区
  for (let i = 0; i < areasLen; i++) {
    if (areas[i].code === locationArr[2]) {
      resObj.districtName = areas[i].name;
      resObj.districtCode = areas[i].code;
      break;
    }
  }

  return resObj;
}

// 格式化金额
export function formatNumber(num, precision, separator) {
  var parts;
  // 判断是否为数字
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
    // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
    // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
    // 的值变成了 12312312.123456713
    num = Number(num);
    // 处理小数点位数
    num = (typeof precision !== 'undefined'
      ? (Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(precision)
      : num
    ).toString();
    // 分离数字的小数部分和整数部分
    parts = num.split('.');
    // 整数部分加[separator]分隔, 借用一个著名的正则表达式
    parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

    return parts.join('.');
  }
  return NaN;
}

// 过滤空值对象
export function filterEmptyObject(object) {
  for (let key in object) {
    if (
      (typeof object[key] !== 'number' && !object[key]) ||
      Array.isArray(object[key] && !object[key].length)
    ) {
      delete object[key];
    }
  }
  return object;
}
