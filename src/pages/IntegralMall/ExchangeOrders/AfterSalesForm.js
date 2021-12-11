import React, { PureComponent } from 'react';
import { Modal, Form, Row, Col, Input, message, Button } from 'antd';
import { connect } from 'dva';
import { regNum } from '@/utils/utils';


const FormItem = Form.Item;


@Form.create()
@connect(({ ExchangeOrders, loading }) => ({
  ExchangeOrders,
  submitLoading: loading.effects['ExchangeOrders/modifyManage'],
}))
class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      loading: false
    };
  }

  componentDidMount() {
    const {
      dispatch,
      salesId
    } = this.props;

    dispatch({
      type: 'ExchangeOrders/getModifyInfo',
      payload: {
        id: salesId
      }
    })
  }

  handleOk = async () => {
    const {
      dispatch,
      form,
      onCancel,
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const { ExchangeOrders = {}, getList, currPage, pageSize } = this.props;
        this.setState({ loading: true });
        const res = await dispatch({
          type: 'ExchangeOrders/modifyManage',
          payload: {
            ...values,
            id: ExchangeOrders.modifyInfoData.id,
          },
        });
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setState({ loading: false });
          getList(currPage, pageSize);
          onCancel();
        } else message.error(res.statusDesc);
      }
    });
  };

  handleCancel = () => {
    const {
      onCancel,
      dispatch,
    } = this.props;
    dispatch({
      type: 'ExchangeOrders/setModifyInfo',
      payload: {},
    });
    onCancel();
  }


  render() {
    const {
      form = {},
      ExchangeOrders: { modifyInfoData },
    } = this.props;
    const { getFieldDecorator } = form;
    const formConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const formTextConfig = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const {
      visible = false,
      loading
    } = this.state;
    return (
      <Modal
        title="售后"
        width={800}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={visible}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            确定
          </Button>,
        ]}
        maskClosable={false}
        destroyOnClose
      >
        <Form>
          <h4 style={{ fontWeight: 'bold' }}>订单信息</h4>
          <Row type="flex" justify="space-between">
            <Col span={12}>
              <FormItem label="商品名称" {...formTextConfig}>
                <span>{modifyInfoData.productName}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="兑换时间" {...formTextConfig}>
                <span>{modifyInfoData.createTime}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="实际支付" {...formTextConfig}>
                <span style={{ color: '#FF6600' }}>{modifyInfoData?.payIntegral}积分</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="订单状态" {...formTextConfig}>
                <span>{modifyInfoData.orderStatusStr}</span>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="退款积分" {...formConfig}>
            {getFieldDecorator('refundPayment', {
              rules: [{ required: true, validator: (rules, value, callback) => {
                if ((value??'') === '' ) {
                  callback('请输入退款积分')
                }
                if(value === '0'){
                  callback('请输入大于0的数')
                }
                if (!regNum.test(value)) {
                  callback('请输入正整数')
                }
                callback()
              } }],
              initialValue: modifyInfoData && modifyInfoData.payIntegral,
            })(<Input placeholder="请输入退款积分" maxLength={9} />)}
          </FormItem>

          <FormItem label="备注" {...formConfig}>
            {getFieldDecorator('refundRemark', {
              rules: [{ required: false, message: '请输入备注' }],
              initialValue: modifyInfoData && modifyInfoData.refundRemark,
            })(<Input placeholder="请输入备注" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Modify;
