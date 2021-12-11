import React, { PureComponent } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect, InputNumber } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';

const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TreeNode } = TreeSelect;

// 1:待付款,2:待发货,3:待收货,4:已完成,5:已关闭6:已退款
const orderStatusArr = [
  {
    label: '待付款',
    value: 1,
  },
  {
    label: '待发货',
    value: 2,
  },
  {
    label: '待收货',
    value: 3,
  },
  {
    label: '已完成',
    value: 4,
  },
  {
    label: '已关闭',
    value: 5,
  },
  {
    label: '已退款',
    value: 6,
  },
];

// 0未进行退款1用户提交退货2为初审成功待复审',

const refundTypeArr = [
  {
    label: '无',
    value: 0,
  },
  {
    label: '待审核',
    value: 1,
  },
  {
    label: '待复审',
    value: 2,
  },
  {
    label: '已退款',
    value: 3,
  },
];

@connect(({ SmarthomeOrderManage }) => ({
  SmarthomeOrderManage,
}))
@Form.create()
class FilterIpts extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'SmarthomeOrderManage/getSelectStoreCategoryList',
      payload: {
        type: '0',
      },
    });
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'tripOrderManage/getAllSelect',
    // });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'SmarthomeOrderManage/setSearchInfo',
      payload: {},
    });
  }

  formSubmit = async () => {
    const { dispatch, getList, pageSize } = this.props;
    await dispatch({
      type: 'SmarthomeOrderManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    getList(1, pageSize);
  };

  getFormValue = () => {
    const { form } = this.props;
    const formQueryData = form.getFieldsValue();

    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.finishTimeStart = moment(formQueryData.createTime[0]).format('YYYY-MM-DD');
      formQueryData.finishTimeEnd = moment(formQueryData.createTime[1]).format('YYYY-MM-DD');
    }
    if (formQueryData.refundSubmitTime && formQueryData.refundSubmitTime.length) {
      formQueryData.refundFinishTimeStart = moment(formQueryData.refundSubmitTime[0]).format(
        'YYYY-MM-DD'
      );
      formQueryData.refundFinishTimeEnd = moment(formQueryData.refundSubmitTime[1]).format(
        'YYYY-MM-DD'
      );
    }
    if (formQueryData.sendTime && formQueryData.sendTime.length) {
      formQueryData.sendTimeStart = moment(formQueryData.sendTime[0]).format('YYYY-MM-DD');
      formQueryData.sendTimeEnd = moment(formQueryData.sendTime[1]).format('YYYY-MM-DD');
    }
    delete formQueryData.createTime;
    delete formQueryData.refundSubmitTime;
    delete formQueryData.sendTime;
    return formQueryData;
  };

  reset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
      SmarthomeOrderManage: { storeCategoryList },
    } = this.props;

    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form {...formItemConfig}>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="订单类型" {...formItemConfig}>
                  {getFieldDecorator('orderType')(
                    <Select allowClear>
                      <Option key={0} value={0}>普通订单</Option>
                      <Option key={1} value={1}>活动订单</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col {...inputConfig}>
                <FormItem label="商品订单号" {...formItemConfig}>
                  {getFieldDecorator('orderNo')(<Input style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="所属类目" {...formItemConfig}>
                  {getFieldDecorator('categorId')(
                    <TreeSelect>
                      {storeCategoryList.map(item => (
                        <TreeNode
                          value={item.value}
                          title={item.label}
                          key={item.value}
                          selectable={false}
                        >
                          {item.children.map(item1 => (
                            <TreeNode value={item1.value} title={item1.label} key={item1.value} />
                          ))}
                        </TreeNode>
                      ))}
                    </TreeSelect>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="购买人" {...formItemConfig}>
                  {getFieldDecorator('buyerTrueName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="订单状态" {...formItemConfig}>
                  {getFieldDecorator('orderStatus')(
                    <Select allowClear>
                      {orderStatusArr.map(item => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="售后状态" {...formItemConfig}>
                  {getFieldDecorator('refundType')(
                    <Select allowClear>
                      {refundTypeArr.map(item => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="购买时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(<RangePicker />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="发货时间" {...formItemConfig}>
                  {getFieldDecorator('sendTime')(<RangePicker />)}
                </FormItem>
              </Col>
              <Col {...timeConfig}>
                <FormItem label="退款时间" {...formItemConfig}>
                  {getFieldDecorator('refundSubmitTime')(<RangePicker />)}
                </FormItem>
              </Col>
              <Col {...searchConfig}>
                <FormItem {...formItemConfig}>
                  <Button onClick={this.formSubmit} type="primary">
                    搜索
                  </Button>
                  <Button onClick={this.reset} style={{ marginLeft: 8 }}>
                    清空
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default FilterIpts;
