import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Radio } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect(({ exchangeRecord, loading }) => ({
  exchangeRecord,
  loading: loading.effects['exchangeRecord/sendGoods'],
}))
export default class SendGoods extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    mode: '', // 发货方式
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
          type: 'exchangeRecord/sendGoods',
          payload: values,
        });
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setVisible(false)
          this.props.getList(currPage, pageSize);
        } else message.error(res.statusDesc)
      }
    });
  };

  render() {
    const { form: { getFieldDecorator }, loading } = this.props;
    const { mode } = this.state;
    const formConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <Modal
        title='发货'
        visible={this.state.visible}
        onOk={this.handleOk}
        destroyOnClose
        maskClosable={false}
        confirmLoading={loading}
        onCancel={() => this.setVisible(false)}
      >
        <Form>
          <FormItem label='请选择发货方式' {...formConfig}>
            {
              getFieldDecorator('deliveryType', {
                rules: [{ required: true, message: '请选择发货方式', },
                ],
              })(
                <Radio.Group onChange={this.changeMode}>
                  <Radio value={1}>物流</Radio>
                  <Radio value={2}>送货上门</Radio>
                </Radio.Group>,
              )
            }
          </FormItem>
          {
            mode === 1 && (
              <FormItem label='物流单号' {...formConfig}>
                {
                  getFieldDecorator('deliveryId',
                    {
                      rules: [{ required: true, message: '请输入物流单号' }],
                    })(
                    <Input placeholder='请输入'></Input>,
                  )
                }
                <div style={{ color: 'gray', marginTop: '10px' }}>
                  确认供应商已发货，并填写物流信息。
                </div>
              </FormItem>
            )
          }
          {
            mode === 2 && (
              <div style={{ color: 'gray', marginTop: '10px' }}>
                选择送货上门，app将不会显示物流信息。
              </div>
            )
          }
        </Form>
      </Modal>
    );
  }
}
