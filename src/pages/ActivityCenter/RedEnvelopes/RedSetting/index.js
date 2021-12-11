import React, { Component } from 'react';
import {
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
  TimePicker,
  message,
  Spin,
  PageHeader,
  Divider,
  Col,
  Cascader,
  Row,
  Button,
} from 'antd';
import { connect } from 'dva';
import permission from '@/utils/PermissionWrapper';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import BraftEditor from '@/components/BraftEditor';
import { routerRedux } from 'dva/router';

import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const timeFormat = 'HH:mm:ss'
import { _baseApi } from '@/defaultSettings.js';
import { posRemain2 } from '@/utils/utils';

@permission
@connect(({ redSetting, loading }) => ({
  redSetting,
  submitLoading:
    loading.effects['redSetting/addManage'] ||
    loading.effects['redSetting/modifyManage'] ||
    loading.effects['redSetting/getModifyInfo'],
}))
@Form.create()
export default class RedSetting extends Component {
  state = {};
    // 秒杀时间禁用当前之前的日期
    disabledDate = current => {
      return (
        current &&
        current <
          moment()
            .subtract(1, 'days')
            .endOf('day')
      );
    };
  
  // 禁用过去的时
  disabledRangeTime = date => {
    const hours = moment().hours();
    // 当日只能选择当前时间之后的时间点
    if (date && moment(date).date() === moment().date()) {
      return {
        disabledHours: () => this.range(0, 24).splice(0, hours),
      };
    }
    return {
      disabledHours: () => [],
    };
  }
  
  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
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
        type: 'redSetting/getModifyInfo',
        payload: {
          id,
        },
      });
      if (res.status !== 1) {
        message.error(res.statusDesc);
        return;
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'redSetting/setModifyInfo',
      payload: {},
    });
  }

  handleChange = value => {
    const { form } = this.props;
    form.setFieldsValue({
      activityRule: value === '<p></p>' ? '' : value,
    });
  };

  /**
   * @desc 提交
   */
  submitHandler = () => {
    const { modifyInfoData } = this.props.redSetting;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let res;
        let formData = { ...values };
        if (values.startTime) {
          formData.startTime = moment(values.startTime).format(dateFormat);
        }
        if (values.endTime) {
          formData.endTime = moment(values.endTime).format(dateFormat);
        }
        if(values.everydayGetTime){
          formData.everydayGetTime =  moment(values.everydayGetTime).format(timeFormat);
        }
        if (modifyInfoData.id) {
          res = await this.props.dispatch({
            type: 'redSetting/modifyManage',
            payload: {
              ...formData,
              id: modifyInfoData.id,
            },
          });
        } else {
          res = await this.props.dispatch({
            type: 'redSetting/addManage',
            payload: {
              ...formData,
            },
          });
        }
        if (res.status === 1) {
          message.success('操作成功');
          this.props.dispatch(
            routerRedux.push({
              pathname: '/activity/redEnvelopes/activityManagement',
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
        pathname: '/activity/redEnvelopes/activityManagement',
      })
    );
  };

  render() {
    const {
      permission,
      form: { getFieldDecorator },
      match: {
        params: { id },
      },
      redSetting: { modifyInfoData },
    } = this.props;
    
    const formConfig = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <>
      {
        ( 
          permission.includes('chuangrong:redenvelopes:add') || 
          permission.includes('chuangrong:redenvelopes:update')
        ) && 
          <>
          <Form>
            <Spin spinning={this.props.submitLoading ? true : false}>
              <PageHeaderWrapper>
                <PageHeader title={id != 'add' ? '修改活动' : '新建活动'} />
                <Row>
                  <Col span={18}>
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
                                callback('不可输入特殊字符');
                              } else {
                                callback();
                              }
                            },
                          }
                        ],
                        initialValue:
                          modifyInfoData && modifyInfoData.activityName != null
                            ? modifyInfoData.activityName
                            : null,
                      })(<Input maxLength={10} placeholder={'请输入活动名称'} />)}
                    </FormItem>
                   

                    <FormItem label="背景色" {...formConfig}>
                      {getFieldDecorator('bgColor', {
                        initialValue:
                          modifyInfoData && modifyInfoData.bgColor != null
                            ? modifyInfoData.bgColor
                            : null,
                      })(
                        <Input maxLength={20} placeholder={'请输入背景色色值'} />
                      )}
                    </FormItem>

                    <FormItem label="活动时间" {...formConfig} required>
                      <Row>
                        <Col span={18}>
                          <Row>
                            <Col span={8}>
                              <FormItem>
                                {getFieldDecorator('startTime', {
                                  rules: [
                                    {
                                      validator: (rule, val, cb) => {
                                        const endTime = this.props.form.getFieldValue('endTime');
                                        if (val == null || val == '') {
                                          cb('请选择活动开始时间');
                                        } else if (
                                          endTime &&
                                          endTime - 0 > 0 &&
                                          val - 0 > endTime - 0
                                        ) {
                                          cb('开始时间小于结束时间');
                                        } else {
                                          cb();
                                        }
                                      },
                                    },
                                  ],
                                  initialValue:
                                    modifyInfoData && modifyInfoData.startTime
                                      ? moment(modifyInfoData.startTime, dateFormat)
                                      : null,
                                })(
                                  <DatePicker
                                    showTime
                                    disabled={!!modifyInfoData.isStart }
                                    disabledTime={this.disabledRangeTime}
                                    disabledDate={this.disabledDate}
                                  />
                                )}
                              </FormItem>
                            </Col>
                            <Col span={3} style={{ textAlign: 'center' }}>
                              <FormItem>
                                <span>至</span>
                              </FormItem>
                            </Col>
                            <Col span={8}>
                              <FormItem>
                                {getFieldDecorator('endTime', {
                                  rules: [
                                    {
                                      validator: (rule, val, cb) => {
                                        const startTime = this.props.form.getFieldValue(
                                          'startTime'
                                        );
                                        if (val == null || val == '') {
                                          cb('请选择活动结束时间');
                                        } else if (
                                          startTime &&
                                          startTime - 0 > 0 &&
                                          val - 0 < startTime - 0
                                        ) {
                                          cb('结束时间应该大于开始时间');
                                        } else {
                                          cb();
                                        }
                                      },
                                    },
                                  ],
                                  initialValue:
                                    modifyInfoData && modifyInfoData.endTime
                                      ? moment(modifyInfoData.endTime, dateFormat)
                                      : null,
                                })(
                                  <DatePicker
                                    showTime
                                    disabled={!!modifyInfoData.isStart }
                                    disabledTime={this.disabledRangeTime}
                                    disabledDate={this.disabledDate}
                                  />
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={10} style={{ textAlign: 'left', marginLeft: 10, color: 'gray' }}>
                          活动开始后不可修改
                        </Col>
                      </Row>
                    </FormItem>
                    <FormItem label="每日开始领取时间" {...formConfig} required>
                      <Row>
                        <Col span={18}>
                          <Row>
                          
                          
                            <Col span={7}>
                              <FormItem>
                                {getFieldDecorator('everydayGetTime', {
                                  rules: [
                                    {
                                      validator: (rule, val, cb) => {
                                        const startTime = this.props.form.getFieldValue(
                                          'startTime'
                                        );
                                        if (val == null || val == '') {
                                          cb('请选择每日开始领取时间');
                                        }  else {
                                          cb();
                                        }
                                      },
                                    },
                                  ],
                                  initialValue:
                                    modifyInfoData && modifyInfoData.everydayGetTime
                                      ? moment(modifyInfoData.everydayGetTime, timeFormat)
                                      : null,
                                })(
                                  <TimePicker
                                    showTime
                                    disabled={!!modifyInfoData.isStart }
                                  />
                                )}
                              </FormItem>
                            </Col>
                            <Col span={4} style={{ textAlign: 'left', marginLeft: 10, color: 'gray' }}>
                              精确到时分秒
                            </Col>
                          </Row>
                        </Col>
                    
                      </Row>
                    </FormItem>
                    <FormItem label="活动规则" {...formConfig}>
                      {getFieldDecorator('activityRule', {
                        rules: [{ required: true, message: '请输入活动规则' }],
                        initialValue: modifyInfoData && modifyInfoData.activityRule,
                      })(
                        <BraftEditor
                          handleChange={this.handleChange}
                          uploadImgUrl={`${_baseApi}/activityRedPacket/upload`}
                          content={modifyInfoData.activityRule}
                          placeholder="请输入活动规则"
                          image={true}
                          video={true}
                          minHeight="500px"
                        />
                      )}
                    </FormItem>
                    <Divider orientation="left">
                      领取限制
                      <span
                        style={{
                          color: 'gray',
                          fontSize: '13px',
                          display: 'inline-block',
                          marginLeft: 10,
                          fontWeight: 400,
                        }}
                      >
                        默认活动期间每人只能领取一个红包
                      </span>
                    </Divider>
                    <FormItem required label="领取限制" {...formConfig}>
                      <Row>
                        <Col span={4} style={{ textAlign: 'center' }}>
                          每日最多可领红包
                        </Col>
                        <Col span={6}>
                          <FormItem>
                            {getFieldDecorator('everydayGetCountLimit', {
                              rules: [
                          
                                {
                                  validator: (rule, val, cb) => {
                                    if (val == null || val == '') {
                                      cb('请输入数量');
                                    }
                                    else if (
                                    
                                      !val.toString().match(/^\+?[1-9]\d*$/) || val.toString() === '0'
                                    ) {
                                      cb('请输入有效数量');
                                    } else {
                                      cb();
                                    }
                                  },
                                },
                              ],
                              initialValue:
                                modifyInfoData && modifyInfoData.everydayGetCountLimit != null
                                  ? modifyInfoData.everydayGetCountLimit
                                  : null,
                            })(
                              <Input
                                addonAfter={'个'}
                                placeholder={'请输入'}
                                maxLength={8}
                                disabled={!!modifyInfoData.isStart }
                              />
                            )}
                          </FormItem>
                        </Col>
                   
                      </Row>
                     
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
                  </Col>
                </Row>
              </PageHeaderWrapper>
            </Spin>
          </Form>
        </>
        
      }
        
      </>
    );
  }
}
