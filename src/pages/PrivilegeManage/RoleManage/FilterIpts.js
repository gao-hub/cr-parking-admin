import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form,
  DatePicker,
  TreeSelect
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';

const FormItem = Form.Item
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'
const Option = Select.Option;

@connect()

@Form.create()

export default class FilterIpts extends Component {
  formSubmit = async (e) => {
    await this.props.dispatch({
      type: 'RoleManage/setSearchInfo',
      payload: this.getFormValue(),
    })
    this.props.getRoleList(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    return formQueryData;
  }
  reset = () => {
    this.props.form.resetFields()
    // this.formSubmit()
  }
  componentDidMount () {
    // this.props.child(this, 'child')
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'RoleManage/setSearchInfo',
      payload: {},
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formConfig = {
      labelCol:  { span: 7 },
      wrapperCol: { span: 17 }
    }
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col xxl={5} md={6}>
                <FormItem label="角色名称" {...formConfig}>
                  {getFieldDecorator('roleName')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col xxl={5} md={6}>
                <FormItem label="角色状态" {...formConfig}>
                  {getFieldDecorator('status')(
                    <Select
                      allowClear={true}
                    >
                      <Option value="0">正常</Option>
                      <Option value="1">停用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xxl={{ span: 4}} md={{ span: 6}}>
                <Button onClick={this.formSubmit} type="primary">搜索</Button>
                <Button onClick={this.reset} style={{ marginLeft: 8 }}>清空</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}
