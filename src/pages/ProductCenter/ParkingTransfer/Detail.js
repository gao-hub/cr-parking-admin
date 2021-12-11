import React, { Component, Fragment } from 'react'
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
  message
} from 'antd'
import { connect } from 'dva';
import { queryURL } from '@/utils/utils'
import Upload from '@/components/Upload'
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@Form.create()

@connect(({ parkingTransferManage }) => ({
  parkingTransferManage
}))

export default class BuyBackDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: []
    }
  }
  async componentDidMount() {
    const { id } = this.props.match.params
    this.props.dispatch({
      type: 'parkingTransferManage/getModifyInfo',
      payload: {
        id
      }
    })
  }
  saveBtn = (e) => {
    const { dispatch, form, match: { params: { id } }, location: { query: { type } } } = this.props
    if (type !== 'audit') {
      dispatch(routerRedux.push({
        pathname: '/product/parking/list'
      }))
      return
    }
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await dispatch({
          type: 'parkingTransferManage/modifyManage',
          payload: {
            ...values,
            id
          },
        });
        if (res && res.status === 1) {
          message.success(res.statusDesc)
          this.props.dispatch(routerRedux.push({
            pathname: '/product/parking/list'
          }))
        } else message.error(res.statusDesc)
      }
    });
  }
  render() {
    // const { assetDetailesData } = this.props.assetList;
    const { match: { params: { id } }, location: { query: { type } } } = this.props
    const { form: { getFieldDecorator }, parkingTransferManage: { modifyInfoData } } = this.props
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    }
    const carInfo = [
      {
        key: '0-0',
        title: '楼盘名称',
        value: '海尔世纪公馆'
      },
      {
        key: '0-1',
        title: '所在地',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '0-2',
        title: '详细地址',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '0-3',
        title: '详细地址',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '0-4',
        title: '开发商',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '0-5',
        title: '车位编号',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '0-6',
        title: '车位价格',
        value: '山东省 青岛市 市北区',
      },
    ]
    const subscribeInfo = [
      {
        key: '1-0',
        title: '支付订单号',
        value: '海尔世纪公馆'
      },
      {
        key: '1-1',
        title: '认购人',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '1-2',
        title: '认购人级别',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '1-3',
        title: '认购金额',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '1-4',
        title: '产品类型',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '1-5',
        title: '认购时间',
        value: '山东省 青岛市 市北区',
      },
    ]
    const holdInfo = [
      {
        key: '2-0',
        title: '楼盘订单号',
        value: '海尔世纪公馆'
      },
      {
        key: '2-1',
        title: '当前持有人',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '2-2',
        title: '当前持有人级别',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '2-3',
        title: '支付金额',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '2-4',
        title: '支付时间',
        value: '山东省 青岛市 市北区',
      },
    ]
    const rebuyInfo = [
      {
        key: '3-0',
        title: '回购人',
        value: '海尔世纪公馆'
      },
      {
        key: '3-1',
        title: '回购金额',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '3-2',
        title: '当期租金',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '3-3',
        title: '服务费',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '3-4',
        title: '实际到账',
        value: '山东省 青岛市 市北区',
      },
      {
        key: '3-5',
        title: '提交时间',
        value: '山东省 青岛市 市北区',
      },
    ]
    return (
      <Fragment>
        <Card>
          <h2 style={{ fontWeight: 'bold' }}>回购审核</h2>
          <Form>
            <Row gutter={24}>
              <Col span={14}>
                <Row gutter={24}>
                  <Divider orientation="left" style={{ fontWeight: 'bold' }}>车位信息</Divider>
                  {
                    carInfo.map(item => (
                      <Col key={item.key} span={12}>
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
                <Row gutter={24}>
                  <Divider orientation="left" style={{ fontWeight: 'bold' }}>认购信息</Divider>
                  {
                    subscribeInfo.map(item => (
                      <Col key={item.key} span={12}>
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
                <Row gutter={24}>
                  <Divider orientation="left" style={{ fontWeight: 'bold' }}>持有信息</Divider>
                  {
                    holdInfo.map(item => (
                      <Col key={item.key} span={12}>
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
                <Row gutter={24}>
                  <Divider orientation="left" style={{ fontWeight: 'bold' }}>回购信息</Divider>
                  {
                    rebuyInfo.map(item => (
                      <Col key={item.key} span={12}>
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
                <Row span={24}>
                  <Col span={12}>
                    {
                      type === 'audit' ? (
                        <>
                          <FormItem
                            label={'财务审核'}
                            {...formItemLayout}
                          >
                            {getFieldDecorator('auditStatus', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择是否通过',
                                },
                              ],
                            })(
                              <RadioGroup onChange={this.onChange}>
                                <Radio value={2}>通过</Radio>
                                <Radio value={3}>不通过</Radio>
                              </RadioGroup>
                            )}
                          </FormItem>
                          <FormItem
                            label="相关材料"
                            {...formItemLayout}
                          >
                            {getFieldDecorator('auditPicture', {
                              rules: [{ required: true, message: '请上传相关材料' }],
                              initialValue: 'http://dummyimage.com/336x280'
                            })(
                              <Upload
                                defaultUrl={'http://dummyimage.com/336x280'}
                                uploadConfig={{
                                  action: 'http://rap2.taobao.org:38080/app/mock/1376/upload',
                                  fileType: ['image'],
                                  size: 3
                                }}
                                setIconUrl={(url) => this.props.form.setFieldsValue({ auditPicture: url })}
                              >
                                {
                                  this.state.fileList.length && this.state.fileList[0].response && this.state.fileList[0].response.status == '99' ?
                                    <span style={{ color: 'red', marginLeft: '5px' }}>{this.state.fileList[0].response.statusDesc}</span>
                                    : null
                                }
                              </Upload>
                            )}
                          </FormItem>
                          <FormItem
                            label={'备注'}
                            {...formItemLayout}
                          >
                            {getFieldDecorator('remark', {
                              rules: [
                                {
                                  required: true,
                                  message: '请填写备注',
                                },
                              ],
                            })(
                              <TextArea></TextArea>
                            )}
                          </FormItem>
                        </>
                      ) : null
                    }
                    <FormItem style={{ paddingLeft: '90%' }} {...formItemLayout}>
                      <Button type="primary" onClick={this.saveBtn}>提交</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col offset={2} span={8}>
                <Timeline mode="left">
                  <Timeline.Item>
                    <p>2018.08.08 12:12:12</p>
                    <p>认购成功</p>
                    <p>陈松超</p>
                    <p>认购金额：12123元</p>
                  </Timeline.Item>
                  <Timeline.Item>
                    <p>2018.08.08 12:12:12</p>
                    <p>发起转让</p>
                    <p>陈松超</p>
                    <p>认购金额：12123元</p>
                  </Timeline.Item>
                  <Timeline.Item>
                    <p>2018.08.08 12:12:12</p>
                    <p>发起转让</p>
                    <p>陈松超</p>
                    <p>认购金额：12123元</p>
                  </Timeline.Item>
                </Timeline>
              </Col>
            </Row>
          </Form>
        </Card>
      </Fragment>
    )
  }
}
