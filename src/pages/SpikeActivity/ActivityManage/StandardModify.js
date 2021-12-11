import React, { PureComponent } from 'react';
import { Modal, Button, Table, Form, Input, Popover, InputNumber, message } from 'antd';
import { connect } from 'dva';
import style from './index.less';
const FormItem = Form.Item;
import _ from 'lodash';
@Form.create()
@connect(({ commodityManagement }) => ({
  commodityManagement,
}))
export default class StandardModify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      type: '', // info 详情 edit 设置多规格
      isStartSeckill: '', // 活动状态
      visible: false, // 控制弹框
      selectedRowKeys: [], // 规格表选中key
      priceSpikeVisible: false, // 批量秒杀价框
      virtualVisible: false, // 批量虚拟库存框
      spikeVisible: false, // 批量秒杀库存框
      record: [], // 传过来的表格行数据
      columns: [
        // 多规格表格列
        {
          title: '规格信息',
          dataIndex: 'sku',
        },
        {
          title: '原价(元)',
          dataIndex: 'otPrice',
          width: '10%',
        },
        {
          title: '秒杀价(元)',
          dataIndex: 'price',
          editable: true,
          render: (text, record, dataIndex) => {
            const {
              form: { getFieldDecorator },
            } = this.props;
            return (
              <Form.Item>
                {getFieldDecorator(`standardList.${record.productAttrValueId}.price`, {
                  // initialValue: record.price,
                  rules: [
                    {
                      required: true,
                      message: '请填写秒杀价(元)',
                    },
                    {
                      validator: (rule, value, callback) =>
                        this.priceValidator(rule, value, callback, record),
                    },
                  ],
                })(
                  <InputNumber
                    style={{ width: '300px' }}
                    min={0}
                    precision={2}
                    max={99999999}
                    disabled={this.state.type === 'info'}
                    onChange={e => this.setData(e, 'price', dataIndex)}
                  />
                )}
              </Form.Item>
            );
          },
        },
        {
          title: '虚拟库存(件)',
          dataIndex: 'virtualStock',
          editable: true,
          render: (text, record, dataIndex) => {
            const {
              form: { getFieldDecorator },
            } = this.props;
            return (
              <Form.Item>
                {getFieldDecorator(`standardList.${record.productAttrValueId}.virtualStock`, {
                  // initialValue: record.virtualStock,
                  rules: [
                    {
                      required: true,
                      message: '请填写虚拟库存(件)',
                    },
                  ],
                })(
                  <InputNumber
                    style={{ width: '300px' }}
                    min={0}
                    max={99999999}
                    disabled={this.state.type === 'info'}
                    onChange={e => this.setData(e, 'virtualStock', dataIndex)}
                  />
                )}
              </Form.Item>
            );
          },
        },
        {
          title: '秒杀库存(件)',
          dataIndex: 'stock',
          editable: true,
          render: (text, record, dataIndex) => {
            const {
              form: { getFieldDecorator },
            } = this.props;
            return (
              <Form.Item>
                {getFieldDecorator(`standardList.${record.productAttrValueId}.stock`, {
                  // initialValue: record.stock,
                  rules: [
                    {
                      required: true,
                      message: '请填写秒杀库存(件)',
                    },
                  ],
                })(
                  <InputNumber
                    style={{ width: '300px' }}
                    min={0}
                    max={99999999}
                    disabled={this.state.type === 'info'}
                    onChange={e => this.setData(e, 'stock', dataIndex)}
                  />
                  // <Input
                  //   disabled={this.state.type === 'info'}
                  //   onChange={e => this.setData(e, 'stock', dataIndex)}
                  // />
                )}
              </Form.Item>
            );
          },
        },
      ],
    };
  }

  // 表单秒杀价不大于原价的校验
  priceValidator = (rule, value, callback, record) => {
    if (value && value > record.otPrice) {
      callback('秒杀价不可大于原价!');
    }
    callback();
  };

  componentDidMount() {
    this.props.getChildData(this);
  }

  // 设置多规格值
  setData = (e, strname, index) => {
    this.state.record.activityProductAttrValueList[index][strname] = e;
  };

  setType = (type, isStartSeckill) => {
    this.setState({ type, isStartSeckill });
  };

  changeVisible = (visible, record) => {
    let that = this;
    let list = _.cloneDeep(record);
    this.setState({ visible, record: list, loading: true },
      async () => {
        if (visible) {
          setTimeout(async () => {
            if (
              list.activityProductAttrValueList == null ||
              list.activityProductAttrValueList == undefined ||
              list.activityProductAttrValueList.length == 0
            ) {
              let res = await this.props.dispatch({
                type: 'commodityManagement/getProductAttrValueList',
                payload: {
                  id: list.id,
                },
              });
              list.activityProductAttrValueList = res.data;
            } else {
              list.activityProductAttrValueList.map((val, index) => {
                let nameFile = `standardList.${val.productAttrValueId}.price`;
                let nameFile1 = `standardList.${val.productAttrValueId}.virtualStock`;
                let nameFile2 = `standardList.${val.productAttrValueId}.stock`;
                that.props.form.setFieldsValue({
                  [nameFile]: val.price,
                  [nameFile1]: val.virtualStock,
                  [nameFile2]: val.stock,
                });
              });
            }
            that.setState({ loading: false });
          }, 500);
        }
      }
    );
  };

  // 表格复选框change事件
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 添加商品
  handleOk = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.updateStandar(this.state.record);
        this.setState({
          visible: false,
        });
      }
    });
  };

  // 批量设置
  setAll = typeNameStr => {
    const { selectedRowKeys } = this.state;
    let obj = this.props.form.getFieldsValue();
    let batchData = obj[typeNameStr];
    let isArray = this.state.record.activityProductAttrValueList;
    selectedRowKeys.map(val => {
      let nameFile = `standardList.${val}.${typeNameStr}`;
      this.props.form.setFieldsValue({
        [nameFile]: batchData,
      });

      isArray.forEach(element => {
        if (element.productAttrValueId === val) {
          element[typeNameStr] = batchData;
        }
      });
    });
    this.setState({ priceSpikeVisible: false, virtualVisible: false, spikeVisible: false });
  };

  // 批量框的显示隐藏
  handleVisibleChange = (visible, type, length) => {
    if (length > 0) {
      if (type == 1) {
        // 秒杀价
        this.setState({ priceSpikeVisible: visible, virtualVisible: false, spikeVisible: false });
      } else if (type == 2) {
        // 虚拟库存
        this.setState({ virtualVisible: visible, priceSpikeVisible: false, spikeVisible: false });
      } else if (type == 3) {
        // 秒杀库存
        this.setState({ spikeVisible: visible, priceSpikeVisible: false, virtualVisible: false });
      }
    } else {
      message.warning('请选择要设置的规格');
    }
  };

  render() {
    const {
      selectedRowKeys,
      record,
      columns,
      priceSpikeVisible,
      virtualVisible,
      spikeVisible,
      type,
      isStartSeckill,
      loading
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: isStartSeckill == 2 || isStartSeckill == 3 || type === 'info',
      }),
    };
    const hasSelected = selectedRowKeys.length > 0;
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Modal
        title="设置多规格"
        width="86%"
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose
        onCancel={() => this.changeVisible(false)}
      >
        商品名称：
        {this.state.record?.storeName}
        <div>
          <Form>
            <Table
              rowKey="productAttrValueId"
              loading={loading}
              rowSelection={rowSelection}
              columns={columns}
              pagination={false}
              dataSource={record?.activityProductAttrValueList || []}
              footer={() =>
                type === 'edit' && (
                  <div>
                    <div style={{ display: 'flex' }}>
                      <div>{hasSelected ? `已选中 ${selectedRowKeys.length} 条数据` : ''}</div>
                      <div className={style.batchSettings}>
                        批量设置：
                        <Popover
                          placement="bottom"
                          content={
                            <Form.Item>
                              {getFieldDecorator(`price`)(
                                <div>
                                  <Input style={{ width: '30%' }} /> 元
                                  <Button
                                    style={{ margin: '0 20px' }}
                                    onClick={() => {
                                      this.setState({ priceSpikeVisible: false });
                                    }}
                                  >
                                    取消
                                  </Button>
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      this.setAll('price');
                                    }}
                                  >
                                    确认
                                  </Button>
                                </div>
                              )}
                            </Form.Item>
                          }
                          trigger="click"
                          visible={priceSpikeVisible}
                          onVisibleChange={visible =>
                            this.handleVisibleChange(visible, 1, selectedRowKeys?.length)
                          }
                        >
                          <a href="#">秒杀价</a>
                        </Popover>
                        <Popover
                          placement="bottom"
                          content={
                            <Form.Item>
                              {getFieldDecorator(`virtualStock`)(
                                <div>
                                  <Input style={{ width: '30%' }} /> 件
                                  <Button
                                    style={{ margin: '0 20px' }}
                                    onClick={() => {
                                      this.setState({ virtualVisible: false });
                                    }}
                                  >
                                    取消
                                  </Button>
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      this.setAll('virtualStock');
                                    }}
                                  >
                                    确认
                                  </Button>
                                </div>
                              )}
                            </Form.Item>
                          }
                          trigger="click"
                          visible={virtualVisible}
                          onVisibleChange={visible =>
                            this.handleVisibleChange(visible, 2, selectedRowKeys?.length)
                          }
                        >
                          <a href="#">虚拟库存</a>
                        </Popover>
                        <Popover
                          placement="bottom"
                          content={
                            <Form.Item>
                              {getFieldDecorator(`stock`)(
                                <div>
                                  <Input style={{ width: '30%' }} /> 件
                                  <Button
                                    style={{ margin: '0 20px' }}
                                    onClick={() => {
                                      this.setState({ spikeVisible: false });
                                    }}
                                  >
                                    取消
                                  </Button>
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      this.setAll('stock');
                                    }}
                                  >
                                    确认
                                  </Button>
                                </div>
                              )}
                            </Form.Item>
                          }
                          trigger="click"
                          visible={spikeVisible}
                          onVisibleChange={visible =>
                            this.handleVisibleChange(visible, 3, selectedRowKeys?.length)
                          }
                        >
                          <a href="#">秒杀库存</a>
                        </Popover>
                      </div>
                    </div>
                  </div>
                )
              }
            />
          </Form>
        </div>
      </Modal>
    );
  }
}
