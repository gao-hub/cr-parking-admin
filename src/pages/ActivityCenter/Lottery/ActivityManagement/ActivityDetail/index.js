import React, { Component } from 'react';
import {
  Form,
  Input,
  Select,
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
} from 'antd';
import { connect } from 'dva';
import permission from '@/utils/PermissionWrapper';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import BraftEditor from '@/components/BraftEditor';
import { routerRedux } from 'dva/router';
import src from './images/activity.png';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
import { _baseApi } from '@/defaultSettings.js';
import { posRemain2 } from '@/utils/utils';

@permission
@connect(({ activityManagement, loading }) => ({
  activityManagement,
  submitLoading:
    loading.effects['activityManagement/addManage'] ||
    loading.effects['activityManagement/modifyManage'] ||
    loading.effects['activityManagement/getModifyInfo'],
}))
@Form.create()
export default class ActivityDetail extends Component {
  state = {};

  async componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;

    //请求活动模板列表接口
    // this.props.dispatch({
    //   type: 'activityManagement/activityTemList',
    //   payload: {
    //     currPage: 1,
    //     pageSize: 999999,
    //   },
    // });
    if (id !== 'new') {
      // 如果有id 则请求详情数据并进行赋值
      const res = await this.props.dispatch({
        type: 'activityManagement/getModifyInfo',
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
      type: 'activityManagement/setModifyInfo',
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
    const { modifyInfoData } = this.props.activityManagement;
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
        if (modifyInfoData.isStart) {
          delete formData['startTime'];
          delete formData['endTime'];
        }
        if (modifyInfoData.id) {
          res = await this.props.dispatch({
            type: 'activityManagement/modifyManage',
            payload: {
              ...formData,
              id: modifyInfoData.id,
            },
          });
        } else {
          res = await this.props.dispatch({
            type: 'activityManagement/addManage',
            payload: {
              ...formData,
            },
          });
        }
        if (res.status === 1) {
          message.success('操作成功');
          this.props.dispatch(
            routerRedux.push({
              pathname: '/activity/lottery/activityManagement',
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
        pathname: '/activity/lottery/activityManagement',
      })
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      match: {
        params: { id },
      },
      activityManagement: { modifyInfoData },
    } = this.props;
    const formConfig = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <>
        <>
          <Form>
            <Spin spinning={this.props.submitLoading ? true : false}>
              <PageHeaderWrapper>
                <PageHeader title={id != 'new' ? '修改活动' : '新建活动'} />
                <Row>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <img src={src} style={{ width: '100%' }} />
                  </Col>
                  <Col span={18}>
                    <Divider orientation="left">基础信息</Divider>

                    <FormItem label="活动名称" {...formConfig} required>
                      {getFieldDecorator('activityName', {
                        rules: [
                          {
                            validator: (rule, val, cb) => {
                              if (val == '' || val == null) {
                                cb('请输入活动名称');
                              } else cb();
                            },
                          },
                        ],
                        initialValue:
                          modifyInfoData && modifyInfoData.activityName != null
                            ? modifyInfoData.activityName
                            : null,
                      })(<Input maxLength={10} placeholder={'请输入活动名称'} />)}
                    </FormItem>
                    <FormItem label="活动模板" {...formConfig}>
                      {getFieldDecorator('templateId', {
                        rules: [{ required: true, message: '请选择活动模板' }],
                        initialValue: '1',
                      })(
                        <Select placeholder="请选择活动模板" allowClear disabled>
                          <Option value="1" key="1">
                            活动模板1
                          </Option>
                        </Select>
                      )}
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
                            <Col span={10}>
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
                                    disabled={modifyInfoData.isStart || false}
                                    disabledDate={current => {
                                      return (
                                        current &&
                                        current < moment(new Date().getTime() - 24 * 60 * 60 * 1000)
                                      );
                                    }}
                                  />
                                )}
                              </FormItem>
                            </Col>
                            <Col span={4} style={{ textAlign: 'center' }}>
                              <FormItem>
                                <span>至</span>
                              </FormItem>
                            </Col>
                            <Col span={10}>
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
                                    disabled={modifyInfoData.isStart || false}
                                    disabledDate={current => {
                                      return (
                                        current &&
                                        current < moment(new Date().getTime() - 24 * 60 * 60 * 1000)
                                      );
                                    }}
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
                    <FormItem label="活动规则" {...formConfig}>
                      {getFieldDecorator('activityRule', {
                        rules: [{ required: true, message: '请输入活动规则' }],
                        initialValue: modifyInfoData && modifyInfoData.activityRule,
                      })(
                        <BraftEditor
                          handleChange={this.handleChange}
                          uploadImgUrl={`${_baseApi}/news/upload`}
                          content={modifyInfoData.activityRule}
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
                        initialValue:
                          modifyInfoData && modifyInfoData.isShow != null
                            ? modifyInfoData.isShow
                            : null,
                      })(
                        <RadioGroup allowClear>
                          <Radio value={1}>显示</Radio>
                          <Radio value={0}>隐藏</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                    {/*{*/}
                    {/*  id !== 'new' ?*/}
                    {/*    <FormItem label="活动状态" {...formConfig}>*/}
                    {/*      {getFieldDecorator('isUse', {*/}
                    {/*        rules: [{ required: true, message: '请选择是否人车分流' }],*/}
                    {/*        initialValue:*/}
                    {/*          modifyInfoData && modifyInfoData.isUse != null*/}
                    {/*            ? modifyInfoData.isUse*/}
                    {/*            : 1,*/}
                    {/*      })(*/}
                    {/*        <RadioGroup*/}
                    {/*          allowClear*/}
                    {/*        >*/}
                    {/*          <Radio value={1}>启用</Radio>*/}
                    {/*          <Radio value={0}>禁用</Radio>*/}
                    {/*        </RadioGroup>,*/}
                    {/*      )}*/}
                    {/*    </FormItem>*/}
                    {/*    : null}*/}
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
                        默认只有购买委托出售车位参与活动（包含续约），委托出租、自用不参与。
                      </span>
                    </Divider>
                    <FormItem required label="获得抽奖机会" {...formConfig}>
                      <Row>
                        <Col span={2} style={{ textAlign: 'center' }}>
                          投资
                        </Col>
                        <Col span={12}>
                          <FormItem>
                            {getFieldDecorator('activityAmountW', {
                              rules: [
                                {
                                  validator: (rule, val, cb) => {
                                    if (val == null || val == '' || val == 0) {
                                      cb('请输入投资金额');
                                    }
                                    if (
                                      val &&
                                      !val.toString().match(/^[0-9]{1,9}(\.[0-9]{1,4})?$/)
                                    ) {
                                      cb('请输入有效的投资金额');
                                    } else {
                                      cb();
                                    }
                                  },
                                },
                              ],
                              initialValue:
                                modifyInfoData && modifyInfoData.activityAmountW != null
                                  ? modifyInfoData.activityAmountW
                                  : null,
                            })(
                              <Input
                                addonAfter={'万元'}
                                placeholder={'请输入投资金额'}
                                maxLength={10}
                                disabled={modifyInfoData.isStart || false}
                              />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6} style={{ textAlign: 'center' }}>
                          获得1次抽奖机会
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{ color: 'gray' }}>活动期内投资，且兑换抽奖机会时不累计</Col>
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
      </>
    );
  }
}
