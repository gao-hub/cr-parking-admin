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
  message
} from 'antd'
import { connect } from 'dva';
import Upload from '@/components/Upload'
import { queryURL } from '@/utils/utils'
import router from 'umi/router';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const carInfo = [
  {
    key: 0,
    title: '楼盘名称',
    value: '海尔世纪公馆'
  },
  {
    key: 1,
    title: '所在地',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 2,
    title: '详细地址',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 3,
    title: '详细地址',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 4,
    title: '开发商',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 5,
    title: '车位编号',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 6,
    title: '车位价格',
    value: '山东省 青岛市 市北区',
  },
]
const confirmInfo = [
  {
    key: 0,
    title: '楼盘名称',
    value: '海尔世纪公馆'
  },
  {
    key: 1,
    title: '所在地',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 2,
    title: '详细地址',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 3,
    title: '详细地址',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 4,
    title: '开发商',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 5,
    title: '车位编号',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 6,
    title: '车位价格',
    value: '山东省 青岛市 市北区',
  },
]
const holdInfo = [
  {
    key: 0,
    title: '楼盘名称',
    value: '海尔世纪公馆'
  },
  {
    key: 1,
    title: '所在地',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 2,
    title: '详细地址',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 3,
    title: '详细地址',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 4,
    title: '开发商',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 5,
    title: '车位编号',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 6,
    title: '车位价格',
    value: '山东省 青岛市 市北区',
  },
]
const backBuyInfo = [
  {
    key: 0,
    title: '楼盘名称',
    value: '海尔世纪公馆'
  },
  {
    key: 1,
    title: '所在地',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 2,
    title: '详细地址',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 3,
    title: '详细地址',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 4,
    title: '开发商',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 5,
    title: '车位编号',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 6,
    title: '车位价格',
    value: '山东省 青岛市 市北区',
  },
]
const BuyInfo = [
  {
    key: 0,
    title: '楼盘名称',
    value: '海尔世纪公馆'
  },
  {
    key: 1,
    title: '所在地',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 2,
    title: '详细地址',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 3,
    title: '详细地址',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 4,
    title: '开发商',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 5,
    title: '车位编号',
    value: '山东省 青岛市 市北区',
  },
  {
    key: 6,
    title: '车位价格',
    value: '山东省 青岛市 市北区',
  },
]

@Form.create()

@connect(({ buybackOrderManage }) => ({
  buybackOrderManage
}))

export default class SellVerify extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: []
    }
  }
  async componentDidMount() {

  }
  saveBtn = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        
        console.log(values, "values-")
        // const res = await dispatch({
        //   type: 'buybackOrderManage/addClaimassist',
        //   payload: values,
        // });
        // if (res && res.status === 1) {
        //   message.success(res.statusDesc)
        //   this.props.addAttributeValue(false)
        //   getAttributeList();
        // } else message.error(res.statusDesc)
      }
    });
  }
  render() {
    // const { assetDetailesData } = this.props.assetList;
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    }
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <Fragment>
          <Card>
            <h2 style={{fontWeight:'bold'}}>出售审核</h2>
            <Form>
              <Row gutter={24}>
                <Col span={14}>
                  <Row gutter={24}>
                    <Divider orientation="left" style={{fontWeight:'bold'}}>车位信息</Divider>
                      {
                        carInfo.map(item => (
                          <Col span={12} key={item.key}>
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
                      <Divider orientation="left" style={{fontWeight:'bold'}}>认购信息</Divider>
                      {
                        confirmInfo.map(item => (
                          <Col span={12} key={item.key}>
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
                      <Divider orientation="left" style={{fontWeight:'bold'}}>持有信息</Divider>
                      {
                        holdInfo.map(item => (
                          <Col span={12} key={item.key}>
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
                    
                      <Divider orientation="left" style={{fontWeight:'bold'}}>回购信息</Divider>
                      {
                        backBuyInfo.map(item => (
                          <Col span={12} key={item.key}>
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
                    <Divider orientation="left" style={{fontWeight:'bold'}}>购买信息</Divider>
                      {
                        BuyInfo.map(item => (
                          <Col span={12} key={item.key}>
                            <FormItem
                              label={item.title}
                              {...formItemLayout}
                            >
                              <span>{item.value}</span>
                            </FormItem>
                          </Col>
                        ))
                      }
                      <Col span={24}>
                        <FormItem
                          label={'其他材料'}
                          labelCol={{span: 3}}
                          wrapperCol={{span: 16}}
                        >
                          {/* <div className="clearfix">
                            <Upload
                              action=""
                              listType="picture-card"
                              fileList={this.state.fileList}
                            />
                          </div> */}
                        </FormItem>
                      </Col>
                      <FormItem
                        label={'财务审核'}
                        labelCol={{span: 3}}
                        wrapperCol={{span: 16}}
                        >
                          {getFieldDecorator('aaa', {
                            rules: [
                              {
                                required: true,
                                message: '请选择是否通过',
                              },
                            ],
                          })(
                            <RadioGroup onChange={this.onChange}>
                              <Radio value={1}>通过</Radio>
                              <Radio value={0}>不通过</Radio>
                            </RadioGroup>
                          )}
                      </FormItem>
                      <FormItem
                        label={'相关材料'}
                        labelCol={{span: 3}}
                        wrapperCol={{span: 16}}
                      >
                        {getFieldDecorator('picture', {
                            rules: [
                              {
                                required: true,
                                message: '请上传相关材料',
                              },
                            ],
                            initialValue: ["http://dummyimage.com/120x600", "http://dummyimage.com/336x280"]
                          })(
                            <Upload
                                uploadConfig={{
                                  action: 'http://rap2.taobao.org:38080/app/mock/1376/upload',
                                  fileType: 'image',
                                  size: 3
                                }}
                                defaultUrl={["http://dummyimage.com/120x600", "http://dummyimage.com/336x280"]}
                                multiplePicture={true}
                                setIconUrl={(url, type) => {
                                  const picture = this.props.form.getFieldValue('picture')
                                  if (type !== 'remove') {
                                    // 照片添加的逻辑
                                    if (!picture || !picture[0]) {
                                      this.props.form.setFieldsValue({ picture: [url] })
                                    } else {
                                      this.props.form.setFieldsValue({ picture: picture.concat([url]) })
                                    }
                                  } else {
                                    // 照片删除的逻辑
                                    const resArr = []
                                    picture.forEach(item => {
                                      if (item !== url) resArr.push(item)
                                    })
                                    this.props.form.setFieldsValue({ picture: resArr })
                                  }
                                }}
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
                        labelCol={{span: 3}}
                        wrapperCol={{span: 10}}
                        >
                          {getFieldDecorator('ccc', {
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
                      <FormItem  wrapperCol= {{offset: 8, span: 16 }}>
                        <Button type="primary" onClick={this.saveBtn}>提交</Button>
                      </FormItem>
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
