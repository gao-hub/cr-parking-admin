import React, { PureComponent } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  InputNumber,
  Card,
  DatePicker,
  Spin,
  PageHeader,
  Table,
  Divider,
  Popover,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import style from './index.less';
// 活动商品弹框
import EventGoodsModify from './EventGoodsModify';
// 多规格弹框
import StandardModify from './StandardModify';
import permission from '@/utils/PermissionWrapper';
import _ from 'lodash';
const FormItem = Form.Item;
@Form.create()
@permission
@connect(({ commodityManagement, loading }) => ({
  loading: loading.effects['commodityManagement/infoSeckillList'],
  commodityManagement,
}))
export default class CommodityModifyForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activityName: '', // 活动名称
      priceSpikeVisible: false, // 批量秒杀价框
      virtualVisible: false, // 批量虚拟库存框
      spikeVisible: false, // 批量秒杀库存框
      tabIndex: null,
      isStartSeckill: '', // 活动状态
    };
  }

  async componentDidMount() {
    const { id, activityName, isStartSeckill } = this.props.location.state;
    this.setState({ activityName, isStartSeckill });
    let res = await this.props.dispatch({
      type: 'commodityManagement/infoSeckillList',
      payload: {
        id,
      },
    });
    // const {
    //   commodityManagement: { activeBatchList },
    // } = this.props;
    // let array = activeBatchList;
    // array.map((item, index) => {
    //   item.activityProductList.map((val, oIndex) => {
    //     let nameFile = `activeBatchList.${item.id}.activityProductList.${val.id}.price`;
    //     let nameFile1 = `activeBatchList.${item.id}.activityProductList.${val.id}.virtualStock`;
    //     let nameFile2 = `activeBatchList.${item.id}.activityProductList.${val.id}.stock`;
    //     this.props.form.setFieldsValue({
    //       [nameFile]: val.price,
    //       [nameFile1]: val.virtualStock,
    //       [nameFile2]: val.stock,
    //     });
    //   });
    // });
  }

  // 添加活动批次
  add = () => {
    const {
      commodityManagement: { activeBatchList },
    } = this.props;
    let array = activeBatchList;
    if (array.length > 19) {
      message.warning('最多可添加20个');
    } else {
      array.push({
        id: new Date().getTime(),
        startTime: undefined,
        activityProductList: [],
        rowSelectionList: [],
        priceSpike: null, // 秒杀价
        virtualInventory: null, // 虚拟库存
        spikeInventory: null, // 秒杀库存
      });
      this.props.dispatch({
        type: 'commodityManagement/setActiveBatchList',
        payload: array,
      });
    }
  };

  // 删除活动批次
  remove = index => {
    const {
      commodityManagement: { activeBatchList },
    } = this.props;
    if (activeBatchList.length === 1) {
      return;
    }
    activeBatchList.splice(index, 1);
    this.props.dispatch({
      type: 'commodityManagement/setActiveBatchList',
      payload: activeBatchList,
    });
  };

  // 返回
  goBack = () => {
    this.props.history.push(`/spikeActivity/activityManage`);
    this.props.dispatch({
      type: 'commodityManagement/setSearchInfo',
      payload: {},
    });
  };

  // 提交
  handleSubmit = () => {
    const {
      commodityManagement: { activeBatchList },
    } = this.props;
    const { form } = this.props;
    let flag = false;
    let startTimeArr = [];
    activeBatchList.forEach((val, index) => {
      activeBatchList[index].startTime = moment(
        form.getFieldsValue().activeBatchList[val.id].startTime
      ).format('YYYY-MM-DD HH:mm');
      startTimeArr.push(val.startTime);
      startTimeArr = _.uniqWith(startTimeArr, _.isEqual);
      if (activeBatchList[index].activityProductList.length == 0) {
        message.warning('请选择秒杀商品');
        flag = true;
      }
    });
    if (startTimeArr.length !== activeBatchList.length) {
      message.warning('秒杀时间不能相同');
      flag = true;
    }
    if (!flag) {
      form.validateFieldsAndScroll(async (err, values) => {
        if (!err) {
          let res = await this.props.dispatch({
            type: 'commodityManagement/addSpikeBatch',
            payload: {
              id: this.props.location.state.id,
              activitySpikeBatchList: activeBatchList,
            },
          });
          if (res && res.status === 1) {
            message.success(res.statusDesc);
            this.props.history.push(`/spikeActivity/activityManage`);
            this.props.dispatch({
              type: 'commodityManagement/setSearchInfo',
              payload: {},
            });
          } else {
            message.error(res.statusDesc);
          }
        }
      });
    }
  };

  // 选择秒杀商品
  selectGoods = index => {
    const {
      commodityManagement: { activeBatchList },
    } = this.props;
    let array = [];
    activeBatchList[index].activityProductList.map(item => {
      array.push(item.homeStoreProductId);
    });
    this.commodityModify.changeVisible(true);
    this.commodityModify.onSelectChange(array, activeBatchList[index].activityProductList);
    this.setState({ tabIndex: index });
  };

  // 行多选的onChange事件
  onSelectChange = (selectedRowKeys, selectedRows, index) => {
    const {
      commodityManagement: { activeBatchList },
    } = this.props;
    let list = [...activeBatchList];
    list[index].selectedRowKeys = selectedRowKeys;
    this.props.dispatch({
      type: 'commodityManagement/setActiveBatchList',
      payload: list,
    });
  };

  // 接收选中的活动商品
  setColumns = record => {
    const {
      commodityManagement: { activeBatchList },
    } = this.props;
    let array = activeBatchList;
    array[this.state.tabIndex].activityProductList = _.cloneDeep(record);
    this.props.dispatch({
      type: 'commodityManagement/setActiveBatchList',
      payload: array,
    });
    setTimeout(() => {
      activeBatchList[this.state.tabIndex].activityProductList.map((val, index) => {
        let id = activeBatchList[this.state.tabIndex].id;
        let nameFile2 = `activeBatchList.${id}.activityProductList.${val.id}.stock`;
        let nameFile = `activeBatchList.${id}.activityProductList.${val.id}.price`;
        let nameFile1 = `activeBatchList.${id}.activityProductList.${val.id}.virtualStock`;
        this.props.form.setFieldsValue({
          [nameFile]: val.price,
          [nameFile1]: val.virtualStock,
          [nameFile2]: val.stock,
        });
      });
    }, 500);
  };

  // 批量设置
  setAll = (index, typeNameStr, id) => {
    const {
      commodityManagement: { activeBatchList },
    } = this.props;
    let obj = this.props.form.getFieldsValue();
    let value = obj.activeBatchList[index][typeNameStr];
    let arr = activeBatchList[index].selectedRowKeys;
    arr.forEach(element => {
      activeBatchList[index].activityProductList.forEach(val => {
        if (val.id == element) {
          val[typeNameStr] = value;
          let nameFile = `activeBatchList.${id}.activityProductList.${val.id}.${typeNameStr}`;
          this.props.form.setFieldsValue({
            [nameFile]: value,
          });
        }
      });
    });
    this.props.dispatch({
      type: 'commodityManagement/setActiveBatchList',
      payload: activeBatchList,
    });
    this.setState({ priceSpikeVisible: false, virtualVisible: false, spikeVisible: false });
  };

  // 删除规格
  deleteStandard = (index, record, dataIndex) => {
    const {
      commodityManagement: { activeBatchList },
    } = this.props;
    activeBatchList[index].activityProductList.splice(dataIndex, 1);
    this.props.dispatch({
      type: 'commodityManagement/setActiveBatchList',
      payload: activeBatchList,
    });
  };

  // 设置多规格
  setStandard = (index, record, dataIndex, type) => {
    this.StandardModify.changeVisible(true, record);
    this.StandardModify.setType(type, this.state.isStartSeckill);
    this.setState({
      parObj: {
        parIndex: index,
        chIndex: dataIndex,
      },
    });
  };

  // 设置多规格
  updateStandar = record => {
    const {
      commodityManagement: { activeBatchList },
    } = this.props;
    activeBatchList[this.state.parObj.parIndex].activityProductList[
      this.state.parObj.chIndex
    ] = record;
    // 计算多规格秒杀价最低价，虚拟库存，秒杀库存的和
    record.activityProductAttrValueList = _.sortBy(record.activityProductAttrValueList, item => {
      return item.price;
    });
    let priceNum = record.activityProductAttrValueList[0].price;
    let virtualStockNum = 0;
    let stockNum = 0;
    record.activityProductAttrValueList.forEach(item => {
      virtualStockNum += parseInt(item.virtualStock);
      stockNum += parseInt(item.stock);
    });
    this.props.form.setFieldsValue({
      [`activeBatchList.${activeBatchList[this.state.parObj.parIndex].id}.activityProductList.${
        record.id
      }.price`]: priceNum,
      [`activeBatchList.${activeBatchList[this.state.parObj.parIndex].id}.activityProductList.${
        record.id
      }.virtualStock`]: virtualStockNum,
      [`activeBatchList.${activeBatchList[this.state.parObj.parIndex].id}.activityProductList.${
        record.id
      }.stock`]: stockNum,
    });
    this.props.dispatch({
      type: 'commodityManagement/setActiveBatchList',
      payload: activeBatchList,
    });
  };

  // 填写秒杀价，虚拟库存，秒杀库存
  setData = (e, strname, index, dataIndex) => {
    const {
      commodityManagement: { activeBatchList },
    } = this.props;
    activeBatchList[index].activityProductList[dataIndex][strname] = e;
    this.props.dispatch({
      type: 'commodityManagement/setActiveBatchList',
      payload: activeBatchList,
    });
  };

  // 批量框的显示隐藏
  handleVisibleChange = (visible, type, length) => {
    if (length > 0) {
      if (type == 1) {
        // 秒杀价
        this.setState({
          priceSpikeVisible: visible,
          virtualVisible: false,
          spikeVisible: false,
        });
      } else if (type == 2) {
        // 虚拟库存
        this.setState({
          virtualVisible: visible,
          priceSpikeVisible: false,
          spikeVisible: false,
        });
      } else if (type == 3) {
        // 秒杀库存
        this.setState({
          virtualVisible: false,
          priceSpikeVisible: false,
          spikeVisible: visible,
        });
      }
    } else {
      message.warning('请选择要设置的商品');
    }
  };

  // 列设置
  columnsData = (index, id) => {
    return [
      // 秒杀商品表格列
      {
        title: '商品编号',
        dataIndex: 'productNo',
        width: '10%',
      },
      {
        title: '商品名称',
        dataIndex: 'storeName',
        width: '20%',
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
        width: 150,
        render: (text, record, dataIndex) => {
          const {
            form: { getFieldDecorator },
          } = this.props;
          return (
            <Form.Item>
              {getFieldDecorator(`activeBatchList.${id}.activityProductList.${record.id}.price`, {
                initialValue: record.price,
                rules: [
                  {
                    required:
                      record.specType != 1 &&
                      this.state.isStartSeckill != 2 &&
                      this.state.isStartSeckill != 3,
                    message: '请填写秒杀价(元)',
                  },
                  {
                    validator: (rule, value, callback) =>
                      this.priceValidator(rule, value, callback, record),
                  },
                ],
              })(
                <InputNumber
                  style={{ width: '100px' }}
                  min={0}
                  precision={2}
                  max={99999999}
                  disabled={
                    record.specType === 1 ||
                    this.state.isStartSeckill == 2 ||
                    this.state.isStartSeckill == 3
                  }
                  onChange={e => this.setData(e, 'price', index, dataIndex)}
                />
              )}{' '}
              {record.specType === 1 && ' 起'}
            </Form.Item>
          );
        },
      },
      {
        title: '虚拟库存(件)',
        dataIndex: 'virtualStock',
        editable: true,
        width: 150,
        render: (text, record, dataIndex) => {
          const {
            form: { getFieldDecorator },
          } = this.props;
          return (
            <Form.Item>
              {getFieldDecorator(
                `activeBatchList.${id}.activityProductList.${record.id}.virtualStock`,
                {
                  initialValue: record.virtualStock,
                  rules: [
                    {
                      required:
                        record.specType != 1 &&
                        this.state.isStartSeckill != 2 &&
                        this.state.isStartSeckill != 3,
                      message: '请填写虚拟库存(件)',
                    },
                  ],
                }
              )(
                <InputNumber
                  style={{ width: '100px' }}
                  min={0}
                  max={99999999}
                  disabled={
                    record.specType === 1 ||
                    this.state.isStartSeckill == 2 ||
                    this.state.isStartSeckill == 3
                  }
                  onChange={e => this.setData(e, 'virtualStock', index, dataIndex)}
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
        width: 150,
        render: (text, record, dataIndex) => {
          const {
            form: { getFieldDecorator },
          } = this.props;
          return (
            <Form.Item>
              {getFieldDecorator(`activeBatchList.${id}.activityProductList.${record.id}.stock`, {
                initialValue: record.stock,
                rules: [
                  {
                    required:
                      record.specType != 1 &&
                      this.state.isStartSeckill != 2 &&
                      this.state.isStartSeckill != 3,
                    message: '请填写秒杀库存(件)',
                  },
                ],
              })(
                <InputNumber
                  style={{ width: '100px' }}
                  min={0}
                  max={99999999}
                  disabled={
                    record.specType === 1 ||
                    this.state.isStartSeckill == 2 ||
                    this.state.isStartSeckill == 3
                  }
                  onChange={e => this.setData(e, 'stock', index, dataIndex)}
                />
                // <Input
                //   disabled={
                //     record.specType === 1 ||
                //     this.state.isStartSeckill == 2 ||
                //     this.state.isStartSeckill == 3
                //   }
                //   style={{ width: '100px' }}
                //   onChange={e => this.setData(e, 'stock', index, dataIndex)}
                // />
              )}
            </Form.Item>
          );
        },
      },
      {
        title: '操作',
        width: 200,
        render: (text, record, dataIndex) => {
          const { permission } = this.props;
          return (
            <div>
              {record.specType === 1 &&
                permission.includes('chuangrong:seckill:info') &&
                this.state.isStartSeckill != 2 &&
                this.state.isStartSeckill != 3 && (
                  <>
                    <span
                      className={style.operate}
                      onClick={() => this.setStandard(index, record, dataIndex, 'edit')}
                    >
                      设置多规格
                    </span>
                    <Divider type="vertical" />
                  </>
                )}
              {(this.state.isStartSeckill == 2 || this.state.isStartSeckill == 3) &&
                record.specType === 1 &&
                permission.includes('chuangrong:seckill:info') && (
                  <>
                    <span
                      className={style.operate}
                      onClick={() => this.setStandard(index, record, dataIndex, 'info')}
                    >
                      详情
                    </span>
                    <Divider type="vertical" />
                  </>
                )}
              {this.state.isStartSeckill != 2 &&
                this.state.isStartSeckill != 3 &&
                permission.includes('chuangrong:seckill:info') && (
                  <span
                    className={style.operate}
                    onClick={() => this.deleteStandard(index, record, dataIndex)}
                  >
                    删除
                  </span>
                )}
            </div>
          );
        },
      },
    ];
  };

  // 秒杀价不大于原价的校验
  priceValidator = (rule, value, callback, record) => {
    if (record.specType != 1) {
      if (value && value > record.otPrice) {
        callback('秒杀价不可大于原价!');
      }
    }
    callback();
  };

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
  };

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      columns,
      activityName,
      priceSpikeVisible,
      virtualVisible,
      spikeVisible,
      isStartSeckill,
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };
    const {
      permission,
      loading,
      commodityManagement: { activeBatchList },
    } = this.props;

    const formItems = (
      <Form>
        {activeBatchList &&
          activeBatchList.length > 0 &&
          activeBatchList.map((item, index) => (
            <Card
              extra={
                <div>
                  {!(isStartSeckill == 2 || isStartSeckill == 3) &&
                    permission.includes('chuangrong:seckill:info') &&
                    activeBatchList.length > 1 && (
                      <Button type="danger" key={item.id} onClick={() => this.remove(index)}>
                        删除
                      </Button>
                    )}
                </div>
              }
              style={{ width: '100%', marginBottom: '20px' }}
              key={index}
            >
              <Form.Item
                {...formItemLayout}
                label={'秒杀时间'}
                key={`activeBatchList[${item.id}].startTime`}
              >
                {getFieldDecorator(`activeBatchList[${item.id}].startTime`, {
                  rules: [
                    {
                      required: true,
                      message: '请选择秒杀时间',
                    },
                  ],
                  initialValue:
                    activeBatchList &&
                    activeBatchList.length > 0 &&
                    moment(activeBatchList[index].startTime),
                })(
                  <DatePicker
                    disabledDate={this.disabledDate}
                    disabledTime={this.disabledRangeTime}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    disabled={isStartSeckill == 2 || isStartSeckill == 3}
                    showTime
                    format="YYYY-MM-DD HH:mm"
                  />
                )}
              </Form.Item>

              <Form.Item
                {...formItemLayout}
                label={<span className={style.actName}>活动商品</span>}
                key={`activeBatchList[${index}].activityProductList`}
              >
                {getFieldDecorator(`activeBatchList[${index}].activityProductList`)(
                  <>
                    {!(isStartSeckill == 2 || isStartSeckill == 3) && (
                      <a onClick={() => this.selectGoods(index)}>选择秒杀商品</a>
                    )}
                    {item.activityProductList && item.activityProductList.length > 0 ? (
                      <Table
                        dataSource={item.activityProductList}
                        scroll={{ y: 240 }}
                        columns={this.columnsData(index, item.id)}
                        pagination={false}
                        rowKey="id"
                        style={{ maxHeight: '350px', overflow: 'auto' }}
                        rowSelection={{
                          onChange: (selectedRowKeys, selectedRows) => {
                            this.onSelectChange(selectedRowKeys, selectedRows, index);
                          },
                          getCheckboxProps: record => ({
                            disabled:
                              isStartSeckill == 2 || isStartSeckill == 3 || record.specType == 1,
                          }),
                        }}
                        footer={() =>
                          !(isStartSeckill == 2 || isStartSeckill == 3) && (
                            <div style={{ display: 'flex' }}>
                              <div>
                                已选中 {(item.selectedRowKeys && item.selectedRowKeys.length) || 0}{' '}
                                条数据
                              </div>
                              <div className={style.batchSettings}>
                                批量设置：
                                <Popover
                                  placement="bottom"
                                  content={
                                    <Form.Item>
                                      {getFieldDecorator(`activeBatchList[${index}].price`)(
                                        <div>
                                          <Input style={{ width: '30%' }} /> 元
                                          <Button
                                            style={{ margin: '0 20px' }}
                                            onClick={() => {
                                              this.setState({ priceSpikeVisible: '' });
                                            }}
                                          >
                                            取消
                                          </Button>
                                          <Button
                                            type="primary"
                                            onClick={() => {
                                              this.setAll(index, 'price', item.id);
                                            }}
                                          >
                                            确认
                                          </Button>
                                        </div>
                                      )}
                                    </Form.Item>
                                  }
                                  trigger="click"
                                  visible={priceSpikeVisible === index}
                                  onVisibleChange={visible =>
                                    this.handleVisibleChange(
                                      index,
                                      1,
                                      item?.selectedRowKeys?.length
                                    )
                                  }
                                >
                                  <a href="#">秒杀价</a>
                                </Popover>
                                <Popover
                                  placement="bottom"
                                  content={
                                    <Form.Item>
                                      {getFieldDecorator(`activeBatchList[${index}].virtualStock`)(
                                        <div>
                                          <Input style={{ width: '30%' }} /> 件
                                          <Button
                                            style={{ margin: '0 20px' }}
                                            onClick={() => {
                                              this.setState({ virtualVisible: '' });
                                            }}
                                          >
                                            取消
                                          </Button>
                                          <Button
                                            type="primary"
                                            onClick={() => {
                                              this.setAll(index, 'virtualStock', item.id);
                                            }}
                                          >
                                            确认
                                          </Button>
                                        </div>
                                      )}
                                    </Form.Item>
                                  }
                                  trigger="click"
                                  visible={virtualVisible === index}
                                  onVisibleChange={visible =>
                                    this.handleVisibleChange(
                                      index,
                                      2,
                                      item?.selectedRowKeys?.length
                                    )
                                  }
                                >
                                  <a href="#">虚拟库存</a>
                                </Popover>
                                <Popover
                                  placement="bottom"
                                  content={
                                    <Form.Item>
                                      {getFieldDecorator(`activeBatchList[${index}].stock`)(
                                        <div>
                                          <Input style={{ width: '30%' }} /> 件
                                          <Button
                                            style={{ margin: '0 20px' }}
                                            onClick={() => {
                                              this.setState({ spikeVisible: '' });
                                            }}
                                          >
                                            取消
                                          </Button>
                                          <Button
                                            type="primary"
                                            onClick={() => {
                                              this.setAll(index, 'stock', item.id);
                                            }}
                                          >
                                            确认
                                          </Button>
                                        </div>
                                      )}
                                    </Form.Item>
                                  }
                                  trigger="click"
                                  visible={spikeVisible === index}
                                  onVisibleChange={visible =>
                                    this.handleVisibleChange(
                                      index,
                                      3,
                                      item?.selectedRowKeys?.length
                                    )
                                  }
                                >
                                  <a href="#">秒杀库存</a>
                                </Popover>
                              </div>
                            </div>
                          )
                        }
                      />
                    ) : null}
                  </>
                )}
              </Form.Item>
            </Card>
          ))}
      </Form>
    );

    return (
      <Spin spinning={loading}>
        <div className={style.content}>
          <PageHeader title={'商品管理'}>
            <div style={{ margin: '20px 0' }}>
              活动名称：
              {activityName}
              {!(isStartSeckill == 2 || isStartSeckill == 3) &&
                permission.includes('chuangrong:seckill:info') && (
                  <Button
                    type="primary"
                    style={{ marginRight: '10px', float: 'right' }}
                    onClick={this.add}
                  >
                    添加
                  </Button>
                )}
            </div>
            {formItems}
          </PageHeader>

          <div className={style.footer}>
            <Button onClick={this.goBack}>返回</Button>
            {permission.includes('chuangrong:seckill:info') &&
            !(isStartSeckill == 2 || isStartSeckill == 3) ? (
              <Button type="primary" onClick={this.handleSubmit}>
                保存
              </Button>
            ) : null}
          </div>
        </div>

        <EventGoodsModify
          getChildData={child => (this.commodityModify = child)}
          getdata={this.setColumns}
        />
        <StandardModify
          getChildData={child => (this.StandardModify = child)}
          updateStandar={this.updateStandar}
        />
      </Spin>
    );
  }
}
