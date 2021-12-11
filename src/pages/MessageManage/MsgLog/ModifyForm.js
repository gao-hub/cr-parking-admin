import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ msgLogManage, loading }) => ({
  msgLogManage,
  submitLoading: loading.effects['msgLogManage/modifyManage']
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
        type: 'msgLogManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, msgLogManage: { modifyInfoData } } = this.props;
    form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        let res
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'msgLogManage/modifyManage',
            payload: {
              ...values,
              id: this.props.msgLogManage.modifyInfoData.id,
            }
          })
        } else {
          res = await dispatch({
            type: 'msgLogManage/addManage',
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
    const { form: { getFieldDecorator }, msgLogManage: { modifyInfoData } } = this.props;
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
            label="推送对象"
            {...formConfig}
          >
            {getFieldDecorator('msgTo', {
              rules: [{ required: true, message: '请输入推送对象' }],
              initialValue: modifyInfoData && modifyInfoData.msgTo
            })(
              <Input placeholder={'请输入推送对象'} />
            )}
          </FormItem>
          <FormItem
            label="模板id"
            {...formConfig}
          >
            {getFieldDecorator('tplId', {
              rules: [{ required: true, message: '请输入模板id' }],
              initialValue: modifyInfoData && modifyInfoData.tplId
            })(
              <Input placeholder={'请输入模板id'} />
            )}
          </FormItem>
          <FormItem
            label="模板名称"
            {...formConfig}
          >
            {getFieldDecorator('tplName', {
              rules: [{ required: true, message: '请输入模板名称' }],
              initialValue: modifyInfoData && modifyInfoData.tplName
            })(
              <Input placeholder={'请输入模板名称'} />
            )}
          </FormItem>
          <FormItem
            label="消息标题"
            {...formConfig}
          >
            {getFieldDecorator('msgTitle', {
              rules: [{ required: true, message: '请输入消息标题' }],
              initialValue: modifyInfoData && modifyInfoData.msgTitle
            })(
              <Input placeholder={'请输入消息标题'} />
            )}
          </FormItem>
          <FormItem
            label="消息内容"
            {...formConfig}
          >
            {getFieldDecorator('msgContent', {
              rules: [{ required: true, message: '请输入消息内容' }],
              initialValue: modifyInfoData && modifyInfoData.msgContent
            })(
              <Input placeholder={'请输入消息内容'} />
            )}
          </FormItem>
          <FormItem
            label="是否启用 0禁用 1启用"
            {...formConfig}
          >
            {getFieldDecorator('openStatus', {
              rules: [{ required: true, message: '请输入是否启用 0禁用 1启用' }],
              initialValue: modifyInfoData && modifyInfoData.openStatus
            })(
              <Input placeholder={'请输入是否启用 0禁用 1启用'} />
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
