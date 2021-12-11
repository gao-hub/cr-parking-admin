import React, { Component } from 'react';
import {
  PageHeader,
  Divider,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Cascader,
  Select,
  Radio,
  DatePicker,
  Menu,
  Dropdown,
  Icon,
  Table,
  Button,
  Popconfirm,
  Spin,
  message,
  Checkbox,
} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Upload from '@/components/Upload';
import options from '@/utils/cascader-address-options';
import ModifyForm from './AddModal';
import { posRemain2, getLocation } from '@/utils/utils';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { _baseApi } from '@/defaultSettings.js';
import permission from '@/utils/PermissionWrapper';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';

@permission
@connect(({ buildingManage, loading }) => ({
  buildingManage,
  submitLoading:
    loading.effects['buildingManage/addManage'] ||
    loading.effects['buildingManage/modifyManage'] ||
    loading.effects['buildingManage/getModifyInfo'],
}))
@Form.create()
export default class BuildingDetail extends Component {
  state = {
    fileList: [],
    tableList: [],
    current: 1,
    discRateDisabled: false,
    buildingTemplate: '',
    isFirstDiscount: false, //是否开启首购专享
    UseFlagData: {}, //是否启用自用暂存数据
    isShow: false,
  };

  /**
   * @desc 校验车位价格比例 + 履约保证金比例 + 代买服务费比例是否为 100%
   * @return { boolean }
   */
  checkIsHundred = () => {
    const { form } = this.props;
    const { getFieldValue, validateFields } = form;

    const json = form.getFieldsValue() || {};
    const { standardRate = '', serviceRate = '', bondRate = '' } = json;

    const standard = standardRate ? parseFloat(standardRate) : 0;
    const service = serviceRate ? parseFloat(serviceRate) : 0;
    const bond = bondRate ? parseFloat(bondRate) : 0;

    return standard + service + bond === 100;
  };

