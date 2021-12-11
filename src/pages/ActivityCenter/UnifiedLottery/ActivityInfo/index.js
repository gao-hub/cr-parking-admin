import React, { Component } from 'react';
import {
  Form,
  Input,
  Radio,
  DatePicker,
  message,
  Spin,
  PageHeader,
  Divider,
  Col,
  Cascader,
  Row,
  Button,
  Table,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import permission from '@/utils/PermissionWrapper';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import BraftEditor from '@/components/BraftEditor';
import { routerRedux } from 'dva/router';
import { _baseApi } from '@/defaultSettings.js';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const rules = {
  activityName: [{ required: true, message: '请输入活动名称' }],
};
const { RangePicker } = DatePicker;

@permission
@connect(({ unifiedLotteryActivityInfo, loading }) => ({
  unifiedLotteryActivityInfo,
  submitLoading:
    loading.effects['unifiedLotteryActivityInfo/getExchangeInfo'] ||
    loading.effects['unifiedLotteryActivityInfo/addExchange'] ||
    loading.effects['unifiedLotteryActivityInfo/editExchange'],
}))
@Form.create()
export default class ExchangeInfo extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    data: {},
    isEdit: false,
    prizeTimeFlag: 1, //0=>指定时间
    isDouble: 0,
    isGive: 0,
  };

  async componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (id !== 'add') {
      // 如果有id 则请求详情数据并进行赋值
      const res = await this.props.dispatch({
        type: 'unifiedLotteryActivityInfo/getExchangeInfo',
        payload: {
          id,
        },
      });
      if (res && res.status === 1) {
        let { ...data } = res.data;

        this.setState({
          data: {
            ...data,
          },
          isEdit: true,
          isDouble: data.isDouble,
          isGive: data.isGive,
          prizeTimeFlag: data.openType,
        });
      } else message.error(res.statusDesc);
    }
  }

  componentWillUnmount() {
    this.setState({
      data: {},
      isEdit: false,
    });
  }

  handleChange = value => {
    const { form } = this.props;
    form.setFieldsValue({
      activityRule: value === '<p></p>' ? '' : value,
    });
  };

  changeIsDouble = e => {
    const { form } = this.props;
    form.setFieldsValue({
      isDouble: e.target.value,
    });
    this.setState({
      isDouble: e.target.value,
    });
  };

  changeIsGive = e => {
    const { form } = this.props;
    form.setFieldsValue({
      isGive: e.target.value,
    });
    this.setState({
      isGive: e.target.value,
    });
  };

  /**
   * @desc 提交
   */
  submitHandler = () => {
    const { data } = this.state;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let res;
        let formData = { ...values };
        if (values.startTime) {
          formData.startTime = moment(values.startTime[0]).format(dateFormat);
          formData.endTime = moment(values.startTime[1]).format(dateFormat);
        }
        if (values.openDate) {
          formData.openDate = moment(values.openDate).format('YYYY-MM-DD');
        }
        if (
          values.openDate &&
          moment(values.openDate).valueOf() <
            moment(values.startTime[1])
              .endOf('day')
              .valueOf()
        ) {
          message.error('开奖时间不能小于活动结束时间');
          return;
        }
        if (data.id) {
          res = await this.props.dispatch({
            type: 'unifiedLotteryActivityInfo/editExchange',
            payload: {
              ...formData,
              id: data.id,
            },
          });
        } else {
          res = await this.props.dispatch({
            type: 'unifiedLotteryActivityInfo/addExchange',
            payload: formData,
          });
        }
        if (res.status === 1) {
          message.success('操作成功');
          this.props.dispatch(
            routerRedux.push({
              pathname: '/activity/unifiedLottery/activityManagement',
            })
          );
        } else {
          message.error(res.statusDesc);
        }
      }
    });
  };

  /**
   * 返回
   * */
  backHandler = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/activity/unifiedLottery/activityManagement',
      })
    );
  };

  onPrizeTimeFlagChange = e => {
    const { form } = this.props;
    form.setFieldsValue({
      openType: e.target.value,
    });
    this.setState({
      prizeTimeFlag: e.target.value,
    });
  };

  getDisabledDate = currentDate => {
    return (
      currentDate &&
      currentDate.valueOf() <
        moment()
          .add(-1, 'days')
          .endOf('day')
          .valueOf()
    );
  };

  getDisabledDate1 = currentDate => {
    const { form } = this.props;
    const endTime = form.getFieldValue('startTime')[1];
    return currentDate && currentDate.valueOf() < moment(endTime).endOf('day');
  };

  range = function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  getDisabledTime = (currentTime, type) => {
    const { range } = this;
    if (currentTime && currentTime.length === 2) {
      if (
        type === 'start' &&
        currentTime[0].hour() !== moment().hour() &&
        currentTime[0].format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
      ) {
        return {
          disabledHours: () => range(0, moment().hour()),
        };
      }
      if (
        type === 'start' &&
        currentTime[0].hour() === moment().hour() &&
        currentTime[0].format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
      ) {
        return {
          disabledHours: () => range(0, moment().hour()),
          disabledMinutes: () => range(0, moment().minute()),
          disabledSeconds: () => range(0, moment().second()),
        };
      }
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      form,
      match: {
        params: { id },
      },
    } = this.props;
    const { data, isEdit } = this.state;
    const formConfig = {
      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
    };

    return (
      <>
        <Form>
          <Spin spinning={this.props.submitLoading ? true : false}>
            <PageHeaderWrapper>
              <PageHeader title={isEdit ? '修改活动' : '新建活动'} />
              <Divider orientation="left">基础信息</Divider>

              <FormItem label="活动名称" {...formConfig} required>
                {getFieldDecorator('activityName', {
                  rules: [
                    { required: true, message: '请输入活动名称' },
                    {
                      validator: (rule, value, callback) => {
                        const regEn = /[`!@#$%^&*()_+<>?:"{},./;'[\]]/im;
                        const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
                        if (regEn.test(value) || regCn.test(value)) {
                          callback('不要输入特殊字符');
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                  initialValue: data && data.activityName,
                })(<Input maxLength={20} placeholder={'请输入活动名称'} />)}
              </FormItem>
              <FormItem label="背景色" {...formConfig}>
                {getFieldDecorator('bgColor', {
                  initialValue: data && data.bgColor,
                })(<Input maxLength={20} placeholder={'请输入背景色色值'} />)}
              </FormItem>
              <FormItem label="活动时间" {...formConfig} required>
                <Row>
                  {getFieldDecorator('startTime', {
                    rules: [
                      {
                        required: true,
                        message: '请填写活动时间',
                      },
                    ],
                    initialValue:
                      data && data.startTime && data.endTime
                        ? [moment(data.startTime, dateFormat), moment(data.endTime, dateFormat)]
                        : null,
                  })(
                    <RangePicker
                      disabled={!!data.isStart}
                      allowClear
                      disabledDate={currentDate => this.getDisabledDate(currentDate)}
                      disabledTime={(currentTime, type) => this.getDisabledTime(currentTime, type)}
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [moment(), moment()],
                      }}
                    />
                  )}
                </Row>
                <Row span={10} style={{ textAlign: 'left', marginLeft: 10, color: 'gray' }}>
                  活动开始后不可修改
                </Row>
              </FormItem>
              <FormItem label="开奖时间" {...formConfig}>
                {getFieldDecorator('openType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择开奖时间',
                    },
                  ],
                  initialValue: data && data.openType,
                })(
                  <Radio.Group onChange={this.onPrizeTimeFlagChange} disabled={!!data.isStart}>
                    <Radio value={1}>指定时间</Radio>
                    <Radio value={2}>周期开奖(默认选中周期的10:00开奖)</Radio>
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem label="请选择" {...formConfig}>
                {this.state.prizeTimeFlag === 1
                  ? getFieldDecorator('openDate', {
                      rules: [{ required: true, message: '开奖时间必填' }],
                      initialValue:
                        data && data.openDate ? moment(data.openDate, dateFormat) : null,
                    })(
                      <DatePicker
                        disabledDate={currentDate => this.getDisabledDate1(currentDate)}
                        disabled={
                          !(
                            form.getFieldValue('startTime') &&
                            form.getFieldValue('startTime').length > 0
                          ) || !!data.isStart
                        }
                      />
                    )
                  : getFieldDecorator('openWeekNum', {
                      rules: [{ required: true, message: '开奖时间必填' }],
                      initialValue: data && data.openWeekNum,
                    })(
                      <Radio.Group disabled={!!data.isStart}>
                        <Radio value={1}>周一</Radio>
                        <Radio value={2}>周二</Radio>
                        <Radio value={3}>周三</Radio>
                        <Radio value={4}>周四</Radio>
                        <Radio value={5}>周五</Radio>
                        <Radio value={6}>周六</Radio>
                        <Radio value={7}>周日</Radio>
                      </Radio.Group>
                    )}
              </FormItem>
              <FormItem label="活动规则" {...formConfig}>
                {getFieldDecorator('activityRule', {
                  rules: [{ required: true, message: '请输入活动规则' }],
                  initialValue: data && data.activityRule,
                })(
                  <BraftEditor
                    handleChange={this.handleChange}
                    uploadImgUrl={`${_baseApi}/news/upload`}
                    content={data.activityRule}
                    placeholder="请输入活动规则"
                    image={true}
                    video={true}
                    minHeight="500px"
                  />
                )}
              </FormItem>
              <FormItem label="中奖名单" {...formConfig}>
                {getFieldDecorator('isShow', {
                  rules: [{ required: true, message: '请选择中奖名单' }],
                  initialValue: data && data.isShow,
                })(
                  <RadioGroup allowClear>
                    <Radio value={1}>显示</Radio>
                    <Radio value={0}>隐藏</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <Divider orientation="left">
                抽奖机会设置
                <span
                  style={{
                    color: 'gray',
                    fontSize: '13px',
                    display: 'inline-block',
                    marginLeft: 10,
                    fontWeight: 400,
                  }}
                >
                  默认只有购买委托出售（包含续约）、标准版、保价版车位参与活动，委托出租不参与。
                </span>
              </Divider>
              <FormItem label="获得抽奖机会" {...formConfig}>
                <Row>
                  <Col span={2}>投资</Col>
                  <Col span={8}>
                    {getFieldDecorator('activityAmountW', {
                      rules: [
                        { required: true, message: '兑换比例必填' },
                        {
                          validator: (rule, val, cb) => {
                            if (
                              val &&
                              (!val.toString().match(/^[0-9]{1,9}(\.[0-9]{1,2})?$/) ||
                                val.toString() === '0')
                            ) {
                              cb('请输入有效的兑换比例');
                            } else {
                              cb();
                            }
                          },
                        },
                      ],
                      initialValue: data && data.activityAmountW,
                    })(<Input placeholder={'请输入'} disabled={!!data.isStart} maxLength={6} />)}
                  </Col>
                  <Col span={14}>万元获得1次抽奖机会</Col>
                </Row>
                <Row style={{ color: 'gray' }}>
                  活动期内购买金额折算后取整，且兑换抽奖机会时不累计。
                </Row>
              </FormItem>
              <FormItem label="标准/保价版" {...formConfig}>
                {getFieldDecorator('isDouble', {
                  rules: [
                    {
                      required: true,
                      message: '请选择是否翻倍',
                    },
                  ],
                  initialValue: data && data.isDouble,
                })(
                  <RadioGroup disabled={!!data.isStart} onChange={this.changeIsDouble}>
                    <Radio value={1}>翻倍</Radio>
                    <Radio value={0}>不翻倍</Radio>
                  </RadioGroup>
                )}
                {this.state.isDouble === 1 && (
                  <FormItem>
                    {getFieldDecorator('doubleNum', {
                      rules: [
                        {
                          required: true,
                          message: '请输入倍数',
                        },
                        {
                          validator: (rule, val, cb) => {
                            if (
                              val &&
                              (!val.toString().match(/^[0-9]{1,9}(\.[0-9]{1,4})?$/) ||
                                val.toString() === '0')
                            ) {
                              cb('请输入有效的倍数');
                            } else {
                              cb();
                            }
                          },
                        },
                      ],
                      initialValue: data && data.doubleNum,
                    })(
                      <Input disabled={!!data.isStart} addonAfter="倍" placeholder="请输入倍数" />
                    )}
                    <Row>
                      <Col span={24} style={{ color: 'gray' }}>
                        购买标准版、保价版车位金额按照倍数翻倍后，再折算出抽奖码数量。
                      </Col>
                    </Row>
                  </FormItem>
                )}
              </FormItem>
              <FormItem label="新用户赠送" {...formConfig}>
                {getFieldDecorator('isGive', {
                  rules: [
                    {
                      required: true,
                      message: '请选择是否赠送新用户额度',
                    },
                  ],
                  initialValue: data && data.isGive,
                })(
                  <RadioGroup disabled={!!data.isStart} onChange={this.changeIsGive}>
                    <Radio value={1}>赠送</Radio>
                    <Radio value={0}>不赠送</Radio>
                  </RadioGroup>
                )}
                {this.state.isGive === 1 && (
                  <FormItem>
                    {getFieldDecorator('giveNum', {
                      rules: [
                        {
                          required: true,
                          message: '请输入抽奖次数',
                        },
                        {
                          validator: (rule, val, cb) => {
                            if (
                              val &&
                              (!val.toString().match(/^[0-9]{1,8}$/) || val.toString() === '0')
                            ) {
                              cb('请输入有效的抽奖次数(正整数)');
                            } else {
                              cb();
                            }
                          },
                        },
                      ],
                      initialValue: data && data.giveNum,
                    })(
                      <Input
                        disabled={!!data.isStart}
                        addonAfter="次"
                        placeholder="请输入赠送抽奖次数"
                      />
                    )}
                    <Row>
                      <Col span={24} style={{ color: 'gray' }}>
                        新用户首投（委托出售、标准版、保价版）发生在活动期间，即可赠送对应抽奖次数。默认赠送机会只能中成本最低的奖。
                      </Col>
                    </Row>
                  </FormItem>
                )}
              </FormItem>

              <Row type="flex" justify="center">
                <Button
                  onClick={this.backHandler}
                  style={{ marginRight: 20 }}
                  loading={this.props.submitLoading ? true : false}
                >
                  取消
                </Button>
                <Button
                  onClick={this.submitHandler}
                  loading={this.props.submitLoading ? true : false}
                  type="primary"
                >
                  提交
                </Button>
              </Row>
            </PageHeaderWrapper>
          </Spin>
        </Form>
        {/*档位添加弹窗*/}
      </>
    );
  }
}
