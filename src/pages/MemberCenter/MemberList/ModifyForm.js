import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload'

const FormItem = Form.Item;

@Form.create()
@connect(({ userManage, loading }) => ({
  userManage,
  submitLoading: loading.effects['userManage/statusChangeManage']
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      fileList: [],
      dataInfo: {}
    };
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'userManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, userManage: { modifyInfoData } } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await this.props.dispatch({
          type: 'userManage/statusChangeManage',
          payload: {
            ...values,
            userId: this.state.dataInfo.userId,
          }
        })
        if (res && res.status === 1) {
          message.success('修改成功')
          this.changeVisible(false)
          this.props.getList(this.props.currPage, this.props.pageSize);
        }else{
          message.error(res.statusDesc)
        }
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);
  }
  render() {
    const { form: { getFieldDecorator }, userManage: { modifyInfoData } } = this.props;
    const { dataInfo } = this.state
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={'修改手机号'}
        // title={modifyInfoData.id ? '修改' : '添加'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        confirmLoading={this.props.submitLoading ? true : false}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem
            label="当前手机号"
            {...formConfig}
          >
            <span>{dataInfo.mobile}</span>
          </FormItem>
          <FormItem
            label="新手机号"
            required
            {...formConfig}
          >
            {getFieldDecorator('mobile', {
              rules: [{
                validator: (rule, val, cb) => {
                  if (val == null || val == '') cb('请输入手机号')
                  else if (!(val).toString().match(/^1[3456789]\d{9}$/)) cb('请输入正确的手机号')
                  else if (val == dataInfo.mobile) cb('两次输入的手机号重复')
                  else cb()
                }
              }],
              // initialValue: dataInfo && dataInfo.mobile
            })(
              <Input placeholder={'请输入新手机号'} />
            )}
          </FormItem>
          <FormItem
            label="备注"
            {...formConfig}
          >
            {getFieldDecorator('remark', {
            })(
              <Input placeholder={'请输入备注'} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
