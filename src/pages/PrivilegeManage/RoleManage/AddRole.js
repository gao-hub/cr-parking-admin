import React, {PureComponent} from 'react';
import { Modal, Form, Input, message, TreeSelect, Select, Radio } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@Form.create()

@connect(({ RoleManage, loading }) => ({
  RoleManage,
}))

export default class AddRole extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      value: '0'
    }
  }
  changeVisible = (flag) => {
    this.setState({
      visible: !!flag,
    })
  }
  handleOk = async () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        const res = await dispatch({
          type: 'RoleManage/addRoleManage',
          payload: values
        })
        if (res && res.status === 1) {
          this.changeVisible(false)
          message.success(res.statusDesc)
          this.props.getRoleList(this.props.currPage, this.props.pageSize)
        } else message.error(res.statusDesc)
      }
    });
    
  }
  componentDidMount() {
    this.props.getChildData(this)
    // this.focusEditor();
  }

  renderContent = ()=>{
    const { getFieldDecorator } = this.props.form
    const formConfig = {
      labelCol:  { span: 5 },
      wrapperCol: { span: 18 }
    }
    return(
      <Form>
          <FormItem
            label="角色名称"
            {...formConfig}
          >
            {getFieldDecorator('roleName', {
              rules: [{ required: true, message: '请输入角色名称' }],
            })(
              <Input placeholder={'请输入角色名称'} />
            )}
          </FormItem>
          <FormItem
            label="角色说明"
            {...formConfig}
          >
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入角色说明' }],
            })(
              <Input placeholder={'请输入角色说明'} />
            )}
          </FormItem>
          <FormItem
            label="角色状态"
            {...formConfig}
          >
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择角色状态' }],
              initialValue: this.state.value
            })(
              <RadioGroup>
                <Radio value='0'>正常</Radio>
                <Radio value='1'>停用</Radio>
              </RadioGroup>
            )}
          </FormItem>
      </Form>
    )
  }

  render() {
    return (
      <Modal
        title= '添加角色'
        visible={this.state.visible}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        { this.renderContent() }
      </Modal>
    )
  }
}