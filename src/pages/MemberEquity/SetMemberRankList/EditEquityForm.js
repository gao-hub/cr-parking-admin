import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button, Checkbox, Row, Col, Select, Radio } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

/*
  十大关联权益 -- checkboxGroup数据源配置   
  value:  权益对应的标识
  label：  权益展示文字
*/

const tenEquityOption = [
  {
    label: '生日礼遇',
    value: 1,
  },
  {
    label: '升级有礼',
    value: 2,
  },
  {
    label: '免费洗车',
    value: 3,
  },
  {
    label: '专属客服',
    value: 4,
  },
  {
    label: '丰巢会员',
    value: 5,
  },
  {
    label: '定制产品',
    value: 6,
  },
  {
    label: '免费电影',
    value: 7,
  },
  {
    label: '高铁出行',
    value: 8,
  },
  {
    label: '免费体检',
    value: 9,
  },
  {
    label: '私人定制游艇',
    value: 10,
  },
];

/*
  生日礼遇右侧子项 -- checkboxGroup数据源配置   
  value:  权益对应的标识
  label：  权益展示文字
*/
const childSrlyOption = [
  {
    label: '问候短信',
    value: 1,
  },
  {
    label: 'app礼遇',
    value: 2,
  },
];

@Form.create()
@connect(({ MemberRank, loading, user }) => ({
  user,
  MemberRank,
  submitLoading: loading.effects['MemberRank/modifyManage'],
}))
class EditEquity extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      loading: false,
      checkedValues: []
    };
  }

  componentDidMount() {

  }

  //  确认修改
  handleOk = () => {
    const {
      dispatch,
      form,
      onCancel,
      getList,
      currPage,
      pageSize,
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (values.location && values.location.length) {
          values.location = values.location.join(',');
        }
        if (values.b && values.b.length) {
          values.b = values.b.join(',');
        }
        const { MemberRank = {}, getList, currPage, pageSize } = this.props;
        this.setState({ loading: true });
        const res = await dispatch({
          type: 'MemberRank/modifyDeliverId',
          payload: {
            ...values,
            id: MemberRank.modifyInfoData.id,
          },
        });
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setState({ loading: false });
          getList(currPage, pageSize);
          onCancel();
        } else message.error(res.statusDesc);
      }
    });
  };

  handleCancel = () => {
    const {
      onCancel,
    } = this.props;
    onCancel();
  }

  // 复选框改变时触发
  onCheckedChange = (checkedValues) => {
    this.setState({ checkedValues })
  }

  render() {
    const {
      form = {},
      MemberRank: { modifyInfoData },
    } = this.props;
    const { getFieldDecorator } = form;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const contentConfig = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
    };
    const {
      visible = false,
      loading,
      checkedValues
    } = this.state;

    return (
      <Modal
        title="修改"
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={visible}
        maskClosable={false}
        destroyOnClose
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            确定
          </Button>,
        ]}
      >
        <Form>
          <FormItem label="等级名称" {...formConfig} name="djmc">
            {
              modifyInfoData && modifyInfoData.deliveryId
            }
          </FormItem>

          <FormItem label="所需成长值" {...formConfig}>
            {getFieldDecorator('buyerId', {
              rules: [
                { required: true, message: '请输入所需成长值' },
                {
                  validator: (rule, value, callback) => {
                    const regEn = /^[1-9]\d*$/;
                    if (!regEn.test(value)) {
                      callback('请输入有效的所需成长值（正整数）');
                    } else {
                      callback()
                    }
                  }
                }],
              initialValue: modifyInfoData && modifyInfoData.buyerId,
            })(<Input placeholder="请输入所需成长值" maxLength={10} />)}
          </FormItem>

          <Row span={24}>
            <Col span={12}>
              <FormItem label="关联权益" {...contentConfig} className={styles.qyLeftWrap}>
                {getFieldDecorator('location', {
                  rules: [{ required: true, message: '请选择关联权益' }],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                })(
                  <Checkbox.Group style={{ width: '100%', marginTop: '10px' }} onChange={this.onCheckedChange}>
                    <Row gutter={[24, 18]}>
                      {tenEquityOption.map(item => (
                        <Col span={24} style={{ whiteSpace: 'nowrap' }} key={item.value}>
                          <Checkbox key={item.value} value={item.value}>
                            {item.label}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              {/* 右列 - 生日礼遇的子项 */}
              <FormItem
                {...formConfig}
                style={{ marginBottom: '0', visibility: (checkedValues.includes(1)) ? "visible" : "hidden" }}
              >
                {getFieldDecorator('b', checkedValues.includes(1) ? {
                  rules: [{ required: true, message: '请选择生日礼遇' }],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                } : {
                  rules: [{ required: false, message: '请选择生日礼遇' }],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                })(
                  <Checkbox.Group style={{ width: '120%', marginBottom: '10px' }}>
                    {childSrlyOption.map(item => (
                      <Checkbox key={item.value} value={item.value}>
                        {item.label}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                )}
              </FormItem>
              {/* 右列 - 升级有礼的子项 */}
              <FormItem
                {...formConfig}
                style={{ marginBottom: '0', visibility: (checkedValues.includes(2)) ? "visible" : "hidden" }}
              >
                {getFieldDecorator('c', checkedValues.includes(2) ? {
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        if (!value) {
                          callback('请输入升级奖励积分')
                          return
                        }
                        const regEn = /^[1-9]\d*$/;
                        if (!regEn.test(value)) {
                          callback('请输入有效的升级奖励积分（正整数）');
                        } else {
                          callback();
                        }
                      }
                    }
                  ],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                } : {
                  rules: [{ required: false, message: '请输入升级奖励积分' }],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                })(
                  <Input size="small" maxLength={10} placeholder="请输入升级奖励积分" />
                )}
              </FormItem>
              {/* 右列 - 免费洗车的子项 */}
              <FormItem
                {...formConfig}
                style={{ marginBottom: '36px', visibility: (checkedValues.includes(3)) ? "visible" : "hidden" }}
              >
                {getFieldDecorator('d', checkedValues.includes(3) ? {
                  rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        callback('请输入每年领取数量')
                        return
                      }
                      const regEn = /^-?[1-9]\d*$/;
                      if (!regEn.test(value)) {
                        callback('请输入有效的免费洗车每年领取数量（整数）');
                      } else {
                        callback();
                      }
                    }
                  },
                  ],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                } : {
                  rules: [{ required: false, message: '请输入每年领取数量' }],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                })(
                  <Input size="small" maxLength={3} placeholder="请输入每年领取数量" />
                )}
              </FormItem>
              {/* 右列 - 丰巢会员的子项 */}
              <FormItem
                {...formConfig}
                style={{ marginBottom: '0px', visibility: (checkedValues.includes(5)) ? "visible" : "hidden" }}
              >
                {getFieldDecorator('e', checkedValues.includes(5) ? {
                  rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        callback('请输入每年领取数量')
                        return
                      }
                      const regEn = /^-?[1-9]\d*$/;
                      if (!regEn.test(value)) {
                        callback('请输入有效的丰巢会员每年领取数量（整数）');
                      } else {
                        callback()
                      }
                    }
                  },
                  ],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                } : {
                  rules: [{ required: false, message: '请输入每年领取数量' }],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                })(
                  <Input size="small" maxLength={3} placeholder="请输入每年领取数量" />
                )}
              </FormItem>
              {/* 右列 - 定制产品的子项 */}
              <FormItem
                {...formConfig}
                style={{ marginBottom: '0px', visibility: (checkedValues.includes(6)) ? "visible" : "hidden" }}
              >
                {getFieldDecorator('f', checkedValues.includes(6) ? {
                  rules: [{ required: true, message: '请选择实物奖品' }],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                } : {
                  rules: [{ required: false, message: '请选择实物奖品' }],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                })(
                  <Select
                    placeholder="请选择实物奖品"
                    size="small"
                  >
                    {modifyInfoData.f &&
                      modifyInfoData.f.map((item, index) => {
                        return (
                          <Option key={index} value={item.roleId}>
                            {item.roleName}
                          </Option>
                        );
                      })}
                  </Select>
                )}
              </FormItem>
              {/* 右列 - 免费电影的子项 */}
              <FormItem
                {...formConfig}
                style={{ marginBottom: '0px', visibility: (checkedValues.includes(7)) ? "visible" : "hidden" }}
              >
                {getFieldDecorator('g', checkedValues.includes(7) ? {
                  rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        callback('请输入每年领取数量')
                        return
                      }
                      const regEn = /^-?[1-9]\d*$/;
                      if (!regEn.test(value)) {
                        callback('请输入有效的免费电影每年领取数量（整数）');
                      } else {
                        callback()
                      }
                    }
                  }],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                } : {
                  rules: [{ required: false, message: '请输入每年领取数量' }],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                })(
                  <Input size="small" maxLength={3} placeholder="请输入每年领取数量" />
                )}
              </FormItem>
              {/* 右列 - 高铁出行的子项 */}
              <FormItem
                {...formConfig}
                style={{ marginBottom: '0px', visibility: (checkedValues.includes(8)) ? "visible" : "hidden" }}
              >
                {getFieldDecorator('h', checkedValues.includes(8) ? {
                  rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        callback('请输入每年领取数量')
                        return
                      }
                      const regEn = /^-?[1-9]\d*$/;
                      if (!regEn.test(value)) {
                        callback('请输入有效的高铁出行每年领取数量（整数）');
                      } else {
                        callback()
                      }
                    }
                  }],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                } : {
                  rules: [{ required: false, message: '请输入每年领取数量' }],
                  // initialValue: modifyInfoData && modifyInfoData.location,
                })(
                  <Input size="small" maxLength={3} placeholder="请输入每年领取数量" />
                )}
              </FormItem>
            </Col>
          </Row>

          <FormItem label="等级描述" {...formConfig} >
            {getFieldDecorator('q', {
              initialValue: modifyInfoData && modifyInfoData.buyerId,
            })(<Input placeholder="请输入等级描述" maxLength={200} />)}
          </FormItem>

          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('isShow', {
              rules: [{ required: true, message: '请选择状态' }],
              // initialValue: modifyInfoData && modifyInfoData.isShow
            })(
              <RadioGroup allowClear>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
              </RadioGroup>
            )}
          </FormItem>


        </Form>
      </Modal>
    );
  }
}

export default EditEquity;
