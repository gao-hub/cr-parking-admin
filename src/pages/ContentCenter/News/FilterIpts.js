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

@connect(({ newsManage }) => ({
  newsManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'newsManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.updateTime && formQueryData.updateTime.length) {
      formQueryData.updateTimeStart = moment(formQueryData.updateTime[0]).format('YYYY-MM-DD');
      formQueryData.updateTimeEnd = moment(formQueryData.updateTime[1]).format('YYYY-MM-DD');
      delete formQueryData['updateTime'];
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
      type: 'newsManage/initSelect',
      payload: {},
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'newsManage/setSearchInfo',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
      newsManage
    } = this.props;
    const { initData : {newsType, newsStatus} } = newsManage
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              {/*
                <Col {...inputConfig}>
                <FormItem label="" {...formItemConfig}>
                  {getFieldDecorator('id')(<Input />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>
                <FormItem label="时间" {...formItemConfig}>
                  {getFieldDecorator('newsDate')(<Input />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>
                <FormItem label="封面图" {...formItemConfig}>
                  {getFieldDecorator('newPic')(<Input />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>
                <FormItem label="文章内容" {...formItemConfig}>
                  {getFieldDecorator('newsContent')(<Input />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>
                <FormItem label="备注" {...formItemConfig}>
                  {getFieldDecorator('remark')(<Input />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>
                <FormItem label="创建人ID" {...formItemConfig}>
                  {getFieldDecorator('createBy')(<Input />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>
                <FormItem label="创建时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(<Input />)}
                </FormItem>
              </Col>
              <Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>
                <FormItem label="更新人ID" {...formItemConfig}>
                  {getFieldDecorator('updateBy')(<Input />)}
                </FormItem>
              </Col>
              */}
              <Col {...inputConfig}>
                <FormItem label="文章类别" {...formItemConfig /* 1楼盘发布2新闻资讯3官方公告 */}>
                  {getFieldDecorator('newsType')(
                    <Select allowClear>
                      {newsType &&
                        newsType.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="文章标题" {...formItemConfig}>
                  {getFieldDecorator('newsTitle')(<Input />)}
                </FormItem>
              </Col>

              <Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>
                <FormItem label="状态" {...formItemConfig /* 1启用，0禁用 */}>
                  {getFieldDecorator('newsStatus')(
                    <Select allowClear>
                      {newsStatus &&
                        newsStatus.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col style={searchWholeState ? { display: 'none' } : {}} {...inputConfig}>
                <FormItem label="更新时间" {...formItemConfig}>
                  {getFieldDecorator('updateTime')(<RangePicker />)}
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
