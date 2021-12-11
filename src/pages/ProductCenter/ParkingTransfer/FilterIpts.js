import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect, Cascader } from 'antd';
import moment from 'moment';
import options from '@/utils/cascader-address-options';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';

const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ parkingTransferManage }) => ({
  parkingTransferManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'parkingTransferManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.completionTime && formQueryData.completionTime.length) {
      formQueryData.completionTimeStart = moment(formQueryData.completionTime[0]).format(
        'YYYY-MM-DD'
      );
      formQueryData.completionTimeEnd = moment(formQueryData.completionTime[1]).format(
        'YYYY-MM-DD'
      );
    }
    if (formQueryData.releaseTime && formQueryData.releaseTime.length) {
      formQueryData.releaseTimeStart = moment(formQueryData.releaseTime[0]).format('YYYY-MM-DD');
      formQueryData.releaseTimeEnd = moment(formQueryData.releaseTime[1]).format('YYYY-MM-DD');
    }
    delete formQueryData['completionTime'];
    delete formQueryData['releaseTime'];
    return formQueryData;
  };
  reset = () => {
    const { dispatch } = this.props;
    this.props.form.resetFields();
    dispatch({
      type: 'parkingTransferManage/setSearchInfo',
      payload: {},
    });
  };

  componentDidMount() {
    this.props.getChild(this);

    this.props.dispatch({
      type: 'parkingTransferManage/getAllSelect',
      payload: {},
    });

    this.props.dispatch({
      type: 'parkingTransferManage/setChannelList',
      payload: {},
    });
  }

  componentWillUnmount() {
    if (!this.props.staySearchInfo) {
      this.props.dispatch({
        type: 'parkingTransferManage/setSearchInfo',
        payload: {},
      });
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
      parkingTransferManage: { transferStatus, initData = {}, channelListData = {}, searchInfo },
    } = this.props;
    const { utmTypes, parentUtmTypes } = channelListData;
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
                <FormItem label="订单号" {...formItemConfig}>
                  {getFieldDecorator('orderCode', {
                    initialValue: searchInfo.orderCode || undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="用户名" {...formItemConfig}>
                  {getFieldDecorator('userName', {
                    initialValue: searchInfo.userName || undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="姓名" {...formItemConfig}>
                  {getFieldDecorator('trueName', {
                    initialValue: searchInfo.trueName || undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="楼盘名称" {...formItemConfig}>
                  {getFieldDecorator('buildingName', {
                    initialValue: searchInfo.buildingName || undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="车位号" {...formItemConfig}>
                  {getFieldDecorator('parkingCode', {
                    initialValue: searchInfo.parkingCode || undefined,
                  })(<Input />)}
                </FormItem>
              </Col>

              <Col {...inputConfig}>
                <FormItem label="一级渠道" {...formItemConfig}>
                  {getFieldDecorator('parentUtmId')(
                    <Select allowClear>
                      {parentUtmTypes &&
                        parentUtmTypes.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>

              {/*<Col {...inputConfig}>*/}
              {/*  <FormItem label="渠道" {...formItemConfig}>*/}
              {/*    {getFieldDecorator('utmId')(*/}
              {/*      <Select allowClear>*/}
              {/*        {utmTypes &&*/}
              {/*          utmTypes.map(item => (*/}
              {/*            <Option key={item.key} value={item.value}>*/}
              {/*              {item.title}*/}
              {/*            </Option>*/}
              {/*          ))}*/}
              {/*      </Select>*/}
              {/*    )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}

              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="当前状态" {...formItemConfig}>
                  {getFieldDecorator('status')(
                    <Select allowClear>
                      {initData &&
                        initData.transferStatus &&
                        initData.transferStatus.map(item => {
                          return (
                            <Option key={item.key} value={item.value}>
                              {item.title}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="完成时间" {...formItemConfig}>
                  {getFieldDecorator('completionTime', {
                    initialValue: searchInfo.completionTime || undefined,
                  })(<RangePicker />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="发布时间" {...formItemConfig}>
                  {getFieldDecorator('releaseTime', {
                    initialValue: searchInfo.releaseTime || undefined,
                  })(<RangePicker />)}
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
