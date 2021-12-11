import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption, filterEmptyObject } from '@/utils/utils';

const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ tripProductManage }) => ({
  tripProductManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'tripProductManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize, this.props.onSale);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 上架时间
    if (formQueryData.onSaleTime && formQueryData.onSaleTime.length) {
      formQueryData.onSaleTimeStart = moment(formQueryData.onSaleTime[0]).format('YYYY-MM-DD');
      formQueryData.onSaleTimeEnd = moment(formQueryData.onSaleTime[1]).format('YYYY-MM-DD');
    }
    // 下架时间
    if (formQueryData.offSaleTime && formQueryData.offSaleTime.length) {
      formQueryData.offSaleTimeStart = moment(formQueryData.offSaleTime[0]).format('YYYY-MM-DD');
      formQueryData.offSaleTimeEnd = moment(formQueryData.offSaleTime[1]).format('YYYY-MM-DD');
    }
    // 创建时间
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format('YYYY-MM-DD');
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format('YYYY-MM-DD');
    }
    delete formQueryData['onSaleTime'];
    delete formQueryData['offSaleTime'];
    delete formQueryData['createTime'];
    return filterEmptyObject(formQueryData);
  };
  reset = () => {
    this.props.form.resetFields();
  };

  componentDidMount() {
    this.props.getChild(this);
    this.props.dispatch({
      type: 'tripProductManage/getAllSelect',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'tripProductManage/setSearchInfo',
      payload: {},
    });
  }

  onSearch = (val) => {
    console.log('search:', val);
  };

  render() {
    const {
      form: { getFieldDecorator },
      tripProductManage,
    } = this.props;
    const {
      initData,
    } = tripProductManage;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="产品名称" {...formItemConfig}>
                  {getFieldDecorator('productName')(<Input/>)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="所属标签" {...formItemConfig}>
                  {getFieldDecorator('tagId')(
                    <Select
                      allowClear
                      showSearch
                    >
                      {initData &&
                      initData.map(item => {
                        return (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="旅游类型" {...formItemConfig}>
                  {getFieldDecorator('classifyId')(
                    <Select allowClear>
                      <Option key='5' value='5'>国内游</Option>
                      <Option key='6' value='6'>周边游</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              {this.props.onSale == 1 || this.props.onSale == 0 ? (
                <Col {...inputConfig}>
                  <FormItem label="销量" {...formItemConfig}>
                    {getFieldDecorator('saleCountStart')(
                      <Input style={{ width: '40%' }}/>,
                    )} ~ {getFieldDecorator('saleCountEnd')(
                    <Input style={{ width: '40%' }}/>,
                  )}
                  </FormItem>
                </Col>
              ) : null}
              <Col {...inputConfig}>
                <FormItem label="售卖价格" {...formItemConfig}>
                  {getFieldDecorator('productPriceStart')(
                    <Input style={{ width: '40%' }}/>,
                  )} ~ {getFieldDecorator('productPriceEnd')(
                  <Input style={{ width: '40%' }}/>,
                )}
                </FormItem>
              </Col>
              {this.props.onSale == 1 ? (
                <Col {...inputConfig}>
                  <FormItem label="推荐状态" {...formItemConfig}>
                    {getFieldDecorator('recommend')(
                      <Select allowClear>
                        <Option key='0' value='0'>无推荐</Option>
                        <Option key='1' value='1'>推荐中</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              ) : null}
              {this.props.onSale == 1 || this.props.onSale == 0 ? (
                <Col {...inputConfig}>
                  <FormItem label="上架时间" {...formItemConfig}>
                    {getFieldDecorator('onSaleTime')(<RangePicker/>)}
                  </FormItem>
                </Col>
              ) : null}
              {this.props.onSale == 1 || this.props.onSale == 0 ? (
                <Col {...inputConfig}>
                  <FormItem label="下架时间" {...formItemConfig}>
                    {getFieldDecorator('offSaleTime')(<RangePicker/>)}
                  </FormItem>
                </Col>
              ) : null}
              {this.props.onSale !== 1 && this.props.onSale !== 0 ? (
                <Col {...inputConfig}>
                  <FormItem label="创建时间" {...formItemConfig}>
                    {getFieldDecorator('createTime')(<RangePicker/>)}
                  </FormItem>
                </Col>
              ) : null}
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
