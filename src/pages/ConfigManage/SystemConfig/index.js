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
import permission from '@/utils/PermissionWrapper';
import { queryURL, posRemain2 } from '@/utils/utils'
import router from 'umi/router';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;



@Form.create()

@permission

@connect(({ systemConfig }) => ({
  systemConfig
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
      type: 'systemConfig/getModifyInfo',
      payload: {}
    }) 
  }

  saveBtn = ()=>{
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res
        const { dispatch } = this.props
        if(this.props.systemConfig.modifyInfo){
          // 状态为edit，则每修改一条数据请求一次接口 之后再对表格进行操作
          res = await dispatch({
          type: 'systemConfig/modifyManage',
          payload: {
            ...values,
            id: this.props.systemConfig.modifyInfo.id,
          }
        })
        }else{
          res = dispatch({
            type: 'systemConfig/addManage',
            payload: {
              ...values
            }
          })
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc)
        } else message.error(res.statusDesc)
      }
    });
  }

  render() {
    const { modifyInfo } = this.props.systemConfig
    const { permission } = this.props;
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
            <h2 style={{fontWeight:'bold'}}>系统配置</h2>
            <Form>
              <Row gutter={24}>
                <Col span={14}>
                  <Row gutter={24}>
                    <Divider orientation="left" style={{fontWeight:'bold'}}>帐户余额预警</Divider>
                    <FormItem
                      label={'帐户余额预警金额'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('balanceWarn', {
                          rules: [
                            {
                              required: true,
                              validator: (rule, val, cb) => {
                                if (!val) {
                                  cb('请填写帐户余额预警金额')
                                } else if (!(val.toString()).match(posRemain2)) {
                                  cb('请输入正确的金额')
                                } else cb()
                              }
                            },
                          ],
                          initialValue: modifyInfo && modifyInfo.balanceWarn
                        })(<Input></Input>)}
                    </FormItem>
                    <FormItem
                      label={'帐户余额预警手机号'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('balanceWarnPhone', {
                        rules: [
                          {
                            required: true,
                            message: '请填写帐户余额预警手机号',
                          },
                        ],
                        initialValue: modifyInfo && modifyInfo.balanceWarnPhone
                        })(<TextArea></TextArea>)}
                    </FormItem>
                  </Row>
                  <Row gutter={24}>
                    {/* <Divider orientation="left" style={{fontWeight:'bold'}}>租金配置</Divider>
                    <FormItem
                      label={'一年租金通用比例配置'}
                      {...formItemLayout}
                      // extra={'前台交互修改当前值，后台为新增一条租金数据，并做留存'}
                      >
                      {getFieldDecorator('apportionmentRatio', {
                        rules: [
                          {
                            required: true,
                            message: '请填写一年租金通用比例配置',
                          },
                        ],
                        initialValue: modifyInfo && modifyInfo.apportionmentRatio
                        })(<InputNumber
                            min={0}
                            max={20}
                            precision={2}
                            formatter={value => `${value}%`}
                            style={{width: '100%'}}
                        />)}
                    </FormItem> */}
                    {/* <FormItem
                      label={'通用分润比例'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('returnRate', {
                        rules: [
                          {
                            required: true,
                            message: '请填写通用分润比例',
                          },
                        ],
                        initialValue: modifyInfo && modifyInfo.returnRate
                        })(<InputNumber
                              min={0}
                              max={100}
                              formatter={value => `${value}%`}
                              style={{width: '100%'}}
                          />)}
                    </FormItem> */}
                  </Row>
                  <Row gutter={24}>
                    <Divider orientation="left" style={{fontWeight:'bold'}}>保障服务</Divider>
                    <FormItem
                      label={'保障服务开启开关'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('securityStatus', {
                        rules: [
                          {
                            required: true,
                            message: '请选择保障服务开启开关',
                          },
                        ],
                        initialValue: modifyInfo && modifyInfo.securityStatus
                        })(<RadioGroup onChange={this.onChange}>
                          <Radio value={1}>开启</Radio>
                          <Radio value={0}>关闭</Radio>
                        </RadioGroup>)}
                    </FormItem>
                    <FormItem
                      label={'保障服务车位单价'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('securityPrice', {
                        rules: [
                          {
                            required: true,
                            validator: (rule, val, cb) => {
                              if (val == null) {
                                cb('请填写保障服务车位单价')
                              } else if (!(val.toString()).match(posRemain2)) {
                                cb('请输入正确的单价')
                              } else cb()
                            }
                            // validator: (rules, value, callback)=>{
                            //   if(!value){
                            //     callback('请填写保障服务车位单价')
                            //   }
                            //   if(!(val.toString()).match(posRemain2))
                            //   // if (!value.toString().match(/^\d+([.]{1}[0-9]{1,2}){0,1}$/)) callback('必须为整数或者小数，小数点后2位');
                            //   callback()
                            // }
                          },
                        ],
                        initialValue: modifyInfo && modifyInfo.securityPrice
                        })(<Input addonAfter="元"></Input>)}
                    </FormItem>
                    <FormItem
                      label={'保障服务描述'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('securityDescribe', {
                        rules: [
                          {
                            required: true,
                            message: '请填写保障服务描述',
                          },
                        ],
                        initialValue: modifyInfo && modifyInfo.securityDescribe
                        })(<TextArea></TextArea>)}
                    </FormItem>
                  </Row>
                  <Row gutter={24}>
                    <Divider orientation="left" style={{fontWeight:'bold'}}>转让配置</Divider>
                    <FormItem
                      label={'用户发起转让金额控制'}
                      required={true}
                      {...formItemLayout}
                      style={{marginBottom: '0px'}}
                      >
                      <Row>
                        <Col span={10}>
                          <FormItem>
                            {getFieldDecorator('discountRateMin', {
                              rules: [{ required: true, 
                              validator: (rules, value, callback)=>{
                                if(!value){
                                  callback('用户发起转让金额控制不能为空')
                                }
                                if(Number(value) < -100 || Number(value) > 100) {
                                  callback('请输入-100~100之间的数')
                                }
                                if (!value.toString().match(/^(0|[1-9][0-9]*|-[1-9][0-9]*)$/)) callback('必须为整数');
                                callback()
                              }
                             }],
                              initialValue: modifyInfo && modifyInfo.discountRateMin
                            })(
                              <Input addonAfter={'%'} onChange={()=>{
                                this.props.form.setFieldsValue({
                                  discountRateMax: null
                                })
                              }}/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={4} style={{ textAlign: 'center' }}>~</Col>
                        <Col span={10}>
                          <FormItem>
                            {getFieldDecorator('discountRateMax', {
                              rules: [{ required: true,
                              validator: (rules, value, callback)=>{
                                if(!value){
                                  callback('用户发起转让金额控制不能为空')
                                }
                                if(Number(value) < -100 || Number(value) > 100) {
                                  callback('请输入-100~100之间的数')
                                }
                                if(Number(value) < this.props.form.getFieldValue('discountRateMin')){
                                  callback('不能小于最小百分比')
                                }
                                if (!value.toString().match(/^(0|[1-9][0-9]*|-[1-9][0-9]*)$/)) callback('必须为整数');
                                callback()
                              } }],
                              initialValue: modifyInfo && modifyInfo.discountRateMax
                            })(
                              <Input addonAfter={'%'} />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </FormItem> 
                    {/* <FormItem
                      label={'服务费配置'}
                      {...formItemLayout}
                      >
                      {getFieldDecorator('transferServiceFee', {
                        rules: [
                          {
                            required: true,
                            validator: (rules, value, callback)=>{
                              if(!value){
                                callback('请填写服务费配置')
                              }
                              if(Number(value) < 0 || Number(value) > 100) {
                                callback('请输入0-100之间的数')
                              }
                              if (!value.toString().match(/^\d+([.]{1}[0-9]{1,2}){0,1}$/)) callback('必须为整数或者小数，小数点后2位');
                              callback()
                            }
                          },
                        ],
                        initialValue: modifyInfo && modifyInfo.transferServiceFee
                        })(<Input addonAfter={'%'}></Input>)}
                    </FormItem>  */}
                  </Row>
                  {/* <Row gutter={24}>
                    <Divider orientation="left" style={{fontWeight:'bold'}}>回购配置</Divider> 
                      <FormItem
                        label={'回购服务费'}
                        {...formItemLayout}
                        >
                          {getFieldDecorator('buybackServiceFee', {
                            rules: [
                              {
                                required: true,
                                validator: (rules, value, callback)=>{
                                  if(!value){
                                    callback('请填写回购服务费')
                                  }
                                  if(Number(value) < 0 || Number(value) > 100) {
                                    callback('请输入0-100之间的数')
                                  }
                                  if (!value.toString().match(/^\d+([.]{1}[0-9]{1,2}){0,1}$/)) callback('必须为整数或者小数，小数点后2位');
                                  callback()
                                }
                              },
                            ],
                            initialValue: modifyInfo && modifyInfo.buybackServiceFee
                            })(<Input addonAfter={'%'}/>)}
                      </FormItem>
                      <FormItem
                        label={'无忧退货'}
                        {...formItemLayout}
                      >
                      <span className="ant-form-text">认购</span>
                        {getFieldDecorator('returnDay', {
                          rules: [
                            {
                              required: true,
                              // message: '请填写无忧退货',
                              validator: (rules,value,callback)=>{
                                if(!value) {
                                  callback('请填写无忧退货')
                                }
                                if(Number(value) < 0 || Number(value) > 1000) {
                                  callback('请输入0到1000天')
                                }
                                if (isNaN(value - 0) || !((value - 0).toString()).match(/^[+]{0,1}(\d+)$/)) callback('请输入正整数')
                                callback()
                              }
                            },
                          ],
                          initialValue: modifyInfo && modifyInfo.returnDay
                          })(<Input style={{width:'50%'}} />)}
                      <span className="ant-form-text" style={{marginLeft:'5px'}}>天后可回购</span>
                      </FormItem> 
                      <FormItem
                      label={'延长退货'}
                      {...formItemLayout}
                      >
                      <span className="ant-form-text">认购</span>
                        {getFieldDecorator('extendReturnDay', {
                          rules: [
                            {
                              required: true,
                              validator: (rules,value,callback)=>{
                                if(!value) {
                                  callback('请填写延长退货')
                                }
                                if(Number(value)<0 || Number(value)> 1000) {
                                  callback('请输入0到1000天')
                                }
                                if (isNaN(value - 0) || !((value - 0).toString()).match(/^[+]{0,1}(\d+)$/)) callback('请输入正整数')
                                callback()
                              }
                            },
                          ],
                          initialValue: modifyInfo && modifyInfo.extendReturnDay
                          })(<Input style={{width:'50%'}} />)}
                      <span className="ant-form-text" style={{marginLeft:'5px'}}>天后可回购</span>
                    </FormItem> 
                  </Row> */}
                  <Row type="flex" justify="center" style={{marginTop:'15px'}}>
                    {
                      permission.includes('chuangrong:systemconfig:add') || permission.includes('chuangrong:systemconfig:update') ? <Button type="primary" onClick={this.saveBtn}>保存</Button> : null
                    }
                  </Row>
                </Col>
              </Row>
            </Form>
        </Card>
      </Fragment>
    )
  }
}
