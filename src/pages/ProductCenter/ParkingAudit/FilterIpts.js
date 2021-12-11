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

@connect(({ parkingAuditManage }) => ({
  parkingAuditManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'parkingAuditManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.location && formQueryData.location.length) {
      formQueryData.districtCode = formQueryData.location[2];
    }
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format('YYYY-MM-DD');
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format('YYYY-MM-DD');
    }

    if (formQueryData.updateTime && formQueryData.updateTime.length) {
      formQueryData.updateTimeStart = moment(formQueryData.updateTime[0]).format('YYYY-MM-DD');
      formQueryData.updateTimeEnd = moment(formQueryData.updateTime[1]).format('YYYY-MM-DD');
    }
    delete formQueryData['updateTime'];
    // delete formQueryData['createTime']
    return formQueryData;
  };
  reset = () => {
    const { dispatch } = this.props;
    this.props.form.resetFields();
    dispatch({
      type: 'parkingAuditManage/setSearchInfo',
      payload: {},
    });
  };
  componentDidMount() {
    this.props.getChild(this);
    this.props.dispatch({
      type: 'parkingAuditManage/getAllSelect',
      payload: {},
    });
  }
  componentWillUnmount() {
    if (!this.props.staySearchInfo) {
      this.props.dispatch({
        type: 'parkingAuditManage/setSearchInfo',
        payload: {},
      });
    }
  }
  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
      parkingAuditManage: { developerList, initData, searchInfo },
    } = this.props;
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
                <FormItem label="车位订单号" {...formItemConfig}>
                  {getFieldDecorator('parkingOrderNo', {
                    initialValue: searchInfo.parkingOrderNo || undefined,
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
                <FormItem label="所在地" {...formItemConfig}>
                  {getFieldDecorator('location', {
                    initialValue: searchInfo.location || undefined,
                  })(<Cascader options={options} />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="开发商" {...formItemConfig}>
                  {getFieldDecorator('developerId', {
                    initialValue: searchInfo.developer || undefined,
                  })(
                    <Select allowClear>
                      {developerList.map(item => (
                        <Option value={item.id} key={item.id}>
                          {item.developer}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="车位号" {...formItemConfig}>
                  {getFieldDecorator('parkingCode', {
                    initialValue: searchInfo.parkingCode || undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="车位用途" {...formItemConfig}>
                  {getFieldDecorator('useType')(
                    <Select allowClear>
                      {initData &&
                        initData.useType &&
                        initData.useType.map(item => {
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
              <Col {...inputConfig}>
                <FormItem label="购买人" {...formItemConfig}>
                  {getFieldDecorator('buyerName', {
                    initialValue: searchInfo.buyerName || undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              {/*<Col style={searchWholeState ? {} : { display: 'none' }}  {...inputConfig}>*/}
              {/*  <FormItem label="状态" {...formItemConfig}>*/}
              {/*    {getFieldDecorator('auditStatus')(*/}
              {/*      <Select allowClear>*/}
              {/*        <Option value={0}>在售</Option>*/}
              {/*        <Option value={1}>已售出</Option>*/}
              {/*        <Option value={2}>持有中</Option>*/}
              {/*        <Option value={3}>退货中</Option>*/}
              {/*      </Select>*/}
              {/*    )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="运营审核" {...formItemConfig}>
                  {getFieldDecorator('operateAuditStatus')(
                    <Select allowClear>
                      {initData &&
                        initData.operateAudit &&
                        initData.operateAudit.map(item => {
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
                <FormItem label="财务审核" {...formItemConfig}>
                  {getFieldDecorator('auditStatus')(
                    <Select allowClear>
                      {initData &&
                        initData.auditStatus &&
                        initData.auditStatus.map(item => {
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
                <FormItem label="代销周期" {...formItemConfig}>
                  {getFieldDecorator('investMonth')(
                    <Select allowClear>
                      {initData &&
                        initData.investMonth &&
                        initData.investMonth.map(item => {
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
              {/*<Col style={searchWholeState ? {} : { display: 'none' }}  {...inputConfig}>*/}
              {/*  <FormItem label="出售状态" {...formItemConfig}>*/}
              {/*    {getFieldDecorator('auditStatus',{*/}
              {/*      initialValue: searchInfo.auditStatus || undefined*/}
              {/*    })(*/}
              {/*      <Select allowClear>*/}
              {/*        {initData && initData.auditStatus && initData.auditStatus.map(item=>{*/}
              {/*          return <Option key={item.key} value={item.value}>{item.title}</Option>*/}
              {/*        })}*/}

              {/*      </Select>*/}
              {/*    )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="创建时间" {...formItemConfig}>
                  {getFieldDecorator('createTime', {
                    initialValue: searchInfo.createTime || undefined,
                  })(<RangePicker />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? {} : { display: 'none' }} {...inputConfig}>
                <FormItem label="出售时间" {...formItemConfig}>
                  {getFieldDecorator('updateTime', {
                    initialValue: searchInfo.updateTime || undefined,
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
