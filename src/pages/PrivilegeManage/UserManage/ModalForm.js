import React, { PureComponent, Fragment } from 'react';
import {
  Card,
  Form,
  Input,
  Icon,
  Button,
  Modal,
  message,
  Radio,
  Select
} from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@connect(({ manageMember }) => ({
  manageMember, 
}))

@Form.create()
export default class IndexComponent extends PureComponent {
  static defaultProps = {
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {

    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  renderContent = () => {
    const { form, modalType } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { modifyInfo, roleList } = this.props.manageMember;
    const formItemLayout = {
      labelCol:  { span: 5 },
      wrapperCol: { span: 16 }
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <Form>
            <FormItem {...formItemLayout} label={'用户名'}>
              {getFieldDecorator('userName', {
                rules: [
                  {
                    required: true,
                    validator: (rule, val, cb) => {
                      if (!val) {
                        cb('请输入用户名')
                        return
                      }
                      if (val.length < 5 || !val.match(/^[a-zA-Z0-9]{5,15}$/)) {
                        cb('请输入5-15位的字母和数字')
                        return
                      }
                      cb()
                    }
                  },
                ],
                initialValue: modifyInfo.userName && modifyInfo.userName
              })(<Input disabled={modalType === 2} maxLength={15} placeholder={'请输入用户名'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'用户姓名'}>
              {getFieldDecorator('trueName', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户姓名',
                  },
                ],
                initialValue: modifyInfo.trueName && modifyInfo.trueName
              })(<Input maxLength={10} placeholder={'请输入用户姓名'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'手机号'}>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                ],
                initialValue: modifyInfo.mobile && modifyInfo.mobile
              })(<Input maxLength={11} placeholder={'请输入手机号'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'角色'}>
              {getFieldDecorator('role', {
                rules: [
                  {
                    required: true,
                    message: '请选择角色',
                  },
                ],
                initialValue: modifyInfo.role ? Number(modifyInfo.role) : undefined
              })(
                <Select
                  allowClear
                  placeholder="请选择角色"
                >
                  {
                    roleList && roleList.length && roleList.map(item => {
                      return <Option key={item.roleId} value={item.roleId}>{item.roleName}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'状态'}>
              {getFieldDecorator('status', {
                rules: [
                  {
                    required: true,
                    message: '请选择状态',
                  },
                ],
                initialValue: modifyInfo.status ? modifyInfo.status : '0'
              })(
                <RadioGroup>
                  <Radio value='0'>启用</Radio>
                  <Radio value='1'>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Form>
        </Card>
      </Fragment>
    )
  };

  onOk = (e)=>{
    const { dispatch, form, getManageMemberList, modalType } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async(err, values) => {
      if (err) return
      if (!err) {
        let res = {}
        if(modalType === 2) {
          res = await dispatch({
            type: 'manageMember/changeManageMember',
            payload: {
              ...values,
              userId: this.props.id
            }
          })
        } else {
          res = await dispatch({
            type: 'manageMember/addandmodify',
            payload: {
              ...values
            }
          })
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.props.handleUpdateModalVisible(false)
          getManageMemberList()
        } else message.error(res.statusDesc)
      }
    });
  }

  

  render() {
    const { updateModalVisible, handleUpdateModalVisible, modalType } = this.props;

    return (
      <Modal
        width={550}
        destroyOnClose
        title={ modalType == 1 ? '添加用户' : '修改用户'}
        visible={updateModalVisible}
        onOk={this.onOk}
        onCancel={() => handleUpdateModalVisible(false)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}