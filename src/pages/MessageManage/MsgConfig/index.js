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
  Upload,
  InputNumber,
  Table,
  message
} from 'antd'
import { connect } from 'dva';
import { queryURL } from '@/utils/utils'
import router from 'umi/router';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@Form.create()

@connect(({ msgConfig }) => ({
  msgConfig
}))

export default class SystemConfig extends Component {
  constructor(props) {
    super(props)
    this.state = {
   
    }
  }
  async componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'msgConfig/getModifyInfo',
      payload: {}
    })
  }

  saveBtn = ()=>{
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res = await dispatch({
          type: 'msgConfig/modifyManage',
          payload: {
            ...values,
            // id: this.props.msgConfig.modifyInfo.id,
          }
        })
        if (res && res.status === 1) {
          message.success(res.statusDesc)
        } else message.error(res.statusDesc)
        // const { dispatch } = this.props
        // if(this.props.msgConfig.modifyInfo){
         
        // }else{
        //   res = dispatch({
        //     type: 'msgConfig/addManage',
        //     payload: {
        //       ...values
        //     }
        //   })
        // }
         // 状态为edit，则每修改一条数据请求一次接口 之后再对表格进行操作
         
      }
    });
  }

  render() {
    const { modifyInfo } = this.props.msgConfig
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 10
      }
    }
    return (
      <Fragment>
          <Card>
            <h2 style={{fontWeight:'bold'}}>短信配置</h2>
            <Form>
              <Row gutter={24}>
                <Col span={14}>
                <Row gutter={24}>
                  <Divider orientation="left" style={{fontWeight:'bold'}}>短信验证码</Divider>
                    <FormItem
                      label={'短信内容'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('captchaSmsContent', {
                        rules: [
                          {
                            required: true,
                            message: '请填写短信内容',
                          },
                        ],
                        initialValue: modifyInfo && modifyInfo.captchaSmsContent
                        })(<TextArea placeholder={'车位在线】验证码：短信参数，您正在使用短信验证码登录功能，该验证码仅用于身份验证，请勿泄露给他人使用。'}></TextArea>)}
                    </FormItem>
                  </Row>
                  <Row gutter={24}>
                    <Divider orientation="left" style={{fontWeight:'bold'}}>后台初始短信通知</Divider>
                    <FormItem
                      label={'短信内容'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('pwdinitSmsContent', {
                        rules: [
                          {
                            required: true,
                            message: '请填写短信内容',
                          },
                        ],
                        initialValue: modifyInfo && modifyInfo.pwdinitSmsContent
                        })(<TextArea placeholder={'【车位在线】恭喜您注册成功，您的用户名：XXX 密码是：XXXX'}></TextArea>)}
                    </FormItem>
                    <FormItem
                      label={'每天同一IP最多发送量'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('maxIpCount', {
                        rules: [
                          {
                            required: true,
                            message: '请填写每天同一IP最多发送量',
                          },
                          {
                            validator: (rule, val, cb) => {
                              if ((val.toString()).match(/\D/g)) {
                                cb('请输入数字')
                              } else cb()
                            }
                          }
                        ],
                        initialValue: modifyInfo && modifyInfo.maxIpCount
                        })(<Input addonAfter="个"></Input>)}
                    </FormItem>
                    <FormItem
                      label={'每天同一设备最多发送量'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('maxMachineCount', {
                        rules: [
                          {
                            required: true,
                            message: '请填写每天同一设备最多发送量',
                          },
                          {
                            validator: (rule, val, cb) => {
                              if ((val.toString()).match(/\D/g)) {
                                cb('请输入数字')
                              } else cb()
                            }
                          }
                        ],
                        initialValue: modifyInfo && modifyInfo.maxMachineCount
                        })(<Input addonAfter="个"></Input>)}
                    </FormItem>
                    <FormItem
                      label={'短信发送间隔'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('maxIntervalTime', {
                        rules: [
                          {
                            required: true,
                            message: '请填写短信发送间隔',
                          },
                          {
                            validator: (rule, val, cb) => {
                              if ((val.toString()).match(/\D/g)) {
                                cb('请输入数字')
                              } else cb()
                            }
                          }
                        ],
                        initialValue: modifyInfo && modifyInfo.maxIntervalTime
                        })(<Input addonAfter="秒"></Input>)}
                    </FormItem>
                    <FormItem
                      label={'短信有效期'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('maxValidTime', {
                        rules: [
                          {
                            required: true,
                            message: '请填写短信有效期',
                          },
                          {
                            validator: (rule, val, cb) => {
                              if ((val.toString()).match(/\D/g)) {
                                cb('请输入数字')
                              } else cb()
                            }
                          }
                        ],
                        initialValue: modifyInfo && modifyInfo.maxValidTime
                        })(<Input addonAfter="分"></Input>)}
                    </FormItem>
                    {/* <FormItem
                      label={'预警短信联系人'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('securityPrice', {
                        rules: [
                          {
                            required: true,
                            message: '请填写预警短信联系人',
                          },
                        ],
                        initialValue: modifyInfo && modifyInfo.securityPrice
                        })(<Input></Input>)}
                    </FormItem> */}
                  </Row>
                  <Row type="flex" justify="center" style={{marginTop:'15px'}}>
                    <Button type="primary" onClick={this.saveBtn}>保存</Button>
                  </Row>
                </Col>
              </Row>
            </Form>
        </Card>
      </Fragment>
    )
  }
}
