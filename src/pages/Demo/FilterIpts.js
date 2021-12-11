import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form,
  DatePicker,
  TreeSelect,
  Dropdown,
  Menu
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils'
const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption()

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
    const menu = (
      <Menu>
        <Menu.Item key="1">
        	<Button type="primary" onClick={this.formSubmit}>
						清空
					</Button>
        </Menu.Item>
        <Menu.Item key="2">
        	<Button type="primary" onClick={this.formSubmit}>
						展开
					</Button>
        </Menu.Item>
      </Menu>
    );
    console.log(inputConfig, '=====zhaiai')
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
					<Form>
						<Row gutter={24} type="flex">
							<Col {...colConfig}>
								<Row gutter={24} type="flex">
									<Col {...inputConfig}>
										<FormItem label="角色名称" {...formItemConfig}>
											{getFieldDecorator('roleName')(
												<Input />
											)}
										</FormItem>
									</Col>
									<Col {...inputConfig}>
										<FormItem label="角色状态" {...formItemConfig}>
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
									<Col {...inputConfig}>
										<FormItem label="角色状态" {...formItemConfig}>
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
									<Col {...inputConfig}>
										<FormItem label="角色状态" {...formItemConfig}>
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
									{
										this.props.searchWholeState ? 
											<>
											<Col {...inputConfig}>
												<FormItem label="角色状态" {...formItemConfig}>
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
											<Col {...inputConfig}>
												<FormItem label="角色状态" {...formItemConfig}>
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
											<Col {...inputConfig}>
												<FormItem label="角色状态" {...formItemConfig}>
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
											<Col {...inputConfig}>
												<FormItem label="角色状态" {...formItemConfig}>
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
											<Col {...inputConfig}>
												<FormItem label="角色状态" {...formItemConfig}>
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
											<Col {...inputConfig}>
												<FormItem label="角色状态" {...formItemConfig}>
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
											<Col {...inputConfig}>
												<FormItem label="角色状态" {...formItemConfig}>
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
											<Col {...inputConfig}>
												<FormItem label="角色状态" {...formItemConfig}>
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
											<Col {...inputConfig}>
												<FormItem label="角色状态" {...formItemConfig}>
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
										</> : null
									}
									<Col {...searchConfig}>
										<FormItem {...formItemConfig}>
											<Button onClick={this.formSubmit} type="primary">搜索</Button>
											<Button onClick={this.reset} style={{ marginLeft: 8 }}>清空</Button>
										</FormItem>
									</Col>
								</Row>
							</Col>
						</Row>
          </Form>
        </div>
      </div>
    )
  }
}
