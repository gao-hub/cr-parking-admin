import React, { Component } from 'react';
import { Modal, Form, Input, Select, Radio, message, InputNumber, Row, Col } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ unifiedLotteryActivitySetPrize, loading }) => ({
  unifiedLotteryActivitySetPrize,
  loading:
    loading.effects['unifiedLotteryActivitySetPrize/addPrizeSetting'] ||
    loading.effects['unifiedLotteryActivitySetPrize/editPrizeSetting'] ||
    loading.effects['unifiedLotteryActivitySetPrize/getPrizeInfo'],
}))
export default class ModifyForm extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    data: {},
    numberOfPrizesFlag: 1,
  };

  componentDidMount() {
    this.props.getChild(this);
  }

  setVisible = () => {
    let { visible } = this.state;
    let { actionType, actionId } = this.props;
    if (visible) {
      this.props.form.resetFields();
      this.setState({
        data: {},
      });
    } else {
      actionType === 'edit' && this.getPrizeSetting({ id: actionId });
    }
    this.setState({
      visible: !visible,
    });
  };

  // 获取奖品设置
  getPrizeSetting = async payload => {
    let res = await this.props.dispatch({
      type: 'unifiedLotteryActivitySetPrize/getInfo',
      payload,
    });
    if (res && res.status === 1) {
      this.setState({
        data: res.data,
        numberOfPrizesFlag: res.data.numLimit,
      });
    } else message.error(res.statusDesc);
  };

  handleOk = () => {
    let { actionType, actionId, activityId } = this.props;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        values.activityId = activityId;
        if (actionType === 'add') {
          res = await this.props.dispatch({
            type: 'unifiedLotteryActivitySetPrize/addPrize',
            payload: values,
          });
        } else {
          res = await this.props.dispatch({
            type: 'unifiedLotteryActivitySetPrize/editPrize',
            payload: {
              ...values,
              id: actionId,
            },
          });
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setVisible();
          this.props.getList();
        } else message.error(res.statusDesc);
      }
    });
  };

  onNumberOfPrizesFlagChange = e => {
    const { form } = this.props;
    form.setFieldsValue({
      numLimit: e.target.value,
    });
    this.setState({
      numberOfPrizesFlag: e.target.value,
    });
  };

  render() {
    const {
      form,
      actionType,
      unifiedLotteryActivitySetPrize: { businessSelect },
    } = this.props;
    const { data, visible } = this.state;
    const { getFieldDecorator } = form;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };

    console.log(data);

    return (
      <>
        <Modal
          title={actionType === 'add' ? '添加奖品设置' : '修改奖品设置'}
          bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
          visible={visible}
          destroyOnClose={true}
          onOk={this.handleOk}
          maskClosable={false}
          onCancel={this.setVisible}
        >
          <Form>
            <FormItem label="标题" {...formConfig}>
              {getFieldDecorator('prizeName', {
                rules: [{ required: true, message: '请填写标题' }],
                initialValue: data && data.prizeName,
              })(<Input maxLength={6} placeholder="请输入标题" />)}
            </FormItem>
            <FormItem label="奖品金额" {...formConfig}>
              <Row>
                <Col span={7}>
                  {getFieldDecorator('rewardAmount', {
                    rules: [
                      { required: true, message: '请输入奖品金额' },
                      {
                        validator: (rule, val, cb) => {
                          if (
                            val &&
                            (!val.toString().match(/^[0-9]{1,9}(\.[0-9]{1,2})?$/) ||
                              val.toString() === '0')
                          ) {
                            cb('请输入有效的奖品金额');
                          } else {
                            cb();
                          }
                        },
                      },
                    ],
                    initialValue: data && data.rewardAmount,
                  })(<Input placeholder="请输入" maxLength={8} />)}
                </Col>
                <Col span={2}>元</Col>
              </Row>
            </FormItem>
            <FormItem label="发放主体" {...formConfig}>
              {getFieldDecorator('businessAccountId', {
                rules: [{ required: true, message: '请选择发放主体' }],
                initialValue: data && data.businessAccountId,
              })(
                <Select>
                  {businessSelect.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.title}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="奖品数量" {...formConfig}>
              {getFieldDecorator('numLimit', {
                rules: [
                  {
                    required: true,
                    message: '请选择奖品数量',
                  },
                ],
                initialValue: data && data.numLimit,
              })(
                <Radio.Group onChange={this.onNumberOfPrizesFlagChange}>
                  <Radio value={1}>限制</Radio>
                  <Radio value={0}>不限</Radio>
                </Radio.Group>
              )}
            </FormItem>
            {this.state.numberOfPrizesFlag === 1 && (
              <FormItem label="请输入" {...formConfig}>
                {getFieldDecorator('totalNum', {
                  rules: [
                    {
                      required: true,
                      message: '请输入奖品数量',
                    },
                    {
                      validator: (rule, val, cb) => {
                        if (
                          val &&
                          (!val.toString().match(/^[0-9]{1,8}$/) || val.toString() === '0')
                        ) {
                          cb('请输入有效的奖品数量(正整数)');
                        } else {
                          cb();
                        }
                      },
                    },
                  ],
                  initialValue: data && data.totalNum,
                })(<Input placeholder="请输入" maxLength={8} />)}
              </FormItem>
            )}
            <FormItem label="中奖限制" {...formConfig}>
              <Row>
                <Col span={15}>每个开奖周期内每人最多可中此奖</Col>
                <Col span={5}>
                  {getFieldDecorator('winningLimitNum', {
                    initialValue: data && data.winningLimitNum,
                    rules: [
                      {
                        validator: (rule, val, cb) => {
                          if (
                            val &&
                            (!val.toString().match(/^[0-9]{1,8}$/) || val.toString() === '0')
                          ) {
                            cb('请输入有效的次数(正整数)');
                          } else {
                            cb();
                          }
                        },
                      },
                    ],
                  })(<Input placeholder="请输入" maxLength={8} />)}
                </Col>
                <Col span={4}>次</Col>
              </Row>
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}
