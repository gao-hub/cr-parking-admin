import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
const { inputConfig, formItemConfig, searchConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ userRelease }) => ({
  userRelease,
}))
@Form.create()
export default class FilterIpts extends Component {
  state = {
    // 作品类型
    workTypeRadio: [
      {
        key: '1',
        value: 1,
        title: '文章',
      },
      {
        key: '2',
        value: 2,
        title: '图片',
      },
      {
        key: '3',
        value: 3,
        title: '视频',
      },
    ],
  };
  componentDidMount() {
    this.props.getChild(this);
  }
  // 搜索
  formSubmit = async e => {
    await this.props.dispatch({
      type: 'userRelease/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };

  // 获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format('YYYY-MM-DD');
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format('YYYY-MM-DD');
    }
    delete formQueryData['createTime'];
    return formQueryData;
  };

  // 清空
  reset = async () => {
    this.props.form.resetFields();
  };

  disabledDate = current => {
    return current <= moment().subtract(30, 'days') || current > moment().endOf('day');
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { workTypeRadio } = this.state;
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
                <FormItem label="作品标题" {...formItemConfig}>
                  {getFieldDecorator('articleTitle')(
                    <Input maxLength={20} placeholder="请输入作品标题" />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="用户昵称" {...formItemConfig}>
                  {getFieldDecorator('nickName')(<Input placeholder="请输入用户昵称" />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="用户名" {...formItemConfig}>
                  {getFieldDecorator('username')(<Input placeholder="请输入用户名" />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="作品类型" {...formItemConfig}>
                  {getFieldDecorator('articleType')(
                    <Select allowClear placeholder={'请选择作品类型'}>
                      {Array.isArray(workTypeRadio) &&
                        workTypeRadio.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col {...inputConfig}>
                <FormItem label="创建时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(
                    <RangePicker format={dateFormat} disabledDate={this.disabledDate} />
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
