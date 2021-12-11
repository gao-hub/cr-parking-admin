import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ msgTemplateManage, loading }) => ({
  msgTemplateManage,
  submitLoading: loading.effects['msgTemplateManage/modifyManage']
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
        type: 'msgTemplateManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, msgTemplateManage: { modifyInfoData } } = this.props;
    form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        let res
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'msgTemplateManage/modifyManage',
            payload: {
              ...values,
              id: this.props.msgTemplateManage.modifyInfoData.id,
            }
          })
        } else {
          res = await dispatch({
            type: 'msgTemplateManage/addManage',
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
    const { form: { getFieldDecorator }, msgTemplateManage: { modifyInfoData } } = this.props;
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
            label="模板标识"
            {...formConfig}
          >
            {getFieldDecorator('tplCode', {
              rules: [{ required: true, message: '请输入模板标识' }],
              initialValue: modifyInfoData && modifyInfoData.tplCode
            })(
              <Input placeholder={'请输入模板标识'} />
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
            label="模板标题"
            {...formConfig}
          >
            {getFieldDecorator('tplTitle', {
              rules: [{ required: true, message: '请输入模板标题' }],
              initialValue: modifyInfoData && modifyInfoData.tplTitle
            })(
              <Input placeholder={'请输入模板标题'} />
            )}
          </FormItem>
          <FormItem
            label="是否开启 0关闭 1开启"
            {...formConfig}
          >
            {getFieldDecorator('openStatus', {
              rules: [{ required: true, message: '请输入是否开启 0关闭 1开启' }],
              initialValue: modifyInfoData && modifyInfoData.openStatus
            })(
              <Input placeholder={'请输入是否开启 0关闭 1开启'} />
            )}
          </FormItem>
          <FormItem
            label="模板内容"
            {...formConfig}
          >
            {getFieldDecorator('tplContent', {
              rules: [{ required: true, message: '请输入模板内容' }],
              initialValue: modifyInfoData && modifyInfoData.tplContent
            })(
              <Input placeholder={'请输入模板内容'} />
            )}
          </FormItem>
          <FormItem
            label="模板说明"
            {...formConfig}
          >
            {getFieldDecorator('tplDesc', {
              rules: [{ required: true, message: '请输入模板说明' }],
              initialValue: modifyInfoData && modifyInfoData.tplDesc
            })(
              <Input placeholder={'请输入模板说明'} />
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
