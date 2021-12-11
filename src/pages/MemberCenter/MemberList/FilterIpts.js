import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ userManage, loading }) => ({
  userManage,
  loading:
    loading.effects['userManage/fetchList'] ||
    loading.effects['userManage/statusChangeManage'] ||
    loading.effects['userManage/downloadMember'],
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'userManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    // 注册时间
    if (formQueryData.regTime && formQueryData.regTime.length) {
      formQueryData.regTimeStart = moment(formQueryData.regTime[0]).format('YYYY-MM-DD');
      formQueryData.regTimeEnd = moment(formQueryData.regTime[1]).format('YYYY-MM-DD');
    }
    return formQueryData;
  };
  reset = () => {
    this.props.form.resetFields();
  };
  componentDidMount() {
    this.props.getChild(this);
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/initSelect',
      payload: {},
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'userManage/setSearchInfo',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
    } = this.props;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const {
      initData: { utmTypes, parentUtmTypes, userRole, openAccount, openCert },
    } = this.props.userManage;
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="用户名" {...formItemConfig}>
                  {getFieldDecorator('username')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="推荐人" {...formItemConfig}>
                  {getFieldDecorator('spreadsUserName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="姓名" {...formItemConfig}>
                  {getFieldDecorator('truename')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="手机号" {...formItemConfig}>
                  {getFieldDecorator('mobile')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="角色" {...formItemConfig}>
                  {getFieldDecorator('roleId')(
                    // 用户角色1分包商2业主3渠道员工
                    <Select allowClear>
                      {userRole &&
                        userRole.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="邀请码" {...formItemConfig}>
                  {getFieldDecorator('userId')(<Input />)}
                </FormItem>
              </Col>

              <Col {...inputConfig}>
                <FormItem label="开户状态" {...formItemConfig}>
                  {getFieldDecorator('openAccount')(
                    <Select allowClear>
                      {openAccount &&
                        openAccount.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              {/*<Col {...inputConfig}>*/}
              {/*  <FormItem label="实名认证状态" {...formItemConfig}>*/}
              {/*  {getFieldDecorator('openCert')(*/}
              {/*    <Select allowClear>*/}
              {/*      {*/}
              {/*        openCert && openCert.map(item => <Option key={item.key} value={item.value}>{item.title}</Option>)*/}
              {/*      }*/}
              {/*    </Select>*/}
              {/*  )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
              <Col {...inputConfig}>
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('openStatus')(
                    <Select allowClear>
                      <Option value={0}>启用</Option>
                      <Option value={1}>禁用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>
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

              {/*<Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>*/}
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
              <Col {...inputConfig}>
                <FormItem label="注册时间" {...formItemConfig}>
                  {getFieldDecorator('regTime')(<RangePicker />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="会员等级" {...formItemConfig}>
                  {getFieldDecorator('grade')(
                    <Select allowClear>
                      <Option value={0}>普通会员</Option>
                      <Option value={1}>白银会员</Option>
                      <Option value={2}>黄金会员</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="完善通讯地址" {...formItemConfig}>
                  {getFieldDecorator('addressStatus')(
                    <Select allowClear>
                      <Option value={0}>否</Option>
                      <Option value={1}>是</Option>
                    </Select>
                  )}
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
