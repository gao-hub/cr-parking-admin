import React, { PureComponent } from 'react';
import { Row, Col, Input, Form, Radio, InputNumber, message } from 'antd';
import { connect } from 'dva';
import ShopSpec from './ShopSpec/index';

const formItemConfig = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};

// {
//   id: (count += 1),
//   showDeleteIcon: false,
//   value: {
//     InputValue: '',
//     imgFilelist: '',
//   },
// }

@Form.create()
class BasicInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      singleSpec: true,
      isShowPostageInput: false,
    };
  }

  componentDidMount() {
    const { getThis, infoData } = this.props;
    getThis(this);
    // 初始值
    if (infoData) {
      this.setState({ singleSpec: infoData.specType === 0 });
      this.setState({ isShowPostageInput: infoData.isPostage === 0 });
    }
  }

  // 是否包邮
  handlePostageOnChange = e => {
    const { form } = this.props;
    form.setFieldsValue({
      isPostage: e.target.value,
    });

    this.setState({ isShowPostageInput: e.target.value === 0 });
  };

  handleFormData = () => {
    const { form, specSelectData, tableData, isChanged } = this.props;
    const { singleSpec } = this.state;
    let returnData;
    form.validateFields((err, values) => {
      if (!err) {
        if (singleSpec) {
          if (
            (values.markPrice ? values.markPrice > values.otPrice : true) &&
            values.otPrice >= values.cost
          ) {
            returnData = {
              ...values,
              attrs: [
                {
                  cost: values.cost,
                  price: values.otPrice,
                  markPrice: values.markPrice,
                  stock: values.stock,
                },
              ],
            };
            delete returnData.cost;
            delete returnData.otPrice;
            delete returnData.markPrice;
            delete returnData.stock;
          } else {
            message.error('不符合价格规则：划线价>=售价>成本价');
          }
        } else {
          let isPriceRightflag = true;
          let isStockRightflag = true;

          isStockRightflag = tableData.some(item => item.value.stock > 0);
          isPriceRightflag = tableData.every(item => {
            if (item.value.cost !== 0) {
              return item.value.price > 0 && item.value.cost <= item.value.price;
            }
            return item.value.price > 0;
          });

          if (!isChanged) {
            if (isPriceRightflag && isStockRightflag) {
              returnData = {
                ...values,
                items: [],
                attrs: [],
              };
              specSelectData.forEach(item => {
                const obj = {
                  detail: [],
                  value: item.value.selectValue,
                  contorFlag: item.value.contorFlag,
                };
                item.value.val.forEach(v => {
                  obj.detail.push({
                    name: v.value.InputValue,
                    image: v.value.imgFilelist ? v.value.imgFilelist : '',
                  });
                });
                returnData.items.push(obj);
              });
              tableData.forEach(item => {
                const obj = {
                  ...item.value,
                  ...item.valueArr,
                };
                obj.detail = item.detail;
                returnData.attrs.push(obj);
              });
            } else if (!isPriceRightflag) {
              message.error('售价 >= 成本价 >=0');
            } else {
              message.error('库存不能全部为0');
            }
          } else {
            message.error('请点击‘生成规格明细’按钮生成最新数据');
          }
        }
      }
    });
    return returnData;
  };

  // 单规格多规格切换
  handleSpecTypeChange = e => {
    const { form } = this.props;
    form.setFieldsValue({
      specType: e.target.value,
      cost: undefined,
      otPrice: undefined,
      markPrice: undefined,
      stock: undefined,
    });
    this.setState({ singleSpec: e.target.value === 0 });
  };

  handleValidator = (rule, value, callback) => {
    if (value > 0 || value === null) {
      callback();
    } else {
      callback('价格必须大于0');
    }
  };

  handleFictiValidator = (rule, value, callback) => {
    if (value > 99999999) {
      callback('输入值不大于八位数');
    } else {
      callback();
    }
  };

  render() {
    const { form, infoData, disabled } = this.props;
    const { singleSpec, isShowPostageInput } = this.state;
    const { getFieldDecorator } = form;
    const { handlePostageOnChange, handleSpecTypeChange } = this;

    return (
      <div>
        <div>销售信息</div>
        <Form {...formItemConfig}>
          <Row gutter={24}>
            <Col>
              <Form.Item
                label="商品规格"
                extra={
                  <span style={{ fontSize: '10px' }}>如有颜色、尺码等多种规格，请添加商品规格</span>
                }
              >
                {getFieldDecorator('specType', {
                  initialValue: (infoData && infoData.specType) || 0,
                })(
                  <Radio.Group onChange={handleSpecTypeChange} disabled={disabled || infoData}>
                    <Radio value={0}>单规格</Radio>
                    <Radio value={1}>多规格</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            {!singleSpec ? <ShopSpec disabled={disabled} /> : null}

            <Col>
              <Form.Item label="成本价">
                {getFieldDecorator('cost', {
                  rules: singleSpec
                    ? [
                        { validator: this.handleValidator, message: '价格必须大于0' },
                        { required: true, message: '输入框不得为空' },
                      ]
                    : [],
                  initialValue: singleSpec ? infoData && infoData.cost : '',
                })(
                  <InputNumber
                    addonAfter="元"
                    disabled={!singleSpec || disabled}
                    style={{
                      width: '200px',
                    }}
                    precision={2}
                  />
                )}
                <span>元</span>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="商品售价">
                {getFieldDecorator('otPrice', {
                  rules: singleSpec
                    ? [
                        { validator: this.handleValidator, message: '价格必须大于0' },
                        { required: true, message: '输入框不得为空' },
                      ]
                    : [],
                  initialValue: singleSpec ? infoData && infoData.otPrice : '',
                })(
                  <InputNumber
                    addonAfter="元"
                    disabled={!singleSpec || disabled}
                    style={{
                      width: '200px',
                    }}
                    precision={2}
                  />
                )}
                <span>元</span>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="划线价">
                {getFieldDecorator('markPrice', {
                  rules: singleSpec
                    ? [{ validator: this.handleValidator, message: '价格必须大于0' }]
                    : [],
                  initialValue: singleSpec ? infoData && infoData.markPrice : '',
                })(
                  <InputNumber
                    addonAfter="元"
                    disabled={!singleSpec || disabled}
                    style={{
                      width: '200px',
                    }}
                    precision={2}
                  />
                )}
                <span>元</span>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="总库存"
                extra={
                  <span style={{ fontSize: '10px' }}>拍下扣库存，若支付失败则恢复库存数量</span>
                }
              >
                {getFieldDecorator('stock', {
                  rules: singleSpec ? [{ required: true, message: '输入框不得为空' }] : [],
                  initialValue: singleSpec ? infoData && infoData.stock : '',
                })(
                  <InputNumber
                    disabled={!singleSpec || disabled}
                    style={{
                      width: '200px',
                    }}
                    min={0}
                    precision={0}
                  />
                )}
              </Form.Item>
            </Col>

            <Col>
              <Form.Item label="运费">
                {getFieldDecorator('isPostage', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: infoData ? infoData.isPostage : 1,
                })(
                  <Radio.Group onChange={handlePostageOnChange} disabled={disabled}>
                    <Radio value={1}>免运费</Radio>
                    <Radio value={0}>统一邮费</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            {isShowPostageInput && (
              <Col>
                <Form.Item label="邮费">
                  {getFieldDecorator('postage', {
                    rules: [
                      { required: true, message: '请输入' },
                      { validator: this.handleValidator, message: '价格必须大于0' },
                    ],
                    initialValue: infoData && infoData.postage,
                  })(
                    <InputNumber
                      style={{
                        width: '100px',
                      }}
                      disabled={disabled}
                      min={0}
                    />
                  )}
                  <span>元</span>
                </Form.Item>
              </Col>
            )}
            <Col>
              <Form.Item label="售后服务" wrapperCol={{ span: 20 }}>
                {getFieldDecorator('postSaleType', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: infoData && infoData.postSaleType,
                })(
                  <Radio.Group disabled={disabled}>
                    <Radio value={0}>7天无理由退换货</Radio>
                    <Radio value={1}>不支持7天无理由退换货</Radio>
                    <Radio value={2}>质量问题包退换</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="虚拟已售"
                extra={
                  <span style={{ fontSize: '10px' }}>
                    此数值只为了前端页面展示，不计入销量统计中；前端页面的已售=虚拟已售+实际销售数量
                  </span>
                }
              >
                {getFieldDecorator('ficti', {
                  rules: [
                    { required: true, message: '输入框不得为空' },
                    { validator: this.handleFictiValidator, message: '输入值不大于八位数' },
                  ],
                  initialValue: infoData && infoData.ficti,
                })(<InputNumber min={0} disabled={disabled} precision={0} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapStatetoprops = ({ productsManage }) => ({
  specSelectData: productsManage.specSelectData,
  isChanged: productsManage.isChanged,
  tableData: productsManage.tableData,
});

export default connect(mapStatetoprops)(BasicInformation);
