import React, { PureComponent, Fragment } from 'react';
import { Button, Icon, message, Radio, Row, Col, Form, Input, Divider } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { regNum } from '@/utils/utils'
import PermissionWrapper from '@/utils/PermissionWrapper';
import BraftEditor from '@/components/BraftEditor';
import { _baseApi } from '@/defaultSettings';

const RadioGroup = Radio.Group;

@connect(({ GrowupSetList, loading }) => ({
  GrowupSetList,
  exportLoading: loading.effects['GrowupSetList/exportExcel'],
}))
@Form.create()
@PermissionWrapper
class IndexComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      isShowBuyParking: false,
      isShowBuyTouristGoods: false,
      isShowBuyFurnitureGoods: false
    };
  }

  async componentDidMount() {
    this.getInfo();
  }

  async componentWillUnmount() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'GrowupSetList/setInfoData',
      payload: {}
    })
  }

  getInfo = () => {
    setTimeout(async () => {
      const { dispatch, permission } = this.props;
      if (permission.includes('chuangrong:integralConfig:info')) {
        await dispatch({
          type: 'GrowupSetList/getInfoData',
          payload: {}
        })
      } else {
        message.error('您无成长值设置查看权限');
        return;
      }
      const { GrowupSetList: { infoData } } = this.props;
      console.log(infoData ,'ggg');

      if (infoData.isSet === 0) {
        // 未设置
        this.setState({
          disabled: false
        })
      }
      
      if (infoData && infoData.buyParkingFlag === 1) {
        this.setState({
          isShowBuyParking: true
        })
      } else {
        this.setState({
          isShowBuyParking: false
        })
      }
      if (infoData && infoData.buyTouristGoodsFlag === 1) {
        this.setState({
          isShowBuyTouristGoods: true
        })
      } else {
        this.setState({
          isShowBuyTouristGoods: false
        })
      }
      if (infoData && infoData.buyFurnitureGoodsFlag === 1) {
        this.setState({
          isShowBuyFurnitureGoods: true
        })
      } else {
        this.setState({
          isShowBuyFurnitureGoods: false
        })
      }
    }, 500);
  }

  // 保存成长值设置 
  saveManage = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const res = await dispatch({
          type: 'GrowupSetList/saveManage',
          payload: {
            ...values
          }
        })
        if (res && res.status === 1) {
          this.setState({
            disabled: true,
          })
          message.success(res.statusDesc);
        } else {
          message.error(res.statusDesc);
        }
      }
    });
  }

  // 
  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:integralConfig:update') && this.state.disabled === true ? (
          <>
            <Button
              onClick={() =>
                this.setState({
                  disabled: false,
                })
              }
            >
              <Icon type="edit" />
              修改
            </Button>
            <Button style={{ marginBottom: 16 }} onClick={() => window.location.reload()}>
              <Icon type="reload" />
              刷新
            </Button>
          </>
        ) : null}
        {permission.includes('chuangrong:integralConfig:update') && this.state.disabled === false ? (
          <>
            <Button
              onClick={this.saveManage}
            >
              <Icon type="plus" />保存
            </Button>
            <Button
              style={{ marginBottom: 16 }}
              onClick={async () => {
                const { form } = this.props;
                form.resetFields();
                this.setState({
                  disabled: true
                })
                this.getInfo()
              }}
            ><Icon type="close" />取消
            </Button>
          </>
        ) : null}


      </Fragment>
    );
  };

  handleChange = (value) => {
    const { form } = this.props;
    form.setFieldsValue({
      integralRule: value,
    });
  }


  render() {
    const {
      permission,
      form,
      GrowupSetList: { infoData }
    } = this.props;
    const {
      disabled
    } = this.state;
    const { getFieldDecorator } = form;
    const formItemConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 6 },
    };
    const formConfig = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return permission.includes('chuangrong:integralConfig:view') ? (
      <Fragment>
        <PageHeaderWrapper renderBtn={this.renderBtn}>
          <Form>
            <h4 style={{ padding: '20px 20px 0', fontWeight: 'bold' }}>成长值获取</h4>
            <div style={{ paddingLeft: '20px' }}>单位：元</div>
            <Form.Item label="购买车位是否获得成长值" {...formItemConfig}>
              {getFieldDecorator('buyParkingFlag', {
                rules: [
                  { required: true, message: '请选择购买车位是否获得成长值' },
                ],
                initialValue: infoData && infoData.isSet === 1 ? infoData.buyParkingFlag : null,
              })(
                <RadioGroup
                  allowClear
                  disabled={disabled}
                  onChange={(e) => {
                    if (e.target.value === 1) {
                      this.setState({
                        isShowBuyParking: true
                      })
                    } else {
                      this.setState({
                        isShowBuyParking: false
                      })
                    }
                  }}
                >
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </Form.Item>
            {
              this.state.isShowBuyParking &&
              <>
                <div style={{ padding: '0 20px 20px' }}>成长值折比设置</div>
                <Row gutter={24} type="flex" justify="space-around">
                  <Col span={12}>
                    <Form.Item label="委托出租车位" {...formConfig}>
                      {getFieldDecorator('rentRatio', {
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            validator: (rules, value, callback) => {
                              if (!value) {
                                callback('请输入委托出租车位')
                              }
                              if (value === '0') {
                                callback('请输入大于0的数')
                                return;
                              }
                              if (!regNum.test(value)) {
                                callback('请输入正整数')
                              }
                              callback()
                            }
                          }
                        ],
                        initialValue: infoData && infoData.isSet === 1 ? infoData.rentRatio.toString() : null,
                      })(<Input placeholder="请输入委托出租车位" maxLength={8} disabled={disabled} addonAfter="元=1成长值" />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="委托出售车位" {...formConfig}>
                      {getFieldDecorator('saleRatio', {
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            validator: (rules, value, callback) => {
                              if (!value) {
                                callback('请输入委托出售车位')
                              }
                              if (value === '0') {
                                callback('请输入大于0的数')
                                return;
                              }
                              if (!regNum.test(value)) {
                                callback('请输入正整数')
                              }
                              callback()
                            }
                          }
                        ],
                        initialValue: infoData && infoData.isSet === 1 ? infoData.saleRatio.toString() : null,
                      })(<Input placeholder="请输入委托出售车位" maxLength={8} disabled={disabled} addonAfter="元=1成长值" />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="保价版车位" {...formConfig}>
                      {getFieldDecorator('selfBuybackRatio', {
                        rules: [
                          {
                            required: true, whitespace: true, validator: (rules, value, callback) => {
                              if (!value) {
                                callback('请输入保价版车位')
                              }
                              if (value === '0') {
                                callback('请输入大于0的数')
                                return;
                              }
                              if (!regNum.test(value)) {
                                callback('请输入正整数')
                              }
                              callback()
                            }
                          }
                        ],
                        initialValue: infoData && infoData.isSet === 1 ? infoData.selfBuybackRatio.toString() : null,
                      })(<Input placeholder="请输入保价版车位" maxLength={8} disabled={disabled} addonAfter="元=1成长值" />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="标准版车位" {...formConfig}>
                      {getFieldDecorator('selfBaseRatio', {
                        rules: [
                          {
                            required: true, whitespace: true, validator: (rules, value, callback) => {
                              if (!value) {
                                callback('请输入标准版车位')
                              }
                              if (value === '0') {
                                callback('请输入大于0的数')
                                return;
                              }
                              if (!regNum.test(value)) {
                                callback('请输入正整数')
                              }
                              callback()
                            }
                          }
                        ],
                        initialValue: infoData && infoData.isSet === 1 ? infoData.selfBaseRatio.toString() : null,
                      })(<Input placeholder="请输入标准版车位" maxLength={8} disabled={disabled} addonAfter="元=1成长值" />)}
                    </Form.Item>
                  </Col>
                </Row>
              </>
            }
            <Divider />

            <Form.Item label="购买旅游商品是否获得成长值" {...formItemConfig}>
              {getFieldDecorator('buyTouristGoodsFlag', {
                rules: [
                  { required: true, message: '请选择购买旅游商品是否获得成长值' },
                ],
                initialValue: infoData && infoData.buyTouristGoodsFlag,
              })(
                <RadioGroup
                  allowClear
                  disabled={disabled}
                  onChange={(e) => {
                    if (e.target.value === 1) {
                      this.setState({
                        isShowBuyTouristGoods: true
                      })
                    } else {
                      this.setState({
                        isShowBuyTouristGoods: false
                      })
                    }
                  }}
                >
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </Form.Item>
            {
              this.state.isShowBuyTouristGoods &&
              <>
                <Form.Item label="成长值折比设置" {...formItemConfig}>
                  {getFieldDecorator('touristGoodsRatio', {
                    rules: [
                      {
                        required: true, whitespace: true, validator: (rules, value, callback) => {
                          if (!value) {
                            callback('请输入成长值折比设置')
                          }
                          if (value === '0') {
                            callback('请输入大于0的数')
                            return;
                          }
                          if (isNaN(value - 0) || !((value - 0).toString()).match(/(^[1-9]\d*$)/)) callback('请输入正整数')
                          callback()
                        }
                      },
                    ],
                    initialValue: infoData && infoData.isSet === 1 ? infoData.touristGoodsRatio.toString() : null,
                  })(
                    <Input placeholder="请输入成长值折比设置" maxLength={8} disabled={disabled} addonAfter="元=1成长值" />
                  )}
                </Form.Item>
              </>
            }

            <Divider />
            <Form.Item label="购买家居商品是否获得成长值" {...formItemConfig}>
              {getFieldDecorator('buyFurnitureGoodsFlag', {
                rules: [
                  { required: true, message: '请选择购买智慧家居是否获得成长值' },
                ],
                initialValue: infoData && infoData.isSet === 1 ? infoData.buyFurnitureGoodsFlag : null,
              })(
                <RadioGroup
                  allowClear
                  disabled={disabled}
                  onChange={(e) => {
                    if (e.target.value === 1) {
                      this.setState({
                        isShowBuyFurnitureGoods: true
                      })
                    } else {
                      this.setState({
                        isShowBuyFurnitureGoods: false
                      })
                    }
                  }}
                >
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </Form.Item>
            {
              this.state.isShowBuyFurnitureGoods &&
              <>
                <Form.Item label="成长值折比设置" {...formItemConfig}>
                  {getFieldDecorator('furnitureGoodsRatio', {
                    rules: [
                      {
                        required: true, whitespace: true, validator: (rules, value, callback) => {
                          if (!value) {
                            callback('请输入成长值折比设置')
                          }
                          if (value === '0') {
                            callback('请输入大于0的数')
                            return;
                          }
                          if (isNaN(value - 0) || !((value - 0).toString()).match(/(^[1-9]\d*$)/)) callback('请输入正整数')
                          callback()
                        }
                      },
                    ],
                    initialValue: infoData && infoData.isSet === 1 ? infoData.furnitureGoodsRatio.toString() : null,
                  })(
                    <Input placeholder="请输入成长值折比设置" maxLength={8} disabled={disabled} addonAfter="元=1成长值" />
                  )}
                </Form.Item>
              </>
            }
            <Divider />
            <Form.Item label="发布作品否获得成长值" {...formItemConfig}>
              {getFieldDecorator('buyTouristGoodsFlag', {
                rules: [
                  { required: true, message: '请选择购买旅游商品是否获得成长值' },
                ],
                initialValue: infoData && infoData.buyTouristGoodsFlag,
              })(
                <RadioGroup
                  allowClear
                  disabled={disabled}
                  onChange={(e) => {
                    if (e.target.value === 1) {
                      this.setState({
                        isShowBuyTouristGoods: true
                      })
                    } else {
                      this.setState({
                        isShowBuyTouristGoods: false
                      })
                    }
                  }}
                >
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </Form.Item>
            {
              this.state.isShowBuyTouristGoods &&
              <>
                <Form.Item label="成长值折比设置" {...formItemConfig}>
                  {getFieldDecorator('publishArticleRatio', {
                    rules: [
                      {
                        required: true, whitespace: true, validator: (rules, value, callback) => {
                          if (!value) {
                            callback('请输入成长值折比设置')
                          }
                          if (value === '0') {
                            callback('请输入大于0的数')
                            return;
                          }
                          if (isNaN(value - 0) || !((value - 0).toString()).match(/(^[1-9]\d*$)/)) callback('请输入正整数')
                          callback()
                        }
                      },
                    ],
                    initialValue: infoData && infoData.isSet === 1 ? infoData.publishArticleRatio.toString() : null,
                  })(
                    <Input placeholder="请输入成长值折比设置" maxLength={8} disabled addonAfter="篇=1成长值" />
                  )}
                </Form.Item>
                <Form.Item label="每月最多可通过发布作品获得" {...formItemConfig}>
                  {getFieldDecorator('touristGoodsRatio', {
                    rules: [
                      {
                        required: true, whitespace: true, validator: (rules, value, callback) => {
                          if (!value) {
                            callback('请输入成长值折比设置')
                          }
                          if (value === '0') {
                            callback('请输入大于0的数')
                            return;
                          }
                          if (isNaN(value - 0) || !((value - 0).toString()).match(/(^[1-9]\d*$)/)) callback('请输入正整数')
                          callback()
                        }
                      },
                    ],
                    initialValue: infoData && infoData.isSet === 1 ? infoData.touristGoodsRatio.toString() : null,
                  })(
                    <Input placeholder="请输入成长值折比设置" maxLength={8} disabled={disabled} addonAfter="成长值" />
                  )}
                </Form.Item>
              </>
            }
            <Divider />

            <h4 style={{ padding: '20px 20px 0', fontWeight: 'bold' }}>成长值规则</h4>
            <Form.Item label="成长值规则" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
              {getFieldDecorator('growthValue', {
                rules: [{ required: true, message: '请输入成长值规则' }],
                initialValue: infoData && infoData.isSet === 1 ? infoData.growthValue : null,
              })(
                <BraftEditor
                  handleChange={this.handleChange}
                  uploadImgUrl={`${_baseApi}/news/upload`}
                  content={infoData && infoData.isSet === 1 ? infoData.growthValue : null}
                  placeholder="请输入成长值规则"
                  excludeControls={['emoji', 'media', 'code', 'link', 'fullscreen']}
                  minHeight="500px"
                  disabled={disabled}
                />
              )}
            </Form.Item>
          </Form>
        </PageHeaderWrapper>
      </Fragment>
    ) : null;
  }
}

export default IndexComponent;
