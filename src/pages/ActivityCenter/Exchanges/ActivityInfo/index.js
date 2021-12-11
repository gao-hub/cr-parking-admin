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
} from 'antd';
import { connect } from 'dva';
import permission from '@/utils/PermissionWrapper';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import BraftEditor from '@/components/BraftEditor';
import { routerRedux } from 'dva/router';
import { _baseApi } from '@/defaultSettings.js';
import moment from 'moment';
import ModifyForm from './ModifyForm';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const rules = {
  activityName: [{ required: true, message: '请输入活动名称' }],
};

@permission
@connect(({ activityExchangeInfo, loading }) => ({
  activityExchangeInfo,
  submitLoading:
    loading.effects['activityExchangeInfo/getExchangeInfo'] ||
    loading.effects['activityExchangeInfo/addExchange'] ||
    loading.effects['activityExchangeInfo/editExchange'],
}))
@Form.create()
export default class ExchangeInfo extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    data: {
      activityGradeList: [],
    },
    isEdit: false,
    grade: null, // 当前操作的档位信息
    gradeList: [], // 所有的档位信息
    gradeColumns: [
      {
        title: '序号',
        // dataIndex: 'number',
        render: (record, row, index) => {
          return index + 1;
        },
      },
      {
        title: '档位名称',
        dataIndex: 'gradeName',
      },
      {
        title: '档位额度门槛',
        dataIndex: 'gradeQuota',
      },
      {
        title: '操作',
        render: (record, row, index) => {
          let { data } = this.state;
          return (
            <>
              <Button
                type="link"
                disabled={data.isStart}
                onClick={() => {
                  this.editGrade(record);
                }}
              >
                修改
              </Button>
              <Button
                type="link"
                disabled={data.isStart}
                onClick={() => {
                  this.deleteGrade(index);
                }}
              >
                删除
              </Button>
            </>
          );
        },
      },
    ],
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
        type: 'activityExchangeInfo/getExchangeInfo',
        payload: {
          id,
        },
      });
      if (res && res.status === 1) {
        let { activityGradeList, ...data } = res.data;
        activityGradeList.forEach((item, index) => {
          item.key = `index_${index}`;
        });
        this.setState({
          data: {
            ...data,
            activityGradeList,
          },
          isEdit: true,
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

  changeQuotaFlg = e => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        extraQuotaFlag: e.target.value,
      },
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
          formData.startTime = moment(values.startTime).format(dateFormat);
        }
        if (values.endTime) {
          formData.endTime = moment(values.endTime).format(dateFormat);
        }
        if (values.exchangeEndTime) {
          formData.exchangeEndTime = moment(values.exchangeEndTime).format(dateFormat);
        }
        // 处理档位
        if (values.activityGradeList) {
          formData.activityGradeList = values.activityGradeList.map(item => {
            delete item.key;
            return item;
          });
        }
        // if (data.isStart) {
        // delete formData['startTime'];
        // delete formData['endTime'];
        // delete formData['exchangeEndTime'];
        // }
        if (data.id) {
          res = await this.props.dispatch({
            type: 'activityExchangeInfo/editExchange',
            payload: {
              ...formData,
              id: data.id,
            },
          });
        } else {
          res = await this.props.dispatch({
            type: 'activityExchangeInfo/addExchange',
            payload: formData,
          });
        }
        if (res.status === 1) {
          message.success('操作成功');
          this.props.dispatch(
            routerRedux.push({
              pathname: '/activity/exchange/activityManagement',
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
        pathname: '/activity/exchange/activityManagement',
      })
    );
  };

  // 档位新增或者修改时触发
  changeGrade = item => {
    // 判断是否重复
    let { grade, data } = this.state;
    let gradeList = data.activityGradeList;
    let valid = true,
      index = gradeList.length;
    gradeList.forEach((grade, gradeIndex) => {
      if (grade.key === item.key) index = gradeIndex;
      if (grade.key !== item.key && grade.gradeName === item.gradeName) valid = false;
    });
    if (!valid) {
      message.error('档位名称不可重复');
      return;
    }
    // 档位额度门槛是否大于最大值
    let max, min;
    if (grade) {
      min = index > 0 ? +gradeList[index - 1].gradeQuota : -1;
      max =
        index === gradeList.length - 1 ? +item.gradeQuota + 1 : +gradeList[index + 1].gradeQuota;
    } else {
      min = gradeList.length > 0 ? +gradeList[gradeList.length - 1].gradeQuota : -1;
      max = +item.gradeQuota + 1;
    }
    if (+min >= +item.gradeQuota) {
      message.error('档位额度值要大于前一挡位的值');
      return;
    }
    if (+max <= +item.gradeQuota) {
      message.error('档位额度值要小于下一挡位的值');
      return;
    }
    if (valid) {
      if (grade) {
        gradeList = gradeList.map(gradeItem => {
          if (gradeItem.key === item.key) {
            return item;
          }
          return gradeItem;
        });
      } else {
        gradeList.push(item);
      }
      this.setState({
        data: {
          ...data,
          activityGradeList: gradeList,
        },
        grade: null,
      });
      this.props.form.setFieldsValue({ activityGradeList: gradeList });
      this.formChild.setVisible();
    }
  };
  // 新增档位
  addGrade = () => {
    this.setState(
      {
        grade: null,
      },
      () => {
        this.formChild.setVisible();
      }
    );
  };
  // 修改档位
  editGrade = data => {
    if (this.state.data.isStart) return;
    this.setState(
      {
        grade: data,
      },
      () => {
        this.formChild.setVisible();
      }
    );
  };

  // 删除档位
  deleteGrade = index => {
    if (this.state.data.isStart) return;
    let { data } = this.state;
    let { activityGradeList } = data;
    activityGradeList.splice(index, 1);
    this.setState({
      data: {
        ...data,
        activityGradeList,
      },
    });
    this.props.form.setFieldsValue({ activityGradeList: activityGradeList });
  };

  render() {
    const {
      form: { getFieldDecorator },
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
                })(
                  <Input
                    disabled={data.isStart || false}
                    maxLength={20}
                    placeholder={'请输入背景色色值'}
                  />
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
                                  } else if (endTime && endTime - 0 > 0 && val - 0 > endTime - 0) {
                                    cb('开始时间小于结束时间');
                                  } else {
                                    cb();
                                  }
                                },
                              },
                            ],
                            initialValue:
                              data && data.startTime ? moment(data.startTime, dateFormat) : null,
                          })(
                            <DatePicker
                              showTime
                              disabled={data.isStart || false}
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
                                  const startTime = this.props.form.getFieldValue('startTime');
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
                              data && data.endTime ? moment(data.endTime, dateFormat) : null,
                          })(
                            <DatePicker
                              showTime
                              disabled={data.isStart || false}
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
              <FormItem label="活动兑换截止时间" {...formConfig}>
                {getFieldDecorator('exchangeEndTime', {
                  rules: [{ required: true, message: '活动兑换截止时间必填' }],
                  initialValue:
                    data && data.exchangeEndTime ? moment(data.exchangeEndTime, dateFormat) : null,
                })(
                  <DatePicker
                    showTime
                    disabled={data.isStart || false}
                    disabledDate={current => {
                      return (
                        current && current < moment(new Date().getTime() - 24 * 60 * 60 * 1000)
                      );
                    }}
                  />
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
                活动设置
                <span
                  style={{
                    color: 'gray',
                    fontSize: '13px',
                    display: 'inline-block',
                    marginLeft: 10,
                    fontWeight: 400,
                  }}
                >
                  默认购买委托出售、标准版、保价版车位参与活动，标准版和保价版金额翻倍，委托出租不参与活动。
                </span>
              </Divider>
              <FormItem label="兑换比例" {...formConfig}>
                {getFieldDecorator('exchangeRatio', {
                  rules: [
                    { required: true, message: '兑换比例必填' },
                    {
                      validator: (rule, val, cb) => {
                        if (val && !val.toString().match(/^[0-9]{1,9}(\.[0-9]{1,4})?$/)) {
                          cb('请输入有效的兑换比例');
                        } else {
                          cb();
                        }
                      },
                    },
                  ],
                  initialValue: data && data.exchangeRatio,
                })(
                  <Input
                    addonAfter={'元=1额度'}
                    placeholder={'请输入'}
                    maxLength={10}
                    disabled={data.isStart || false}
                  />
                )}
                <Row>
                  <Col style={{ color: 'gray' }}>兑换额度=投资金额/兑换比例</Col>
                </Row>
              </FormItem>
              <FormItem label="活动额度档位设置" {...formConfig}>
                <Row>
                  <Col style={{ color: 'gray' }}>
                    请按照档位金额由小到大设置每个档位门槛值，用户兑换值至少大于等于档位门槛时，可领取所达到的最高档的奖品。
                  </Col>
                </Row>
                <Row>
                  {getFieldDecorator('activityGradeList', {
                    rules: [
                      {
                        required: true,
                        message: '请添加活动档位',
                      },
                    ],
                    initialValue: data && data.activityGradeList,
                  })(
                    <Table
                      columns={this.state.gradeColumns}
                      dataSource={data.activityGradeList}
                      pagination={false}
                      rowKey={record => {
                        return record.key;
                      }}
                    />
                  )}
                </Row>
                {data.activityGradeList &&
                  data.activityGradeList.length < 10 &&
                  !data.isStart && (
                    <Row>
                      <Col>
                        <Button style={{ marginTop: 10 }} onClick={() => this.addGrade()}>
                          添加档位
                        </Button>
                      </Col>
                    </Row>
                  )}
              </FormItem>
              <FormItem label="新用户赠送额度" {...formConfig}>
                {getFieldDecorator('extraQuotaFlag', {
                  rules: [
                    {
                      required: true,
                      message: '请选择是否赠送新用户额度',
                    },
                  ],
                  initialValue: data && data.extraQuotaFlag,
                })(
                  <RadioGroup disabled={data.isStart || false} onChange={this.changeQuotaFlg}>
                    <Radio value={1}>赠送</Radio>
                    <Radio value={0}>不赠送</Radio>
                  </RadioGroup>
                )}
                {data.extraQuotaFlag === 1 && (
                  <FormItem>
                    {getFieldDecorator('extraQuota', {
                      rules: [
                        {
                          required: true,
                          message: '请输入额度值',
                        },
                        {
                          validator: (rule, val, cb) => {
                            if (val && !val.toString().match(/^[0-9]{1,9}(\.[0-9]{1,4})?$/)) {
                              cb('请输入有效的额度值');
                            } else {
                              cb();
                            }
                          },
                        },
                      ],
                      initialValue: data && data.extraQuota,
                    })(
                      <Input
                        disabled={data.isStart || false}
                        addonAfter="额度"
                        placeholder="请输入额度值"
                      />
                    )}
                    <Row>
                      <Col span={24} style={{ color: 'gray' }}>
                        新用户首投（委托出售、标准版、保价版）发生在活动期间，即可赠送对应额度奖励。
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
        <ModifyForm
          getChild={child => (this.formChild = child)}
          changeGrade={this.changeGrade}
          data={this.state.grade}
        />
      </>
    );
  }
}