  /**
   * @desc 提交
   */
  submitHandler = () => {
    if (!this.checkIsHundred()) {
      message.error('车位价格比例 + 履约保证金比例 + 代买服务费比例必须为 100%');
      return false;
    }

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let res;
        const parkCodeArr = []; // 保存车位编号的数组
        // format data part
        const tableList = [];
        const locationInfo = getLocation(values.location);
        values.delivertTime = values.delivertTime
          ? new Date(moment(values.delivertTime).format(monthFormat))
          : '';
        // 车位类型格式化
        if (values.nature && values.nature.length) {
          values.nature = values.nature.join('/');
        } else {
          values.nature = '';
        }
        if (values.regionalPlanning && values.regionalPlanning.length) {
          values.regionalPlanning = values.regionalPlanning.join('/');
        } else {
          values.regionalPlanning = '';
        }

        this.state.tableList.forEach(item => {
          if (item.parkingSales === 0 || item.parkingSales === 3 || !item.parkingSales) {
            tableList.push(item);
          }
        });

        if (values.pictureAr.length > 15) {
          message.error('楼盘图片最多上传15张');
          return;
        }
        if (values.parkingPictureAr.length > 15) {
          message.error('车位平面图最多上传15张');
          return;
        }
        // 原来tableList（只有在售状态0：在售，3：退货在售），改为this.state.tableList所有数据验证
        this.state.tableList.map(item => {
          parkCodeArr.push(item.parkingCode);
        });
        if (Array.from(new Set(parkCodeArr)).length !== this.state.tableList.length) {
          message.error('车位编号不能重复');
          return;
        }

        if (values.videoUrlAr.length === 0 && values.videoPictureAr.length > 0) {
          message.error('请上传APP视频');
          return;
        }
        if (values.videoUrlAr.length > 0 && values.videoPictureAr.length === 0) {
          message.error('请上传视频封面图');
          return;
        }

        values = { ...values, ...locationInfo };

        const formData = { ...values, parkingList: tableList };
        const { modifyInfoData } = this.props.buildingManage;

        if (modifyInfoData.id) {
          res = await this.props.dispatch({
            type: 'buildingManage/modifyManage',
            payload: {
              ...formData,
              id: modifyInfoData.id,
              share: 0,
            },
          });
        } else {
          res = await this.props.dispatch({
            type: 'buildingManage/addManage',
            payload: {
              ...formData,
              share: 0,
            },
          });
        }
        if (res.status === 1) {
          message.success('操作成功');
          this.props.dispatch(
            routerRedux.push({
              pathname: '/product/building/list',
            })
          );
        } else {
          message.error(res.statusDesc);
        }
      }
    });
  };

  // 批量导入接口
  importHandler = async e => {
    const { files } = e.target;
    if (files.length > 0) {
      const excelTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      const fileType = files[0].type;
      // console.log(!files[0].name.match('.xls'))
      if (!(excelTypes.includes(fileType) || files[0].name.match('.xls'))) {
        message.error('请上传excel类型的文件');
        // 清除input
        this.refs.fileIpt.value = '';
        return;
      }
      if (!this.checkIsHundred()) {
        message.error('车位价格比例 + 履约保证金比例 + 代买服务费比例必须为 100%');
        // 清除input
        this.refs.fileIpt.value = '';
        return false;
      }
      const { form } = this.props;
      const { getFieldValue, validateFields } = form;
      const json = form.getFieldsValue() || {};
      const { standardRate = '', serviceRate = '', bondRate = '', sellRate = '' } = json;

      try {
        const fd = new FormData();
        fd.append('file', files[0]);
        fd.append('standardRate', standardRate);
        fd.append('serviceRate', serviceRate);
        fd.append('bondRate', bondRate);
        fd.append('sellRate', sellRate);
        const res = await this.props.dispatch({
          type: 'buildingManage/importExcel',
          payload: fd,
        });
        if (res.status === 1) {
          const len = this.state.tableList.length;
          res.data.map((item, idx) => (item.key = len + idx));
          console.log('import file', res.data);
          const resArr = this.state.tableList.concat(res.data);
          await this.setState({
            tableList: resArr,
          });
        } else {
          message.error(res.statusDesc);
        }
        // 清除input
        this.refs.fileIpt.value = '';
      } catch (err) {
        // 清除input
        this.refs.fileIpt.value = '';
        console.log(err);
      }
    }
  };

  //   初始化获取数据
  getInitInfo = async () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (id !== 'new') {
      // 如果有id 则请求详情数据并进行赋值
      const res = await this.props.dispatch({
        type: 'buildingManage/getModifyInfo',
        payload: {
          id,
        },
      });
      if (res.status !== 1) {
        message.error(res.statusDesc);
        return;
      }
      const {
        buildingManage: { modifyInfoData },
      } = this.props;

      if (modifyInfoData.firstPurchaseFlag === 1) {
        this.setState({ discRateDisabled: true });
      } else {
        this.setState({ discRateDisabled: false });
      }
      this.setState({
        tableList: (modifyInfoData && modifyInfoData.parkingList) || [],
        discRateDisabled: modifyInfoData && modifyInfoData.selfUse === 1,
        buildingTemplate: modifyInfoData.buildingTemplate,
        isFirstDiscount: modifyInfoData.firstPurchaseFlag === 1 ? true : false,
      });

      if (modifyInfoData.isAnalyse === 1) {
        this.setState({
          isShow: true,
        });
      } else {
        this.setState({
          isShow: false,
        });
      }
      // form.setFieldsValue({
      //   avgGrade: num,
      // });
    } else {
      // 获取分润比例接口
      const res = await this.props.dispatch({
        type: 'buildingManage/getReturnRate',
        payload: {},
      });
      if (res.status === 1) {
        this.props.form.setFieldsValue({ share: res.data.apportionmentRatio });
        this.props.form.setFieldsValue({ rentRate: res.data.rentRate });
        this.props.form.setFieldsValue({ interestRate: res.data.interestRate });
        this.props.form.setFieldsValue({ interestRateThree: res.data.interestRateThree });
        this.props.form.setFieldsValue({ interestRateSix: res.data.interestRateSix });
        this.props.form.setFieldsValue({ buybackServiceFee: res.data.buybackServiceFee });
        this.props.form.setFieldsValue({ breachRate: res.data.breachRate });
        this.props.form.setFieldsValue({ discountRate: res.data.discountRate });
        this.props.form.setFieldsValue({ sellRate: res.data.sellRate });
        this.props.form.setFieldsValue({ standardRate: res.data.standardRate });
        this.props.form.setFieldsValue({ bondRate: res.data.bondRate });
        this.props.form.setFieldsValue({ serviceRate: res.data.serviceRate });
        this.setState({
          discRateDisabled: this.props.form.getFieldValue('selfUse') === 1,
          buildingTemplate: res.data.buildingTemplate,
        });
      }
      // console.log(res);
      // if (res.isAnalyse === 1) {
      //   this.setState({
      //     isShow: true,
      //   });
      // } else {
      //   this.setState({
      //     isShow: false,
      //   });
      // }

      //   let json = form.getFieldsValue() || {};
      // json[name] = e;
      // let num = (
      //   (json.trafficGrade +
      //     json.educationGrade +
      //     json.liveGrade +
      //     json.planGrade +
      //     json.parkingGrade) /
      //   5
      // ).toFixed(1);
      // form.setFieldsValue({
      //   avgGrade: num,
      // });
    }
  };

  async componentDidMount() {
    // 请求开发商列表接口
    this.props.dispatch({
      type: 'buildingManage/developerList',
      payload: {
        currPage: 1,
        pageSize: 999999,
      },
    });
    // 请求物业公司列表接口
    this.props.dispatch({
      type: 'buildingManage/businessAccountList',
      payload: {
        currPage: 1,
        pageSize: 999999,
      },
    });

    // 请求下拉初始化数据
    this.props.dispatch({
      type: 'buildingManage/selectList',
      payload: {
        currPage: 1,
        pageSize: 999999,
      },
    });

    this.getInitInfo();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'buildingManage/setModifyInfo',
      payload: {},
    });
  }

  comprehensiveScore = (e, name) => {
    // console.log(e, name)
    let { form } = this.props;
    let json = form.getFieldsValue() || {};
    json[name] = e;
    let num = (
      (json.trafficGrade +
        json.educationGrade +
        json.liveGrade +
        json.planGrade +
        json.parkingGrade) /
      5
    ).toFixed(1);
    form.setFieldsValue({
      avgGrade: num,
    });
  };

  // 改变分析报告
  onChangeAnalysis = e => {
    if (e.target.value === 1) {
      this.setState({
        isShow: true,
      });
    } else {
      this.setState({
        isShow: false,
      });
    }
  };

  /**
   * 点击是否自用
   * */
  OnRadioGroup = e => {
    let { form } = this.props;
    let selfBuybackPeriodStart = form.getFieldValue('selfBuybackPeriodStart');
    let selfBuybackPeriodDuration = form.getFieldValue('selfBuybackPeriodDuration');
    let selfServiceFeeRate = form.getFieldValue('selfServiceFeeRate');

    if (e.target.value == '1') {
      this.setState({ discRateDisabled: true });
      this.setState({
        UseFlagData: { selfBuybackPeriodStart, selfBuybackPeriodDuration, selfServiceFeeRate },
      });
    } else {
      this.setState({ discRateDisabled: false });
      const {
        selfBuybackPeriodStart,
        selfBuybackPeriodDuration,
        selfServiceFeeRate,
      } = this.state.UseFlagData;
      form.setFieldsValue({
        selfBuybackPeriodStart,
        selfBuybackPeriodDuration,
        selfServiceFeeRate,
      });
    }
  };

  /**
   * 点击是否开启首购专享
   * */
  OnFirstDiscount = e => {
    if (e.target.value == '1') {
      this.setState({ isFirstDiscount: true });
    } else {
      this.setState({ isFirstDiscount: false });
    }
  };

  /**
   * @desc 车位价格+履约保证金+代买服务费 校验
   */
  validateFunc = async (rule, value, callback) => {
    value = parseFloat(value);
    if (value == null || value == '') {
      callback('请输入比例配置！');
    } else if (value > 100 || !value.toString().match(posRemain2)) {
      callback('请输入正确的比例配置');
    } else if (!/(^[1-9]\d*$)/.test(value)) {
      callback('比例只能为正整数');
    }

    callback();
  };

  /**
   * 下载模板
   */
  downTemplate = () => {
    window.open(this.state.buildingTemplate);
  };

  render() {
    const {
      form: { getFieldDecorator },
      match: {
        params: { id },
      },
      buildingManage: {
        modifyInfoData,
        developerList,
        businessAccountList,
        natureList,
        regionalPlanningList,
        parkingAroundList,
      },
    } = this.props;
    const disabled = modifyInfoData.disabledInfo || false;
    // console.log('----disabled', )
    const formConfig = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };

    const columns = [
      {
        title: '车位基础信息',
        className: 'column-money',
        align: 'center',
        dataIndex: 'keys',
        children: [
          {
            title: '车位编号',
            dataIndex: 'parkingCode',
            key: 'parkingCode',
          },
          {
            title: '车位类型',
            dataIndex: 'parkingType',
            key: 'parkingType',
          },
          {
            title: '车位图片',
            dataIndex: 'picture',
            key: 'picture',
            align: 'center',
            width: 110,
            render: record =>
              record != null && record != '' ? (
                <img src={record} width={70} height={70} alt="" />
              ) : (
                ''
              ),
          },
          {
            title: '产权证',
            dataIndex: 'certificates',
            key: 'certificates1',
            align: 'center',
            width: 110,
            render: record =>
              record != null && record != '' ? (
                <img src={record} width={70} height={70} alt="" />
              ) : (
                ''
              ),
          },
          {
            title: '车位长（m）',
            dataIndex: 'parkingLength',
            key: 'parkingLength',
          },
          {
            title: '车位宽（m）',
            dataIndex: 'parkingWidth',
            key: 'parkingWidth',
          },
          {
            title: '车位面积（㎡）',
            dataIndex: 'parkingArea',
            key: 'parkingArea',
          },
          {
            title: '进货价格',
            dataIndex: 'purchasePrice',
            key: 'purchasePrice',
            render: record => (record != null ? record : 0) + '元',
          },
          {
            title: '购买价款',
            dataIndex: 'standardPrice',
            key: 'standardPrice',
            render: record => (record ? record : 0) + '元',
          },
          {
            title: '车位价格',
            dataIndex: 'wholesalePrice',
            key: 'wholesalePrice',
            render: record => (record != null ? record : 0) + '元',
          },
          {
            title: '履约保证金',
            dataIndex: 'bond',
            key: 'bond',
            render: record => (record != null ? record : 0) + '元',
          },
          {
            title: '代买服务费',
            dataIndex: 'serviceCharge',
            key: 'serviceCharge',
            render: record => (record != null ? record : 0) + '元',
          },
          {
            title: '零售价格',
            dataIndex: 'retailPrice',
            key: 'retailPrice',
            render: record => (record != null ? record : 0) + '元',
          },
          {
            title: '产权车位',
            dataIndex: 'selfPropertyRights',
            key: 'selfPropertyRights',
            render: record => (record == 1 ? '是' : record == null ? '' : '否'),
          },
          {
            title: '开启租售',
            dataIndex: 'rentSale',
            key: 'rentSale',
            render: record => (record == 0 ? '是' : record == null ? '' : '否'),
          },
          {
            title: '支持自用',
            dataIndex: 'selfUseFlag',
            key: 'selfUseFlag',
            render: record => (record == 1 ? '是' : record == null ? '' : '否'),
          },
        ],
      },

      // {
      //   title: '车位面积',
      //   dataIndex: 'parkingArea',
      //   key: 'parkingArea',
      // },

      // {
      //   title: '开发商指导价',
      //   dataIndex: 'averagePrice',
      //   key: 'averagePrice',
      //   render: record => (record != null ? record : 0) + '元',
      // },

      {
        title: '标准版价格信息',
        className: 'column-money',
        align: 'center',
        dataIndex: 'key1',
        children: [
          {
            title: '标准版购买价款',
            dataIndex: 'basicSalePrice',
            key: 'basicSalePrice',
            render: record => (record != null ? record : 0) + '元',
          },
          {
            title: '标准版车位价格',
            dataIndex: 'basicPrice',
            key: 'basicPrice',
            render: record => (record != null ? record : 0) + '元',
          },
          {
            title: '标准版服务费',
            dataIndex: 'basicServiceFee',
            key: 'basicServiceFee',
            render: record => (record != null ? record : 0) + '元',
          },
        ],
      },
      {
        title: '保价版价格信息',
        className: 'column-money',
        align: 'center',
        dataIndex: 'key',
        children: [
          {
            title: '保价版购买价款',
            dataIndex: 'buybackSalePrice',
            key: 'buybackSalePrice',
            render: record => (record != null ? record : 0) + '元',
          },
          {
            title: '保价版车位价格',
            dataIndex: 'buybackPrice',
            key: 'buybackPrice',
            render: record => (record != null ? record : 0) + '元',
          },
          {
            title: '保价版服务费',
            dataIndex: 'buybackServiceFee',
            key: 'buybackServiceFee',
            render: record => (record != null ? record : 0) + '元',
          },
        ],
      },
      {
        title: '操作',
        className: 'column-money',
        align: 'center',
        dataIndex: 'key2',
        children: [
          {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
          },
          {
            title: '操作',
            render: (record, row, idx) => {
              const { permission } = this.props;
              const action = (
                <Menu>
                  {
                    (permission.includes('chuangrong:buildingParking:update') &&
                    (record.parkingStatus === 1 ||
                      (record.parkingSales === 0 && record.auditStatus !== 6))) &&
                    <Menu.Item
                      onClick={() => {
                        console.log(record, 111);
                        this.modifyChild.setState({
                          infoData: record,
                          idx: idx + (this.state.current - 1) * 10,
                        });
                        this.modifyChild.changeVisible(true);
                      }}
                    >
                      <Icon type="edit" />
                      编辑
                    </Menu.Item>
                  }

                  <Menu.Item>
                    {
                      (permission.includes('chuangrong:buildingParking:delete') &&
                        (record.parkingStatus === 1 ||
                          (record.parkingSales === 0 && record.auditStatus !== 6))) &&
                      <Popconfirm
                        onConfirm={async () => {
                          // 请求删除接口
                          if (record.id != null) {
                            const res = await this.props.dispatch({
                              type: 'buildingManage/deleteManage',
                              payload: {
                                id: record.id,
                              },
                            });
                            if (res.status !== 1) {
                              message.error(res.statusDesc);
                              return;
                            }
                          }
                          const { tableList } = this.state;
                          tableList.splice(idx + (this.state.current - 1) * 10, 1);
                          // const resArr = []
                          // tableList.forEach(item => {
                          //   if (item.parkingCode !== record.parkingCode) resArr.push(item)
                          // })
                          if (idx == 0 && this.state.current !== 1) {
                            this.setState({
                              current: this.state.current - 1,
                            });
                          }
                          this.setState({ tableList });
                        }}
                        title="确定删除该条数据吗？"
                        okText="Yes"
                        cancelText="No"
                      >
                        <Icon type="close" />
                        删除
                      </Popconfirm>
                    }
                  </Menu.Item>
                  {permission.includes('chuangrong:building:frame') ? (
                    <Menu.Item>
                      <Popconfirm
                        onConfirm={async () => {
                          const { tableList } = this.state;
                          const resArr = [];
                          tableList.forEach((item, index) => {
                            if (idx + (this.state.current - 1) * 10 === index) {
                              item.parkingStatus =
                                item.parkingStatus.toString() === '0' ? '1' : '0';
                            }
                            resArr.push(item);
                          });
                          this.setState({ tableList: resArr });
                        }}
                        title="确定要执行本次操作吗？"
                        okText="Yes"
                        cancelText="No"
                      >
                        <Icon type="edit" />
                        {record.parkingStatus.toString() === '0' ? '下架' : '上架'}
                      </Popconfirm>
                    </Menu.Item>
                  ) : null}

                  {id !== 'new' &&
                  record.parkingSales === 4 &&
                  permission.includes('chuangrong:building:sales') ? (
                    <Menu.Item>
                      <Popconfirm
                        onConfirm={async () => {
                          const res = await this.props.dispatch({
                            type: 'buildingManage/changeOnSale',
                            payload: {
                              id: record.id,
                            },
                          });
                          if (res && res.status === 1) {
                            message.success(res.statusDesc);
                            this.getInitInfo();
                          }
                        }}
                        title="确定要执行本次操作吗？"
                        okText="Yes"
                        cancelText="No"
                      >
                        <Icon type="sync" />
                        在售
                      </Popconfirm>
                    </Menu.Item>
                  ) : null}
                </Menu>
              );
              return (
                <Dropdown
                  // disabled={
                  //   !(
                  //     record.parkingSales == 0 ||
                  //     record.parkingSales === 4 ||
                  //     record.parkingSales === undefined
                  //   )
                  // }
                  overlay={action}
                >
                  <a className="ant-dropdown-link" href="#">
                    操作
                    <Icon type="down" />
                  </a>
                </Dropdown>
              );
            },
          },
        ],
      },
    ];
    return (
      <>
        <input
          type="file"
          ref="fileIpt"
          onChange={this.importHandler}
          style={{ display: 'none' }}
        />
        {id != 'new' && !modifyInfoData.id ? null : (
          <Form>
            <Spin spinning={this.props.submitLoading ? true : false}>
              <PageHeaderWrapper>
                <PageHeader title={id != 'new' ? '修改楼盘' : '新建楼盘'} />
                <Divider orientation="left">楼盘信息</Divider>
                <Col xxl={8} md={12}>
                  <FormItem label="楼盘名称" {...formConfig}>
                    {getFieldDecorator('buildingName', {
                      rules: [{ required: true, message: '请输入楼盘名称' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.buildingName != null
                          ? modifyInfoData.buildingName
                          : null,
                    })(<Input disabled={disabled} maxLength={20} placeholder={'请输入楼盘名称'} />)}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="所在地" {...formConfig}>
                    {getFieldDecorator('location', {
                      rules: [{ required: true, message: '请选择所在地' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.provinceCode
                          ? [
                              modifyInfoData.provinceCode.toString() || null,
                              modifyInfoData.cityCode.toString() || null,
                              modifyInfoData.districtCode.toString() || null,
                            ]
                          : [],
                    })(<Cascader disabled={disabled} options={options} />)}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="详细地址" {...formConfig}>
                    {getFieldDecorator('address', {
                      rules: [{ required: true, message: '请输入详细地址' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.address != null
                          ? modifyInfoData.address
                          : null,
                    })(
                      <Input disabled={disabled} maxLength={150} placeholder={'请输入详细地址'} />
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="开发商" {...formConfig}>
                    {getFieldDecorator('developerId', {
                      rules: [{ required: true, message: '请选择开发商' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.developerId != null
                          ? modifyInfoData.developerId
                          : null,
                    })(
                      <Select disabled={disabled} placeholder="请选择开发商" allowClear>
                        {developerList.map(item => {
                          if (item.openStatus === 0) {
                            return (
                              <Option value={item.id} key={item.id}>
                                {item.developer}
                              </Option>
                            );
                          }
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="房屋均价" {...formConfig}>
                    {getFieldDecorator('buildingPrice', {
                      rules: [
                        { required: true, message: '请填写房屋均价' },
                        {
                          validator: (rule, val, cb) => {
                            if (val && !val.toString().match(posRemain2)) {
                              cb('请输入正确的价格');
                            } else {
                              cb();
                            }
                          },
                        },
                      ],
                      initialValue:
                        modifyInfoData && modifyInfoData.buildingPrice != null
                          ? modifyInfoData.buildingPrice
                          : null,
                    })(
                      <Input maxLength={18} addonAfter={'元/㎡'} placeholder={'请输入房屋均价'} />
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="房屋类型" {...formConfig}>
                    {getFieldDecorator('buildingType', {
                      // rules: [{ required: true, message: '请房屋类型' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.buildingType != null
                          ? modifyInfoData.buildingType
                          : null,
                    })(
                      <RadioGroup>
                        <Radio value={0}>住宅</Radio>
                        <Radio value={1}>别墅</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="产权年限" {...formConfig}>
                    {getFieldDecorator('buildingYears', {
                      rules: [
                        {
                          validator: (rule, val, cb) => {
                            if (val && (val > 100 || !val.toString().match(posRemain2))) {
                              cb('请输入正确的土地使用年限');
                            } else {
                              cb();
                            }
                          },
                        },
                      ],
                      initialValue:
                        modifyInfoData && modifyInfoData.buildingYears != null
                          ? modifyInfoData.buildingYears
                          : null,
                    })(<Input addonAfter={'年'} placeholder={'请输入土地使用年限'} />)}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="交房时间" {...formConfig}>
                    {getFieldDecorator('delivertTime', {
                      rules: [{ required: true, message: '请选择交房时间' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.delivertTime
                          ? moment(modifyInfoData.delivertTime, monthFormat)
                          : null,
                    })(<MonthPicker format={monthFormat} />)}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="销售情况" {...formConfig}>
                    {getFieldDecorator('propertySales', {
                      initialValue:
                        modifyInfoData && modifyInfoData.propertySales != null
                          ? modifyInfoData.propertySales
                          : 0,
                    })(
                      <RadioGroup
                        allowClear
                        onChange={e => {
                          if (e.target.value === 0) {
                            this.props.form.setFieldsValue({ occupancy: '0' });
                          }
                          // else {
                          //   this.props.form.setFieldsValue({ occupancy: null });
                          // }
                        }}
                      >
                        <Radio value={0}>未开盘</Radio>
                        <Radio value={1}>在售</Radio>
                        <Radio value={2}>已售罄</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="车位配比" {...formConfig}>
                    {getFieldDecorator('proportioning', {
                      initialValue:
                        modifyInfoData && modifyInfoData.proportioning != null
                          ? modifyInfoData.proportioning
                          : null,
                    })(<Input placeholder={'请输入车位配比'} />)}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="入住率" {...formConfig}>
                    {getFieldDecorator('occupancy', {
                      rules: [
                        {
                          validator: (rule, val, cb) => {
                            if (
                              val &&
                              (val > 100 || (val != 0 && !val.toString().match(posRemain2)))
                            ) {
                              cb('请输入正确的入住率');
                            } else {
                              cb();
                            }
                          },
                        },
                      ],
                      initialValue:
                        modifyInfoData && modifyInfoData.occupancy != null
                          ? modifyInfoData.occupancy
                          : null,
                    })(
                      <Input
                        disabled={this.props.form.getFieldValue('propertySales') == 0}
                        placeholder={'请输入入住率'}
                        addonAfter={'%'}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="车位类型" {...formConfig}>
                    {getFieldDecorator('nature', {
                      initialValue:
                        modifyInfoData && modifyInfoData.nature != null
                          ? modifyInfoData.nature.split('/')
                          : null,
                    })(
                      <Checkbox.Group>
                        {natureList.map(item => {
                          return (
                            <Checkbox value={item.title} key={item.title}>
                              {item.title}
                            </Checkbox>
                          );
                        })}
                      </Checkbox.Group>
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="车位总量" {...formConfig}>
                    {getFieldDecorator('parkingSum', {
                      rules: [
                        {
                          validator: (rule, val, cb) => {
                            if (val && !/(^[1-9]\d*$)/.test(val)) {
                              cb('车位总量只能为正整数');
                            }
                            cb();
                          },
                        },
                      ],
                      initialValue: modifyInfoData && modifyInfoData.parkingSum,
                    })(<Input placeholder="请输入车位总量" />)}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem
                    required
                    label="购买价款区间"
                    style={{ marginBottom: 0 }}
                    {...formConfig}
                  >
                    <Row>
                      <Col span={11}>
                        <FormItem>
                          {getFieldDecorator('sectionMin', {
                            rules: [
                              {
                                validator: (rule, val, cb) => {
                                  const sectionMax = this.props.form.getFieldValue('sectionMax');
                                  if (val == null || val == '') {
                                    cb('请填写最小报价');
                                  }
                                  if (val && !val.toString().match(posRemain2)) {
                                    cb('请输入正确的报价');
                                  } else if (
                                    sectionMax &&
                                    sectionMax - 0 > 0 &&
                                    val - 0 > sectionMax - 0
                                  ) {
                                    cb('不能大于最高报价');
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.sectionMin != null
                                ? modifyInfoData.sectionMin
                                : null,
                          })(<Input addonAfter={'元'} />)}
                        </FormItem>
                      </Col>
                      <Col span={2} style={{ textAlign: 'center' }}>
                        ~
                      </Col>
                      <Col span={11}>
                        <FormItem>
                          {getFieldDecorator('sectionMax', {
                            rules: [
                              {
                                validator: (rule, val, cb) => {
                                  const sectionMin = this.props.form.getFieldValue('sectionMin');
                                  if (val == null || val == '') {
                                    cb('请填写最大报价');
                                  }
                                  if (val && !val.toString().match(posRemain2)) {
                                    cb('请输入正确的报价');
                                  } else if (
                                    sectionMin &&
                                    sectionMin - 0 > 0 &&
                                    val - 0 < sectionMin - 0
                                  ) {
                                    cb('不能小于最低报价');
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.sectionMax != null
                                ? modifyInfoData.sectionMax
                                : null,
                          })(<Input addonAfter={'元'} />)}
                        </FormItem>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="项目层次" {...formConfig}>
                    {getFieldDecorator('grade', {
                      rules: [{ required: true, message: '请选择项目层次' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.grade != null
                          ? modifyInfoData.grade
                          : null,
                    })(
                      <Select placeholder="请选择项目层次" allowClear>
                        <Option value={'低端'} key={1}>
                          低端
                        </Option>
                        <Option value={'中端'} key={2}>
                          中端
                        </Option>
                        <Option value={'高端'} key={3}>
                          高端
                        </Option>
                        <Option value={'豪宅'} key={4}>
                          豪宅
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="人车分流" {...formConfig}>
                    {getFieldDecorator('shunt', {
                      rules: [{ required: true, message: '请选择是否人车分流' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.shunt != null
                          ? modifyInfoData.shunt
                          : null,
                    })(
                      <RadioGroup allowClear>
                        <Radio value={'是'}>是</Radio>
                        <Radio value={'否'}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="车位性质" {...formConfig}>
                    {getFieldDecorator('parkingNatureList', {
                      rules: [{ required: true, message: '请选择车位性质' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.parkingNatureList != null
                          ? modifyInfoData.parkingNatureList
                          : null,
                    })(
                      <Checkbox.Group>
                        <Checkbox value={'产权'} key={'产权'}>
                          产权
                        </Checkbox>
                        <Checkbox value={'非产权'} key={'非产权'}>
                          非产权
                        </Checkbox>
                        <Checkbox value={'人防'} key={'人防'}>
                          人防
                        </Checkbox>
                      </Checkbox.Group>
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="交付情况" {...formConfig}>
                    {getFieldDecorator('delivery', {
                      rules: [{ required: true, message: '请选择交付情况' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.delivery != null
                          ? modifyInfoData.delivery
                          : null,
                    })(
                      <RadioGroup allowClear>
                        <Radio value={'已交付'}>已交付</Radio>
                        <Radio value={'未交付'}>未交付</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="区域规划" {...formConfig}>
                    {getFieldDecorator('regionalPlanning', {
                      rules: [{ required: true, message: '请选择区域规划' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.regionalPlanning != null
                          ? modifyInfoData.regionalPlanning.split('/')
                          : null,
                    })(
                      <Checkbox.Group>
                        {regionalPlanningList.map(item => {
                          return (
                            <Checkbox value={item.title} key={item.title}>
                              {item.title}
                            </Checkbox>
                          );
                        })}
                      </Checkbox.Group>
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem
                    label="周边停车状况"
                    {...formConfig}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('parkingAround', {
                      rules: [{ required: true, message: '请选择周边停车状况' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.parkingAround != null
                          ? modifyInfoData.parkingAround
                          : null,
                    })(
                      <RadioGroup allowClear>
                        {parkingAroundList.map((item, index) => (
                          <Radio key={index} value={item.value}>
                            {item.title}
                          </Radio>
                        ))}
                        {/* <Radio value={'紧张'}>较紧张</Radio>
                        <Radio value={'一般'}>一般</Radio> */}
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem
                    required
                    label="周边车位价格"
                    style={{ marginBottom: 0 }}
                    {...formConfig}
                  >
                    <Row>
                      <Col span={11}>
                        <FormItem>
                          {getFieldDecorator('peripherySectionMin', {
                            rules: [
                              {
                                validator: (rule, val, cb) => {
                                  const sectionMax = this.props.form.getFieldValue(
                                    'peripherySectionMax'
                                  );
                                  if (val == null || val == '') {
                                    cb('请填写最小报价');
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.peripherySectionMin != null
                                ? modifyInfoData.peripherySectionMin
                                : null,
                          })(<Input addonAfter={'元'} maxLength={10} />)}
                        </FormItem>
                      </Col>
                      <Col span={2} style={{ textAlign: 'center' }}>
                        ~
                      </Col>
                      <Col span={11}>
                        <FormItem>
                          {getFieldDecorator('peripherySectionMax', {
                            rules: [
                              {
                                validator: (rule, val, cb) => {
                                  const sectionMin = this.props.form.getFieldValue(
                                    'peripherySectionMin'
                                  );
                                  if (val == null || val == '') {
                                    cb('请填写最大报价');
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.peripherySectionMax != null
                                ? modifyInfoData.peripherySectionMax
                                : null,
                          })(<Input addonAfter={'元'} maxLength={10} />)}
                        </FormItem>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="物业费" {...formConfig}>
                    {getFieldDecorator('ropertyFee', {
                      initialValue:
                        modifyInfoData && modifyInfoData.ropertyFee != null
                          ? modifyInfoData.ropertyFee
                          : null,
                    })(<Input placeholder="请输入物业费" addonAfter={'元/m²'} maxLength={10} />)}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="装修情况" {...formConfig}>
                    {getFieldDecorator('decoration', {
                      initialValue:
                        modifyInfoData && modifyInfoData.decoration != null
                          ? modifyInfoData.decoration
                          : '',
                    })(
                      <RadioGroup allowClear>
                        <Radio value={'毛坯'}>毛坯</Radio>
                        <Radio value={'精装'}>精装</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                {/*<Col xxl={8} md={12} >*/}
                {/*  <FormItem label="分润比例" required {...formConfig}>*/}
                {/*    {getFieldDecorator('share', {*/}
                {/*      rules: [*/}
                {/*        {*/}
                {/*          validator: (rule, val, cb) => {*/}
                {/*            if (val === null || val === '') {*/}
                {/*              cb('请输入分润比例');*/}
                {/*            } else if (val < 0 || val > 20 || !val.toString().match(posRemain2)) {*/}
                {/*              cb('请输入正确的分润比例');*/}
                {/*            } else cb();*/}
                {/*          },*/}
                {/*        },*/}
                {/*      ],*/}
                {/*      initialValue:*/}
                {/*        modifyInfoData && modifyInfoData.share != null*/}
                {/*          ? modifyInfoData.share*/}
                {/*          : null,*/}
                {/*    })(<Input disabled={disabled} addonAfter={'%'} placeholder={'请输入分润比例'} />)}*/}
                {/*  </FormItem>*/}
                {/*</Col>*/}
                <Divider orientation="left">
                  首购专享配置
                  {this.state.isFirstDiscount}
                </Divider>
                <Col xxl={8} md={12}>
                  <FormItem label="首购专享" {...formConfig}>
                    {getFieldDecorator('firstPurchaseFlag', {
                      rules: [{ required: true, message: '请选择首购专享！' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.firstPurchaseFlag != null
                          ? modifyInfoData.firstPurchaseFlag
                          : null,
                    })(
                      <RadioGroup allowClear onChange={this.OnFirstDiscount}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                {this.state.isFirstDiscount && (
                  <Col xxl={8} md={12}>
                    <FormItem label="首单限购" {...formConfig}>
                      {getFieldDecorator('firstOrderQuota', {
                        rules: [
                          // { required: true, message: '' },
                          {
                            required: true,
                            validator: (rule, val, cb) => {
                              if (!val) {
                                cb('请输入首单限购！');
                              }
                              if (val == 0) {
                                cb('首单限购不能为0！');
                              }
                              if (val.toString() && !val.toString().match(/^[1-9]\d*$/)) {
                                cb('请输入首单限购（正整数）！');
                              }
                              cb();
                            },
                          },
                        ],
                        initialValue:
                          modifyInfoData &&
                          modifyInfoData.firstOrderQuota != null &&
                          modifyInfoData.firstOrderQuota != 0
                            ? modifyInfoData.firstOrderQuota
                            : null,
                      })(<Input maxLength={2} addonAfter={'个'} placeholder={'请输入首单限购'} />)}
                    </FormItem>
                  </Col>
                )}
                <Divider orientation="left">租售配置</Divider>
                <Col xxl={8} md={12}>
                  <FormItem label="开启租售" {...formConfig}>
                    {getFieldDecorator('rentSale', {
                      rules: [{ required: true, message: '请选择是否开启租售！' }],
                      initialValue: modifyInfoData?.rentSale
                    })(
                      <RadioGroup allowClear>
                        <Radio value={0}>是</Radio>
                        <Radio value={1}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Divider orientation="left">委托出租配置</Divider>
                <Col xxl={8} md={12}>
                  <FormItem label="物业公司" {...formConfig}>
                    {getFieldDecorator('businessId', {
                      rules: [{ required: true, message: '请选择物业公司' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.businessId != null
                          ? modifyInfoData.businessId
                          : null,
                    })(
                      <Select
                        disabled={!!modifyInfoData.id}
                        placeholder="请选择物业公司"
                        allowClear
                      >
                        {businessAccountList.map(item => {
                          return (
                            <Option value={item.id} key={item.id}>
                              {item.userName}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="一年租金比例" required {...formConfig}>
                    {getFieldDecorator('rentRate', {
                      rules: [
                        {
                          validator: (rule, val, cb) => {
                            if (!val) {
                              cb('请输入一年租金比例');
                            } else if (!val || val > 100 || !val.toString().match(posRemain2)) {
                              cb('请输入正确的一年租金比例，一年租金比例不能大于100%');
                            } else {
                              cb();
                            }
                          },
                        },
                      ],
                      initialValue:
                        modifyInfoData && modifyInfoData.rentRate != null
                          ? modifyInfoData.rentRate
                          : null,
                    })(
                      <Input
                        disabled={disabled}
                        addonAfter={'%'}
                        placeholder={'请输入一年租金比例'}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="退货违约金比例" required {...formConfig}>
                    {getFieldDecorator('buybackServiceFee', {
                      // rules: [
                      //   {
                      //     validator: (rule, val, cb) => {
                      //       if (val > 20 || !val.toString().match(posRemain2)) {
                      //         cb('请输入正确的退货违约金比例，退货违约金比例不能大于20%');
                      //       } else cb();
                      //     },
                      //   },
                      // ],
                      initialValue:
                        modifyInfoData && modifyInfoData.buybackServiceFee != null
                          ? modifyInfoData.buybackServiceFee
                          : null,
                    })(
                      <Input
                        disabled
                        addonAfter={'%'}
                        placeholder={'请输入退货违约金比例'}
                        maxLength={10}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="代租版" {...formConfig}>
                    {getFieldDecorator('rentStatus', {
                      rules: [{ required: true, message: '请选择是否开启代租版！' }],
                      initialValue: modifyInfoData?.rentStatus,
                    })(
                      <RadioGroup allowClear>
                        <Radio value={1}>启用</Radio>
                        <Radio value={0}>关闭</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Divider orientation="left">委托出售配置</Divider>
                <Col span={24}>
                  <FormItem
                    required
                    label="车位价格+履约保证金+代买服务费"
                    style={{ marginBottom: 0 }}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Row>
                      <Col span={6}>
                        <FormItem>
                          {getFieldDecorator('standardRate', {
                            rules: [
                              {
                                validator: this.validateFunc,
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.standardRate != null
                                ? modifyInfoData.standardRate
                                : null,
                          })(
                            <Input
                              addonAfter={'%'}
                              type="number"
                              maxLength={10}
                              disabled={!!modifyInfoData.id}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={2} style={{ textAlign: 'center' }}>
                        +
                      </Col>
                      <Col span={6}>
                        <FormItem>
                          {getFieldDecorator('bondRate', {
                            rules: [
                              {
                                validator: this.validateFunc,
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.bondRate != null
                                ? modifyInfoData.bondRate
                                : null,
                          })(
                            <Input
                              addonAfter={'%'}
                              type="number"
                              maxLength={10}
                              disabled={!!modifyInfoData.id}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={2} style={{ textAlign: 'center' }}>
                        +
                      </Col>
                      <Col span={6}>
                        <FormItem>
                          {getFieldDecorator('serviceRate', {
                            rules: [
                              {
                                validator: this.validateFunc,
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.serviceRate != null
                                ? modifyInfoData.serviceRate
                                : null,
                          })(
                            <Input
                              addonAfter={'%'}
                              type="number"
                              maxLength={10}
                              disabled={!!modifyInfoData.id}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={2} style={{ textAlign: 'center' }}>
                        =100%
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="车位出售价格占比" required {...formConfig}>
                    {getFieldDecorator('sellRate', {
                      rules: [
                        {
                          validator: (rule, val, cb) => {
                            let standardRate = this.props.form.getFieldValue('standardRate');
                            if (standardRate == null || standardRate == '') {
                              standardRate = 0;
                            } else {
                              standardRate = parseFloat(standardRate);
                            }
                            val = parseFloat(val);
                            if (val == null || val == '') {
                              cb('请输入车位出售价格占比');
                            } else if (!/(^[1-9]\d*$)/.test(val)) {
                              cb('比例只能为正整数');
                            } else if (val < standardRate) {
                              cb('车位出售价格占比不能小于车位价格比例');
                            } else if (val > 150) {
                              cb('车位出售价格占比不能大于150%');
                            } else {
                              cb();
                            }
                          },
                        },
                      ],
                      initialValue:
                        modifyInfoData && modifyInfoData.sellRate != null
                          ? modifyInfoData.sellRate
                          : null,
                    })(
                      <Input
                        addonAfter={'%'}
                        type="number"
                        placeholder={'请输入车位出售价格占比'}
                        maxLength={10}
                        disabled={!!modifyInfoData.id}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem
                    required
                    label="到期未售违约金比例"
                    style={{ marginBottom: 0 }}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 19 }}
                  >
                    <Row>
                      <Col span={2} style={{ textAlign: 'center' }}>
                        3个月:
                      </Col>
                      <Col span={6}>
                        <FormItem>
                          {getFieldDecorator('interestRateThree', {
                            rules: [
                              {
                                validator: (rule, val, cb) => {
                                  if (val == null || val == '' || val == 0) {
                                    cb('到期未售违约金不能都为0');
                                  } else if (val > 30 || !val.toString().match(posRemain2)) {
                                    cb(
                                      '请输入正确的到期未售违约金比例，到期未售违约金比例不能大于30%'
                                    );
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.interestRateThree != null
                                ? modifyInfoData.interestRateThree
                                : null,
                          })(
                            <Input
                              disabled={disabled}
                              addonAfter={'%'}
                              placeholder={'请输入到期未售违约金比例'}
                              maxLength={10}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={2} style={{ textAlign: 'center' }}>
                        6个月:
                      </Col>
                      <Col span={6}>
                        <FormItem>
                          {getFieldDecorator('interestRateSix', {
                            rules: [
                              {
                                validator: (rule, val, cb) => {
                                  if (val == null || val == '' || val == 0) {
                                    cb('到期未售违约金不能都为0');
                                  } else if (val > 30 || !val.toString().match(posRemain2)) {
                                    cb(
                                      '请输入正确的到期未售违约金比例，到期未售违约金比例不能大于30%'
                                    );
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.interestRateSix != null
                                ? modifyInfoData.interestRateSix
                                : null,
                          })(
                            <Input
                              disabled={disabled}
                              addonAfter={'%'}
                              placeholder={'请输入到期未售违约金比例'}
                              maxLength={10}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={2} style={{ textAlign: 'center' }}>
                        12个月:
                      </Col>
                      <Col span={6}>
                        <FormItem>
                          {getFieldDecorator('interestRate', {
                            rules: [
                              {
                                validator: (rule, val, cb) => {
                                  if (val == null || val == '' || val == 0) {
                                    cb('到期未售违约金不能都为0');
                                  } else if (val > 30 || !val.toString().match(posRemain2)) {
                                    cb(
                                      '请输入正确的到期未售违约金比例，到期未售违约金比例不能大于30%'
                                    );
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.interestRate != null
                                ? modifyInfoData.interestRate
                                : null,
                          })(
                            <Input
                              disabled={disabled}
                              addonAfter={'%'}
                              placeholder={'请输入到期未售违约金比例'}
                              maxLength={10}
                            />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col xxl={8} md={12}>
                  <FormItem label="提前退货违约金比例" required {...formConfig}>
                    {getFieldDecorator('breachRate', {
                      rules: [
                        {
                          validator: (rule, val, cb) => {
                            if (val > 20 || !val.toString().match(posRemain2)) {
                              cb('请输入正确的提前退货违约金比例，提前退货违约金比例不能大于20%');
                            } else {
                              cb();
                            }
                          },
                        },
                      ],
                      initialValue:
                        modifyInfoData && modifyInfoData.breachRate != null
                          ? modifyInfoData.breachRate
                          : null,
                    })(
                      <Input
                        disabled={disabled}
                        addonAfter={'%'}
                        placeholder={'请输入提前退货违约金比例'}
                        maxLength={10}
                      />
                    )}
                  </FormItem>
                </Col>
                <Divider orientation="left">自用配置</Divider>
                <Col span={24}>
                  <FormItem
                    label="开启自用"
                    labelCol={{ xxl: 2, md: 4 }}
                    wrapperCol={{ xxl: 22, md: 20 }}
                  >
                    {getFieldDecorator('selfUse', {
                      rules: [{ required: true, message: '请选择开启自用' }],
                      initialValue:
                        modifyInfoData &&
                        modifyInfoData.selfUse !== null &&
                        modifyInfoData.selfUse !== '' &&
                        typeof modifyInfoData.selfUse !== 'undefined'
                          ? modifyInfoData.selfUse
                          : '',
                    })(
                      <RadioGroup allowClear onChange={this.OnRadioGroup}>
                        <Radio value={0}>是</Radio>
                        <Radio value={1}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                {this.props.form.getFieldValue('selfUse') !== 1 ? (
                  <>
                    <Col span={24}>
                      <FormItem
                        required
                        disabled={this.props.form.getFieldValue('selfUse') !== 1}
                        label="回购时间"
                        labelCol={{ xxl: 2, md: 4 }}
                        wrapperCol={{ xxl: 22, md: 20 }}
                      >
                        <Row>
                          <Col span={4}>
                            <FormItem>
                              {getFieldDecorator('selfBuybackPeriodStart', {
                                rules: [
                                  {
                                    validator: (rule, val, cb) => {
                                      if (val == null || val == '') {
                                        cb('请输入回购时间');
                                      } else if (!/(^[1-9]\d*$)/.test(val)) {
                                        cb('请输入正确回购时间');
                                      } else {
                                        cb();
                                      }
                                    },
                                  },
                                ],
                                initialValue:
                                  modifyInfoData && modifyInfoData.selfBuybackPeriodStart != null
                                    ? modifyInfoData.selfBuybackPeriodStart
                                    : null,
                              })(
                                <Input
                                  placeholder={'请输入回购时间'}
                                  addonAfter={'年'}
                                  maxLength={5}
                                />
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      </FormItem>
                    </Col>

                    <Col span={24}>
                      <FormItem
                        required
                        disabled={this.props.form.getFieldValue('selfUse') !== 1}
                        label="回购截止时间"
                        labelCol={{ xxl: 2, md: 4 }}
                        wrapperCol={{ xxl: 22, md: 20 }}
                      >
                        <Row>
                          <Col span={4}>
                            <FormItem>
                              {getFieldDecorator('selfBuybackPeriodDuration', {
                                rules: [
                                  {
                                    validator: (rule, val, cb) => {
                                      if (val == null || val == '') {
                                        cb('请输入回购截止时间');
                                      } else if (!/(^[1-9]\d*$)/.test(val)) {
                                        cb('请输入正确回购截止时间');
                                      } else {
                                        cb();
                                      }
                                    },
                                  },
                                ],
                                initialValue:
                                  modifyInfoData && modifyInfoData.selfBuybackPeriodDuration != null
                                    ? modifyInfoData.selfBuybackPeriodDuration
                                    : null,
                              })(
                                <Input
                                  placeholder={'请输入回购截止时间'}
                                  addonAfter={'月'}
                                  maxLength={5}
                                />
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      </FormItem>
                    </Col>

                    {/* <FormItem label="麦穗折扣" required {...formConfig}>
                    {getFieldDecorator('discountRate', {
                      rules: [
                        {
                          validator: (rule, val, cb) => {
                            const standardRate = this.props.form.getFieldValue('standardRate');
                            if (val == null || val == '') {
                              cb(' 请输入麦穗折扣');
                            } else if (!/(^[1-9]\d*$)/.test(val)) {
                              cb('折扣只能为正整数');
                            } else if (val >= 100) {
                              cb('折扣必须小于100%');
                            } else if (val <= standardRate) {
                              cb('折扣不得低于车位价格比例');
                            } else { cb(); }
                          },
                        },
                      ],
                      initialValue:
                        modifyInfoData && modifyInfoData.discountRate != null
                          ? modifyInfoData.discountRate
                          : null,
                    })(
                      <Input
                        disabled={this.state.discRateDisabled}
                        addonAfter={'%'}
                        placeholder={'请输入麦穗折扣'}
                        maxLength={10}
                      />
                    )}
                  </FormItem> */}

                    <Col span={24}>
                      <FormItem
                        required
                        label="转让服务费"
                        required
                        labelCol={{ xxl: 2, md: 4 }}
                        wrapperCol={{ xxl: 22, md: 20 }}
                      >
                        <Row>
                          <Col span={4}>
                            {getFieldDecorator('selfServiceFeeRate', {
                              rules: [
                                {
                                  validator: (rule, val, cb) => {
                                    let reg = /^[0-9]{0,2}(\.?[0-9]{1,2})?$/;

                                    if (val == null || val == '') {
                                      cb('请输入转让服务费');
                                    } else if (val > 100) {
                                      cb('请输入正确转让服务费');
                                    } else if (!val.toString().match(reg)) {
                                      cb('请输入正确转让服务费');
                                    } else {
                                      cb();
                                    }
                                  },
                                },
                              ],
                              initialValue:
                                modifyInfoData && modifyInfoData.selfServiceFeeRate != null
                                  ? modifyInfoData.selfServiceFeeRate
                                  : null,
                            })(
                              <Input
                                addonAfter={'%'}
                                placeholder={'请输入转让服务费'}
                                maxLength={5}
                              />
                            )}
                          </Col>
                        </Row>
                      </FormItem>
                    </Col>
                  </>
                ) : null}
                <Col span={24}>
                  <FormItem
                    label="楼盘图片"
                    labelCol={{ xxl: 2, md: 4 }}
                    wrapperCol={{ xxl: 22, md: 20 }}
                  >
                    {getFieldDecorator('pictureAr', {
                      rules: [{ required: true, message: '请上传楼盘图片' }],
                      initialValue:
                        modifyInfoData && modifyInfoData.pictureAr ? modifyInfoData.pictureAr : [],
                    })(
                      <Upload
                        uploadConfig={{
                          action: `${_baseApi}/building/upload`,
                          fileType: ['image'],
                          size: 3,
                          maxFileList: 14,
                        }}
                        defaultUrl={
                          modifyInfoData && modifyInfoData.pictureAr ? modifyInfoData.pictureAr : []
                        }
                        multiplePicture={true}
                        setIconUrl={(url, type) => {
                          const pictureAr = this.props.form.getFieldValue('pictureAr');
                          if (type !== 'remove') {
                            // 照片添加的逻辑
                            if (!pictureAr || !pictureAr[0]) {
                              this.props.form.setFieldsValue({ pictureAr: [url] });
                            } else {
                              this.props.form.setFieldsValue({
                                pictureAr: pictureAr.concat([url]),
                              });
                            }
                          } else {
                            // 照片删除的逻辑
                            const resArr = [];
                            pictureAr.forEach(item => {
                              if (item !== url) {
                                resArr.push(item);
                              }
                            });
                            this.props.form.setFieldsValue({ pictureAr: resArr });
                          }
                        }}
                      >
                        {this.state.fileList.length &&
                        this.state.fileList[0].response &&
                        this.state.fileList[0].response.status == '99' ? (
                          <span style={{ color: 'red', marginLeft: '5px' }}>
                            {this.state.fileList[0].response.statusDesc}
                          </span>
                        ) : null}
                      </Upload>
                    )}
                  </FormItem>
                </Col>
                <Divider orientation="left">车位信息</Divider>
                <Row type="flex" justify="end">
                  <Button
                    onClick={() => {
                      if (!this.checkIsHundred()) {
                        message.error('车位价格比例 + 履约保证金比例 + 代买服务费比例必须为 100%');
                        return false;
                      }
                      this.props.form.validateFields(async (err, values) => {
                        if (!err) {
                          this.modifyChild.setState({
                            infoData: { ...values, rentSale: null },
                            idx: null,
                          });
                          this.modifyChild.changeVisible(true);
                        }
                      });
                    }}
                    style={{ marginRight: 20 }}
                  >
                    新增
                  </Button>
                  <Button
                    onClick={() => this.refs.fileIpt.dispatchEvent(new MouseEvent('click'))}
                    type="primary"
                    style={{ marginRight: 20 }}
                  >
                    批量导入
                  </Button>
                  <Button onClick={() => this.downTemplate()}>下载模板</Button>
                </Row>
                <Table
                  rowKey={'key'}
                  scroll={{ x: 1600 }}
                  onChange={pagination => this.setState({ current: pagination.current })}
                  columns={columns}
                  bordered
                  dataSource={this.state.tableList}
                  pagination={{ showQuickJumper: true }}
                />
                <Row>
                  <Col style={{ marginTop: 50 }} span={24}>
                    <FormItem
                      label="车位平面图"
                      labelCol={{ xxl: 2, md: 4 }}
                      wrapperCol={{ xxl: 22, md: 20 }}
                    >
                      {getFieldDecorator('parkingPictureAr', {
                        initialValue:
                          modifyInfoData && modifyInfoData.parkingPictureAr
                            ? modifyInfoData.parkingPictureAr
                            : [],
                      })(
                        <Upload
                          // disabled={disabled}
                          uploadConfig={{
                            action: `${_baseApi}/building/upload`,
                            fileType: ['image'],
                            size: 15,
                            maxFileList: 14,
                          }}
                          defaultUrl={
                            modifyInfoData && modifyInfoData.parkingPictureAr
                              ? modifyInfoData.parkingPictureAr
                              : []
                          }
                          multiplePicture={true}
                          setIconUrl={(url, type) => {
                            const parkingPictureAr = this.props.form.getFieldValue(
                              'parkingPictureAr'
                            );
                            if (type !== 'remove') {
                              // 照片添加的逻辑
                              if (!parkingPictureAr || !parkingPictureAr[0]) {
                                this.props.form.setFieldsValue({ parkingPictureAr: [url] });
                              } else {
                                this.props.form.setFieldsValue({
                                  parkingPictureAr: parkingPictureAr.concat([url]),
                                });
                              }
                            } else {
                              // 照片删除的逻辑
                              const resArr = [];
                              parkingPictureAr.forEach(item => {
                                if (item !== url) {
                                  resArr.push(item);
                                }
                              });
                              this.props.form.setFieldsValue({ parkingPictureAr: resArr });
                            }
                          }}
                        >
                          {this.state.fileList.length &&
                          this.state.fileList[0].response &&
                          this.state.fileList[0].response.status == '99' ? (
                            <span style={{ color: 'red', marginLeft: '5px' }}>
                              {this.state.fileList[0].response.statusDesc}
                            </span>
                          ) : null}
                        </Upload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem
                      label="是否开启分析报告"
                      labelCol={{ xxl: 2, md: 4 }}
                      wrapperCol={{ xxl: 22, md: 20 }}
                    >
                      {getFieldDecorator('isAnalyse', {
                        initialValue:
                          modifyInfoData && modifyInfoData.isAnalyse != null
                            ? modifyInfoData.isAnalyse
                            : 0,
                      })(
                        <RadioGroup allowClear onChange={this.onChangeAnalysis}>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                {this.state.isShow && (
                  <div>
                    <Row>
                      <Col span={24}>
                        <FormItem
                          labelCol={{ xxl: 2, md: 4 }}
                          wrapperCol={{ xxl: 22, md: 20 }}
                          label={'分析报告'}
                        >
                          {getFieldDecorator('analyseUrl', {
                            rules: [
                              {
                                required: true,
                                message: '分析报告',
                              },
                            ],
                            initialValue: modifyInfoData && modifyInfoData.analyseUrl,
                          })(
                            <Upload
                              defaultUrl={modifyInfoData && modifyInfoData.analyseUrl}
                              uploadConfig={{
                                action: `${_baseApi}/building/uploadAnalysePDF`,
                                fileType: ['PDF'],
                                size: 3,
                              }}
                              setIconUrl={url =>
                                this.props.form.setFieldsValue({ analyseUrl: url })
                              }
                            />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <FormItem
                          labelCol={{ xxl: 2, md: 4 }}
                          wrapperCol={{ xxl: 22, md: 20 }}
                          label={'交通情况'}
                        >
                          {getFieldDecorator('trafficGrade', {
                            rules: [
                              {
                                required: true,
                                message: '请输入交通情况',
                              },
                              {
                                validator: (rule, val, cb) => {
                                  if (!/^[1-9]\d*$/.test(val)) {
                                    cb('请输入正整数');
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.trafficGrade != null
                                ? modifyInfoData.trafficGrade
                                : null,
                          })(
                            <InputNumber
                              min={0}
                              max={10}
                              onChange={e => this.comprehensiveScore(e, 'trafficGrade')}
                            />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <FormItem
                          labelCol={{ xxl: 2, md: 4 }}
                          wrapperCol={{ xxl: 22, md: 20 }}
                          label={'教育配套'}
                        >
                          {getFieldDecorator('educationGrade', {
                            rules: [
                              {
                                required: true,
                                message: '请输入教育配套',
                              },
                              {
                                validator: (rule, val, cb) => {
                                  if (!/^[1-9]\d*$/.test(val)) {
                                    cb('请输入正整数');
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.educationGrade != null
                                ? modifyInfoData.educationGrade
                                : null,
                          })(
                            <InputNumber
                              min={0}
                              max={10}
                              onChange={e => this.comprehensiveScore(e, 'educationGrade')}
                            />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <FormItem
                          labelCol={{ xxl: 2, md: 4 }}
                          wrapperCol={{ xxl: 22, md: 20 }}
                          label={'生活配套'}
                        >
                          {getFieldDecorator('liveGrade', {
                            rules: [
                              {
                                required: true,
                                message: '请输入生活配套',
                              },
                              {
                                validator: (rule, val, cb) => {
                                  if (!/^[1-9]\d*$/.test(val)) {
                                    cb('请输入正整数');
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.liveGrade != null
                                ? modifyInfoData.liveGrade
                                : null,
                          })(
                            <InputNumber
                              min={0}
                              max={10}
                              onChange={e => this.comprehensiveScore(e, 'liveGrade')}
                            />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <FormItem
                          labelCol={{ xxl: 2, md: 4 }}
                          wrapperCol={{ xxl: 22, md: 20 }}
                          label={'小区规划'}
                        >
                          {getFieldDecorator('planGrade', {
                            rules: [
                              {
                                required: true,
                                message: '请输入小区规划',
                              },
                              {
                                validator: (rule, val, cb) => {
                                  if (!/^[1-9]\d*$/.test(val)) {
                                    cb('请输入正整数');
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.planGrade != null
                                ? modifyInfoData.planGrade
                                : null,
                          })(
                            <InputNumber
                              min={0}
                              max={10}
                              onChange={e => this.comprehensiveScore(e, 'planGrade')}
                            />
                          )}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <FormItem
                          labelCol={{ xxl: 2, md: 4 }}
                          wrapperCol={{ xxl: 22, md: 20 }}
                          label={'车位评分'}
                        >
                          {getFieldDecorator('parkingGrade', {
                            rules: [
                              {
                                required: true,
                                message: '请输入车位评分',
                              },
                              {
                                validator: (rule, val, cb) => {
                                  if (!/^[1-9]\d*$/.test(val)) {
                                    cb('请输入正整数');
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.parkingGrade != null
                                ? modifyInfoData.parkingGrade
                                : null,
                          })(
                            <InputNumber
                              min={0}
                              max={10}
                              onChange={e => this.comprehensiveScore(e, 'parkingGrade')}
                            />
                          )}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <FormItem
                          labelCol={{ xxl: 2, md: 4 }}
                          wrapperCol={{ xxl: 22, md: 20 }}
                          label={'综合评分'}
                        >
                          {getFieldDecorator('avgGrade', {
                            initialValue:
                              modifyInfoData && modifyInfoData.avgGrade != null
                                ? modifyInfoData.avgGrade
                                : null,
                          })(<InputNumber disabled={true} />)}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <FormItem
                          labelCol={{ xxl: 2, md: 4 }}
                          wrapperCol={{ xxl: 22, md: 20 }}
                          label={'超过'}
                        >
                          {getFieldDecorator('surpassRatio', {
                            rules: [
                              {
                                required: true,
                                message: '请输入车位评分',
                              },
                              {
                                validator: (rule, val, cb) => {
                                  if (!/^[1-9]\d*$/.test(val)) {
                                    cb('请输入正整数');
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.surpassRatio != null
                                ? modifyInfoData.surpassRatio
                                : null,
                          })(<InputNumber min={0} max={100} />)}
                          &nbsp;%的小区车位
                        </FormItem>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <FormItem
                          labelCol={{ xxl: 2, md: 4 }}
                          wrapperCol={{ xxl: 8, md: 20 }}
                          label={'车位分析摘要'}
                        >
                          {getFieldDecorator('analyseContent', {
                            rules: [
                              {
                                required: true,
                                message: '请输入车位评分',
                              },
                            ],
                            initialValue:
                              modifyInfoData && modifyInfoData.analyseContent != null
                                ? modifyInfoData.analyseContent
                                : null,
                          })(<TextArea />)}
                        </FormItem>
                      </Col>
                    </Row>
                  </div>
                )}

                <Row>
                  <Col span={24}>
                    <FormItem
                      labelCol={{ xxl: 2, md: 4 }}
                      wrapperCol={{ xxl: 22, md: 20 }}
                      label={'楼盘详情'}
                    >
                      {getFieldDecorator('remarkAr', {
                        initialValue:
                          modifyInfoData && modifyInfoData.remarkAr != null
                            ? modifyInfoData.remarkAr
                            : [],
                      })(
                        <Upload
                          // disabled={disabled}
                          uploadConfig={{
                            action: `${_baseApi}/building/upload`,
                            fileType: ['image'],
                            size: 3,
                          }}
                          defaultUrl={
                            modifyInfoData && modifyInfoData.remarkAr ? modifyInfoData.remarkAr : []
                          }
                          multiplePicture={true}
                          setIconUrl={(url, type) => {
                            const remarkAr = this.props.form.getFieldValue('remarkAr');
                            if (type !== 'remove') {
                              // 照片添加的逻辑
                              if (!remarkAr || !remarkAr[0]) {
                                this.props.form.setFieldsValue({ remarkAr: [url] });
                              } else {
                                this.props.form.setFieldsValue({
                                  remarkAr: remarkAr.concat([url]),
                                });
                              }
                            } else {
                              // 照片删除的逻辑
                              const resArr = [];
                              remarkAr.forEach(item => {
                                if (item !== url) {
                                  resArr.push(item);
                                }
                              });
                              this.props.form.setFieldsValue({ remarkAr: resArr });
                            }
                          }}
                        >
                          {this.state.fileList.length &&
                          this.state.fileList[0].response &&
                          this.state.fileList[0].response.status == '99' ? (
                            <span style={{ color: 'red', marginLeft: '5px' }}>
                              {this.state.fileList[0].response.statusDesc}
                            </span>
                          ) : null}
                        </Upload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem
                      labelCol={{ xxl: 2, md: 4 }}
                      wrapperCol={{ xxl: 2, md: 4 }}
                      label={'APP视频'}
                    >
                      {getFieldDecorator('videoUrlAr', {
                        initialValue:
                          modifyInfoData && modifyInfoData.videoUrlAr != null
                            ? modifyInfoData.videoUrlAr
                            : [],
                      })(
                        <Upload
                          // disabled={disabled}
                          uploadConfig={{
                            action: `${_baseApi}/building/uploadVideo`,
                            fileType: ['video/*'],
                            size: 50,
                          }}
                          defaultUrl={
                            modifyInfoData && modifyInfoData.videoUrlAr
                              ? modifyInfoData.videoUrlAr
                              : []
                          }
                          multiplePicture={false}
                          setIconUrl={(url, type) => {
                            const videoUrlAr = this.props.form.getFieldValue('videoUrlAr');
                            if (url) {
                              this.props.form.setFieldsValue({
                                videoUrlAr: videoUrlAr.concat([url]),
                              });
                            } else {
                              this.props.form.setFieldsValue({ videoUrlAr: [] });
                            }
                          }}
                        >
                          {this.state.fileList.length &&
                          this.state.fileList[0].response &&
                          this.state.fileList[0].response.status == '99' ? (
                            <span style={{ color: 'red', marginLeft: '5px' }}>
                              {this.state.fileList[0].response.statusDesc}
                            </span>
                          ) : null}
                        </Upload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem
                      labelCol={{ xxl: 2, md: 4 }}
                      wrapperCol={{ xxl: 22, md: 20 }}
                      label={'视频封面'}
                    >
                      {getFieldDecorator('videoPictureAr', {
                        initialValue:
                          modifyInfoData && modifyInfoData.videoPictureAr != null
                            ? modifyInfoData.videoPictureAr
                            : [],
                      })(
                        <Upload
                          // disabled={disabled}
                          uploadConfig={{
                            action: `${_baseApi}/building/uploadVideo`,
                            fileType: ['image'],
                            size: 3,
                          }}
                          defaultUrl={
                            modifyInfoData && modifyInfoData.videoPictureAr
                              ? modifyInfoData.videoPictureAr
                              : []
                          }
                          multiplePicture={false}
                          setIconUrl={(url, type) => {
                            const videoPictureAr = this.props.form.getFieldValue('videoPictureAr');
                            if (url) {
                              this.props.form.setFieldsValue({
                                videoPictureAr: videoPictureAr.concat([url]),
                              });
                            } else {
                              this.props.form.setFieldsValue({ videoPictureAr: [] });
                            }
                          }}
                        >
                          {this.state.fileList.length &&
                          this.state.fileList[0].response &&
                          this.state.fileList[0].response.status == '99' ? (
                            <span style={{ color: 'red', marginLeft: '5px' }}>
                              {this.state.fileList[0].response.statusDesc}
                            </span>
                          ) : null}
                        </Upload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem
                      labelCol={{ xxl: 2, md: 4 }}
                      wrapperCol={{ xxl: 22, md: 20 }}
                      label={'状态'}
                    >
                      {getFieldDecorator('openStatus', {
                        rules: [{ required: true, message: '请选择状态' }],
                        initialValue:
                          modifyInfoData && modifyInfoData.openStatus != null
                            ? modifyInfoData.openStatus
                            : null,
                      })(
                        <RadioGroup>
                          <Radio value={0}>开启</Radio>
                          <Radio value={1}>关闭</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" justify="center">
                  <Button
                    onClick={this.submitHandler}
                    loading={this.props.submitLoading ? true : false}
                    type="primary"
                  >
                    提交
                  </Button>
                </Row>
                <ModifyForm
                  getChildData={child => (this.modifyChild = child)}
                  setDataList={dataSource => this.setState({ tableList: dataSource })}
                  dataSource={this.state.tableList}
                  natureList={natureList}
                  type={id === 'new' ? 'add' : 'edit'}
                />
              </PageHeaderWrapper>
            </Spin>
          </Form>
        )}
      </>
    );
  }
}
