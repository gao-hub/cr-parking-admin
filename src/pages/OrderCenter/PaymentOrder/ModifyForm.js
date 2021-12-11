import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Upload, Radio } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const RadioGroup = Radio.Group

@Form.create()
@connect(({ paymentOrderManage, loading }) => ({
  paymentOrderManage,
  submitLoading: loading.effects['paymentOrderManage/modifyManage']
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      previewVisible: false,
      previewImage: null
    };
  }
  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'paymentOrderManage/setModifyInfo',
        payload: {}
      })
    }
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, paymentOrderManage: { modifyInfoData } } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'paymentOrderManage/modifyManage',
            payload: {
              ...values,
              id: this.props.paymentOrderManage.modifyInfoData.id,
              orderNo: this.props.paymentOrderManage.modifyInfoData.orderNo
            }
          })
        } else {
          res = await dispatch({
            type: 'paymentOrderManage/addManage',
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

  // 图片预览
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  
  componentDidMount() {
    this.props.getChildData(this);
  }
  render() {
    const { form: { getFieldDecorator }, paymentOrderManage: { modifyInfoData } } = this.props;
    const { previewVisible, previewImage } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const fileList = modifyInfoData.fileList || []
    return (
      <Modal
        title={'订单处理'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        // okText={'支付成功'}
        // cancelText={'支付失败'}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem
            label="持卡人姓名"
            {...formConfig}
          >
            <span>{modifyInfoData && modifyInfoData.payName}</span>
          </FormItem>
          <FormItem
            label="付款银行"
            {...formConfig}
            >
            <span>{modifyInfoData && modifyInfoData.payBank}</span>
          </FormItem>
          <FormItem
            label="付款银行卡号"
            {...formConfig}
            >
            <span>{modifyInfoData && modifyInfoData.payCard}</span>
          </FormItem>
          <FormItem
            label="备注"
            {...formConfig}
            >
            <span>{modifyInfoData && modifyInfoData.remarks}</span>
          </FormItem>
          <FormItem
            label="上传图片"
            {...formConfig}
          >
            <Upload
              listType="picture-card"
              disabled
              onPreview={this.handlePreview}
              fileList={fileList}
            ></Upload>
          </FormItem>
          <FormItem
            label="支付状态"
            {...formConfig}
          >
            {getFieldDecorator('auditValue', {
              rules: [{ required: true, message: '请选择支付状态' }]
            })(
              <RadioGroup>
                <Radio value={1}>支付成功</Radio>
                <Radio value={0}>支付失败</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Form>
        <Modal visible={previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Modal>
    );
  }
}
