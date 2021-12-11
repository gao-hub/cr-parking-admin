import React, { Component, Fragment  } from 'react'
import {
  Form,
  Row,
  Col,
  Divider,
  Card,
  Timeline,
  Radio,
  Input,
  Button,
  Icon,
  message,
  InputNumber, Modal,
} from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload'
import { queryURL } from '@/utils/utils'
import router from 'umi/router';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const confirmRadio=[
  {
    value:0,
    text:'成功'
  },
  {
    value:1,
    text:'失败退款'
  }
]
@Form.create()

@connect(({ tripOrderManage }) => ({
  tripOrderManage
}))

export default class Review extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      value: 1,
      textArea:'',
      confirmLoading:false
    }
  }
  async componentWillReceiveProps(nextProps) {
    if (this.props.infoData.id !== nextProps.infoData.id&& nextProps.isShow){
      const { dispatch ,infoData:{id}} = nextProps;
      dispatch({
        type: 'tripOrderManage/getNoPermissionOrderInfo',
        payload: {id},
      });
    }
  }
  onChangeTextArea=(e)=>{
    this.state.textArea=e.target.value
  }
  saveBtn = (e) => {
    const { dispatch, form,infoData:{id} } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        this.setState({
          confirmLoading:true
        })
        Object.assign(values,{id:id})
        let res = await dispatch({
          type: 'tripOrderManage/confirmManage',
          payload: {
              ...values
          }
        })
        if (res && res.status === 1) {
          this.props.callback()
          this.setState({
            confirmLoading:false
          })
          this.resetForm()
          dispatch({
            type: 'tripOrderManage/getNoPermissionOrderInfo',
            payload: {id},
          });
          message.success(res.statusDesc)
        } else {
          this.setState({
            confirmLoading:false
          })
          message.error(res.statusDesc)}
      }
    });
  }
  resetForm(){
    const {  form } = this.props;
    form.resetFields()
  }
  render() {
    const { noPermissionOrderInfoData:OrderInfoData ,initData: { orderStatus } } = this.props.tripOrderManage;
    const { getFieldDecorator,getFieldValue } = this.props.form
    const max=OrderInfoData&&(OrderInfoData.payment>0)?parseInt(OrderInfoData.payment):0
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    }

    const confirmInfo = [
      {
        key: 0,
        title: '产品名称',
        value: OrderInfoData&&OrderInfoData.travelProduct&&OrderInfoData.travelProduct.productName
      },
      {
        key: 1,
        title: '实际支付',
        value: OrderInfoData&&OrderInfoData.payment+'元',
      },
      {
        key: 2,
        title: '购买数量',
        value: OrderInfoData&&OrderInfoData.orderCount,
      },
      {
        key: 4,
        title: '使用时间',
        value: OrderInfoData&&OrderInfoData.tripTime,
      },
      {
        key: 5,
        title: '当前状态',
        value:OrderInfoData&&OrderInfoData.orderStatus
          &&orderStatus&& (orderStatus.filter(item=> item.value=== OrderInfoData.orderStatus).length?
          orderStatus.filter(item=> item.value=== OrderInfoData.orderStatus)[0].title:''),
      },
      {
        key: 6,
        title: '用户名',
        value: OrderInfoData&&OrderInfoData.buyerName,
      },
      {
        key: 7,
        title: '购买时间',
        value: OrderInfoData&&OrderInfoData.finishTime,
      },
    ]
    return (
      <Fragment>
        <Modal
          title="二次确认"
          visible={this.props.isShow}
          onCancel={() => {
            this.props.callback();
            this.resetForm();
          }}
          footer={[
            <Button key="back" onClick={() => {
              this.props.callback();
              this.resetForm();
            }}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={this.state.confirmLoading} onClick={this.saveBtn}>
              确定
            </Button>,
          ]}
          confirmLoading={this.confirmLoading}
        >
          <Card bordered={false}>
            <Form>
              <Row gutter={24}>
                      {
                        confirmInfo.map(item => (
                          <Col span={24} key={item.key}>
                            <FormItem
                              label={item.title}
                              {...formItemLayout}
                            >
                              <span>{item.value}</span>
                            </FormItem>
                          </Col>
                        ))
                      }
              </Row>
              <Divider></Divider>
              <Row>
                <Col span={20}>
                  <FormItem
                    label='二次确认'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('refundType', {
                      rules:[{ required: true, message: '必填项' }]
                    })(
                      <Radio.Group onChange={this.onChange} >
                        {confirmRadio.map(item=>
                          item && <Radio value={item.value}>{item.text}</Radio>
                        )}
                      </Radio.Group>
                    )}

                  </FormItem>
                  {
                    getFieldValue('refundType')?
                    (<FormItem
                      label='退款金额'
                      {...formItemLayout}
                    >
                      {getFieldDecorator('refundPayment', {
                        rules:[{ required: true, message: '必填项' }],
                        initialValue:OrderInfoData&&(OrderInfoData.payment>0)?parseInt(OrderInfoData.payment):0
                      })(
                        <InputNumber style={{width:'100%'}} max={ max }/>
                      )}

                    </FormItem>):null
                  }
                  <FormItem
                    label='备注'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('refundRemark', {
                      rules:[
                        { required: getFieldValue('refundType'), message: '必填项' },
                        {max:50,message:'不超过50个字'}]
                    })(
                      <TextArea placeholder="" maxLength={50} allowClear onChange={this.onChangeTextArea} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
        </Card>
        </Modal>
      </Fragment>
    )
  }
}
