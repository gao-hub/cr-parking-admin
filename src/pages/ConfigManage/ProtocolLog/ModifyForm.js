import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ protocolLogManage, loading }) => ({
  protocolLogManage,
  submitLoading: loading.effects['protocolLogManage/modifyManage']
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
        type: 'protocolLogManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, protocolLogManage: { modifyInfoData } } = this.props;
    form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        let res
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'protocolLogManage/modifyManage',
            payload: {
              ...values,
              id: this.props.protocolLogManage.modifyInfoData.id,
            }
          })
        } else {
          res = await dispatch({
            type: 'protocolLogManage/addManage',
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
    const { form: { getFieldDecorator }, protocolLogManage: { modifyInfoData } } = this.props;
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
            label="id"
            {...formConfig}
          >
            {getFieldDecorator('id', {
              rules: [{ required: true, message: '请输入id' }],
              initialValue: modifyInfoData && modifyInfoData.id
            })(
              <Input placeholder={'请输入id'} />
            )}
          </FormItem>
          <FormItem
            label="协议id"
            {...formConfig}
          >
            {getFieldDecorator('protocolId', {
              rules: [{ required: true, message: '请输入协议id' }],
              initialValue: modifyInfoData && modifyInfoData.protocolId
            })(
              <Input placeholder={'请输入协议id'} />
            )}
          </FormItem>
          <FormItem
            label="协议模板名称"
            {...formConfig}
          >
            {getFieldDecorator('protocolName', {
              rules: [{ required: true, message: '请输入协议模板名称' }],
              initialValue: modifyInfoData && modifyInfoData.protocolName
            })(
              <Input placeholder={'请输入协议模板名称'} />
            )}
          </FormItem>
          <FormItem
            label="版本号"
            {...formConfig}
          >
            {getFieldDecorator('versionNumber', {
              rules: [{ required: true, message: '请输入版本号' }],
              initialValue: modifyInfoData && modifyInfoData.versionNumber
            })(
              <Input placeholder={'请输入版本号'} />
            )}
          </FormItem>
          <FormItem
            label="操作（0.创建1.修改2.删除）"
            {...formConfig}
          >
            {getFieldDecorator('operation', {
              rules: [{ required: true, message: '请输入操作（0.创建1.修改2.删除）' }],
              initialValue: modifyInfoData && modifyInfoData.operation
            })(
              <Input placeholder={'请输入操作（0.创建1.修改2.删除）'} />
            )}
          </FormItem>
          <FormItem
            label="创建者"
            {...formConfig}
          >
            {getFieldDecorator('createBy', {
              rules: [{ required: true, message: '请输入创建者' }],
              initialValue: modifyInfoData && modifyInfoData.createBy
            })(
              <Input placeholder={'请输入创建者'} />
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
            label="更新者"
            {...formConfig}
          >
            {getFieldDecorator('updateBy', {
              rules: [{ required: true, message: '请输入更新者' }],
              initialValue: modifyInfoData && modifyInfoData.updateBy
            })(
              <Input placeholder={'请输入更新者'} />
            )}
          </FormItem>
          <FormItem
            label="更新时间"
            {...formConfig}
          >
            {getFieldDecorator('updateTime', {
              rules: [{ required: true, message: '请输入更新时间' }],
              initialValue: modifyInfoData && modifyInfoData.updateTime
            })(
              <Input placeholder={'请输入更新时间'} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
