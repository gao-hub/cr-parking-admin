import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ userAccountManage, loading }) => ({
  userAccountManage,
  submitLoading: loading.effects['userAccountManage/modifyManage']
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
    };
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'userAccountManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, userAccountManage: { modifyInfoData } } = this.props;
    form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        let res
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'userAccountManage/modifyManage',
            payload: {
              ...values,
              id: this.props.userAccountManage.modifyInfoData.id,
            }
          })
        } else {
          res = await dispatch({
            type: 'userAccountManage/addManage',
            payload: values
          })
        }
        if (res && res.status === 1) {
          this.changeVisible(false)
          message.success(res.statusDesc)
          this.props.getList(this.props.currPage, this.props.pageSize)
        } else message.error(res.statusDesc)
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);
  }
  render() {
    const { form: { getFieldDecorator }, userAccountManage: { modifyInfoData } } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={modifyInfoData.id ? '修改' : '添加'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem
            label=""
            {...formConfig}
          >
            {getFieldDecorator('id', {
              rules: [{ required: true, message: '请输入' }],
              initialValue: modifyInfoData && modifyInfoData.id
            })(
              <Input placeholder={'请输入'} />
            )}
          </FormItem>
          <FormItem
            label="用户id"
            {...formConfig}
          >
            {getFieldDecorator('userId', {
              rules: [{ required: true, message: '请输入用户id' }],
              initialValue: modifyInfoData && modifyInfoData.userId
            })(
              <Input placeholder={'请输入用户id'} />
            )}
          </FormItem>
          <FormItem
            label="用户名"
            {...formConfig}
          >
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名' }],
              initialValue: modifyInfoData && modifyInfoData.userName
            })(
              <Input placeholder={'请输入用户名'} />
            )}
          </FormItem>
          <FormItem
            label="ACCP用户编号"
            {...formConfig}
          >
            {getFieldDecorator('accpUserno', {
              rules: [{ required: true, message: '请输入ACCP用户编号' }],
              initialValue: modifyInfoData && modifyInfoData.accpUserno
            })(
              <Input placeholder={'请输入ACCP用户编号'} />
            )}
          </FormItem>
          <FormItem
            label="可用金额"
            {...formConfig}
          >
            {getFieldDecorator('availableBalance', {
              rules: [{ required: true, message: '请输入可用金额' }],
              initialValue: modifyInfoData && modifyInfoData.availableBalance
            })(
              <Input placeholder={'请输入可用金额'} />
            )}
          </FormItem>
          <FormItem
            label="冻结金额"
            {...formConfig}
          >
            {getFieldDecorator('frozenBalance', {
              rules: [{ required: true, message: '请输入冻结金额' }],
              initialValue: modifyInfoData && modifyInfoData.frozenBalance
            })(
              <Input placeholder={'请输入冻结金额'} />
            )}
          </FormItem>
          <FormItem
            label="银行账户金额"
            {...formConfig}
          >
            {getFieldDecorator('bankAccountBalance', {
              rules: [{ required: true, message: '请输入银行账户金额' }],
              initialValue: modifyInfoData && modifyInfoData.bankAccountBalance
            })(
              <Input placeholder={'请输入银行账户金额'} />
            )}
          </FormItem>
          <FormItem
            label="删除标志（0代表存在 1代表删除）"
            {...formConfig}
          >
            {getFieldDecorator('delFlag', {
              rules: [{ required: true, message: '请输入删除标志（0代表存在 1代表删除）' }],
              initialValue: modifyInfoData && modifyInfoData.delFlag
            })(
              <Input placeholder={'请输入删除标志（0代表存在 1代表删除）'} />
            )}
          </FormItem>
          <FormItem
            label="创建人ID"
            {...formConfig}
          >
            {getFieldDecorator('createBy', {
              rules: [{ required: true, message: '请输入创建人ID' }],
              initialValue: modifyInfoData && modifyInfoData.createBy
            })(
              <Input placeholder={'请输入创建人ID'} />
            )}
          </FormItem>
          <FormItem
            label="修改人ID"
            {...formConfig}
          >
            {getFieldDecorator('updateBy', {
              rules: [{ required: true, message: '请输入修改人ID' }],
              initialValue: modifyInfoData && modifyInfoData.updateBy
            })(
              <Input placeholder={'请输入修改人ID'} />
            )}
          </FormItem>
          <FormItem
            label="创建时间"
            {...formConfig}
          >
            {getFieldDecorator('createTime', {
              rules: [{ required: true, message: '请输入创建时间' }],
              initialValue: modifyInfoData && modifyInfoData.createTime
            })(
              <Input placeholder={'请输入创建时间'} />
            )}
          </FormItem>
          <FormItem
            label="最后修改时间"
            {...formConfig}
          >
            {getFieldDecorator('updateTime', {
              rules: [{ required: true, message: '请输入最后修改时间' }],
              initialValue: modifyInfoData && modifyInfoData.updateTime
            })(
              <Input placeholder={'请输入最后修改时间'} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
