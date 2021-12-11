import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Radio } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ exchangeRecord, loading }) => ({
  exchangeRecord,
  loading: loading.effects['exchangeRecord/editExpress'],
}))
export default class SendGoods extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
  };

  componentDidMount() {
    this.props.getChild(this);
  }

  setVisible = (visible) => {
    if (visible) {
      this.setState({
        mode: '',
      });
    }
    this.setState({
      visible,
    });
  };

  changeMode = e => {
    this.setState({
      mode: e.target.value,
    });
  };

  handleOk = () => {
    let { currPage, pageSize, loading, actionId } = this.props;
    if (loading) return;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        values.id = actionId;
        let res = await this.props.dispatch({
          type: 'exchangeRecord/editExpress',
          payload: values,
        });
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setVisible(false);
          this.props.getList(currPage, pageSize);
        }
      }
    });
  };

  render() {
    const { form: { getFieldDecorator }, deliveryId, loading } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };

    return (
      <Modal
        title='修改物流单号'
        visible={this.state.visible}
        onOk={this.handleOk}
        destroyOnClose
        maskClosable={false}
        confirmLoading={loading}
        onCancel={ () => this.setVisible(false)}
      >
        <Form>
          <FormItem label='当前物流单号' {...formConfig}>
            {deliveryId}
          </FormItem>
          <FormItem label='新物流单号' {...formConfig}>
            {
              getFieldDecorator('deliveryId',
                {
                  rules: [
                    { required: true, message: '新物流单号' },
                  ],
                })(
                <Input placeholder='请输入' />,
              )
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
