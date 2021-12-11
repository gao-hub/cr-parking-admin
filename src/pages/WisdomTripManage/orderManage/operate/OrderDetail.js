import React, { Component, Fragment } from 'react';
import {
  Form, Row, Col, Divider, Card, Timeline,
  Radio, Input, Button, Icon, message, Typography, Modal,
} from 'antd';
import Debounce from 'lodash-decorators/debounce';
import { connect } from 'dva';
import { queryURL, formatNumber } from '@/utils/utils';
import router from 'umi/router';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';
import styles from '../styles.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Paragraph } = Typography;

@Form.create()
@connect(({ tripOrderManage }) => ({
  tripOrderManage
}))
export default class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }
  @Debounce(500,{leading: true,trailing:false})
  saveBtn(e){
    const {
      dispatch,
      form,
      location: {
        query: { type },
      },
    } = this.props;
    if (type !== 'audit') {
      // dispatch(routerRedux.push({
      //   pathname: '/product/parking/list'
      // }))
      router.goBack();
      return;
    }
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
    });
  };

  async componentWillReceiveProps(nextProps) {
    if (this.props.infoData.id !== nextProps.infoData.id&& nextProps.isShow){
      const { dispatch ,infoData:{id}} = nextProps;
      dispatch({
        type: 'tripOrderManage/getOrderInfo',
        payload: {id},
      });
    }
  }

  componentWillUnmount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'tripOrderManage/getOrderInfo',
    //   payload: {},
    // });
  }
  render() {
    const { OrderInfoData ,initData: { orderStatus } } = this.props.tripOrderManage;
    // const {
    //   location: {
    //     query: { type, tag },
    //   },
    // } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const orderInfo=[
      {
        title:'订单时间',
       time:OrderInfoData&&OrderInfoData.finishTime,
       orderType:OrderInfoData&&OrderInfoData.orderStatus,
       orderTypeStr:OrderInfoData&&OrderInfoData.orderStatus
         &&orderStatus&&(orderStatus.filter(item=> item.value=== OrderInfoData.orderStatus).length?
         orderStatus.filter(item=> item.value=== OrderInfoData.orderStatus)[0].title:'')
      },
      {
        title:OrderInfoData&&OrderInfoData.travelProduct&&OrderInfoData.travelProduct.productName,
        orderTickets:OrderInfoData
          &&OrderInfoData.travelOrderTicket,
        contact:{
          name:OrderInfoData&&OrderInfoData.contactName,
          phone:OrderInfoData&&OrderInfoData.contactMobile
        },
        tourist:OrderInfoData && OrderInfoData.travelOrderContract,
        from:OrderInfoData&&OrderInfoData.stationName,
        remark:OrderInfoData&&OrderInfoData.remark
      }
    ]
    // 认购信息
    const ProductInfo = [
      {
        key: 0,
        title: '支付订单号',
        value: OrderInfoData && OrderInfoData.orderNo,
      },
      {
        key: 1,
        title: '出发地',
        value: OrderInfoData && OrderInfoData.travelProduct && OrderInfoData.travelProduct.desparturePlace,
      },
      {
        key: 2,
        title: '出发日期',
        value: OrderInfoData && OrderInfoData.tripTime,
      }
    ];

    return (
      <Fragment>
        <Modal
        title="详情"
        visible={this.props.isShow}
        style={{ width:'80%'}}
        onCancel={() => this.props.callback()}
        footer={null}
      >
        <Card bordered={false}>
<Form>
  <Row gutter={24}>
      <Col span={12}>
        <FormItem label={orderInfo[0].title} {...formItemLayout}>
          <span style={{ display: 'inline-block' }}>{orderInfo[0].time}</span>
        </FormItem>
      </Col>
    <Col span={12} style={{textAlign:'right'}}>
      <span style={{ display: 'inline-block', }}>
        {orderInfo[0].orderTypeStr}</span>
    </Col>
    <Divider></Divider>
    <p style={{ textAlign:'left' }}>{orderInfo[1].title}</p>

      {ProductInfo.map((item,ind) => (
        item &&
        <Col span={24} key={item.key}>
          <FormItem label={item.title} {...formItemLayout}>
            <span style={{ display: 'inline-block' }}>{item.value}</span>
          </FormItem>
        </Col>
      ))}
    <Divider></Divider>
    <h4 style={{ fontWeight: 'bold' }}>购买套餐</h4>
      {orderInfo[1].orderTickets &&
        orderInfo[1].orderTickets.map((item,index)=>
          (item&&<Row key={index}>
            <Col span={12}>
              <span style={{ display: 'inline-block' }}>{item.ticketName}</span>
            </Col>
            <Col span={12} style={{textAlign:'right'}}>
              <span style={{ display: 'inline-block', }}>
                <b>{item.ticketPrice}</b>*{item.ticketCount}</span>
            </Col>
          </Row>)
        )
      }
    <h4 style={{ fontWeight: 'bold' }}>游客信息</h4>
    <Row gutter={24}>
    {orderInfo[1].tourist
    &&orderInfo[1].tourist.map((item,index)=>(
      item &&<Col key={index}  className="gutter-row" span={24} style={{border:'1px solid #e1e1e1',margin:'0 8px'}}>
      <FormItem label='姓名' {...formItemLayout}>
        <span>{item.contactName}</span>
      </FormItem>
      <FormItem label='手机号' {...formItemLayout}>
        <Paragraph copyable>{item.contactMobile}</Paragraph>
      </FormItem>
      <FormItem label='身份证' {...formItemLayout}>
        <Paragraph copyable={{text:item.contactIdNo}}>{item.contactIdNo}</Paragraph>
      </FormItem>
    </Col>
    ))}
    </Row>
    <h4 style={{ fontWeight: 'bold' }}>联系人</h4>
    <Col span={24} >
      <FormItem label='姓名' {...formItemLayout}>
        <span>{orderInfo[1].contact.name}</span>
      </FormItem>
      <FormItem label='电话' {...formItemLayout}>
        <Paragraph copyable>{orderInfo[1].contact.phone}</Paragraph>
      </FormItem>
      <Divider></Divider>
    </Col>
    <Col span={12}>
      <h4 style={{ fontWeight: 'bold' }}>始发站</h4>
    </Col>
    <Col span={12} style={{textAlign:'right'}}>
      <span style={{ display: 'inline-block',textAlign:'right' }}>
        {orderInfo[1].from}</span>
    </Col>
    <Divider></Divider>
    <Col span={12}>
      <h4 style={{ fontWeight: 'bold' }}>备注</h4>
    </Col>
    <Col span={12} style={{textAlign:'right'}}>
      <span style={{ display: 'inline-block',textAlign:'right' }}>
        {orderInfo[1].remark}</span>
    </Col>
  </Row>
  <Divider></Divider>
  <Row>
    <Col style={{textAlign:'right'}}>
      <Button type="primary" onClick={() => this.props.callback()}>关闭</Button>
    </Col>
  </Row>
</Form>
        </Card>
        </Modal>
      </Fragment>
    );
  }
}
