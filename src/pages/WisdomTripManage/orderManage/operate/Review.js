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
import { accpApi, keyJson, getRandomApi } from '@/utils/lianlianPsd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const auditRadio=[
  {
    value:0,
    text:'通过'
  },
  {
    value:2,
    text:'不通过'
  },
  {
    value:1,
    text:'失败退款'
  }
]
const confirmRadio=[
  {
    key:1,
    value:1,
    text:'通过'
  },
  {
    key:0,
    value:0,
    text:'不通过'
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
      isLoading:0,
      isSmsCodeShow:0,
      params:{},
      randomRes:{},
      randomResType:0,
      confirmLoading:false
    }
  }
  /**
   * @desc Modal 打开，挂载连连支付控件
   */
  componentWillReceiveProps = async nextProps => {
    if (this.props.infoData.id !== nextProps.infoData.id&& nextProps.isShow){
      const { dispatch ,infoData:{id},tradePsdShow = false } = nextProps;
      dispatch({
        type: 'tripOrderManage/getNoPermissionOrderInfo',
        payload: {id},
      });
      if (tradePsdShow) {
        /**
         * @desc 获取 sKey、enStr
         */
        const res = await accpApi({});
        if (res && res.status === 1) {
          if (res.data) {
            this.inputMount(res.data.sKey, res.data.enStr);
            if (window.pgeditor && document.getElementById('ocx_password2')) {
              document.getElementById('ocx_password2').innerHTML = window.pgeditor.load();
              window.pgeditor.pgInitialize();
              window.pgeditor.pwdclear();
            }
          }
        }
      }
    }
  };

  /**
   * @desc 连连支付密码控件
   */
  inputMount = (sKey, enStr) => {
    if (typeof window.pgeditor === 'undefined' || window.pgeditor === null) {
      // eslint-disable-next-line no-undef, new-cap
      window.pgeditor = new $.pge({
        pgePath: 'https://static.lianlianpay.com/PasswordControl/install/',
        pgeId: 'tradepsd',
        pgeEdittype: 0,
        pgeCert: keyJson.public_key, // RSA加密公钥
        pgeCert1: keyJson.public_key_convert,
        pgeEreg1: '[\\s\\S]*', // 输入过程中字符类型限制，如"[0-9]*"表示只能输入数字
        pgeEreg2: '[\\s\\S]{6,20}', // 输入完毕后字符类型判断条件，与pgeditor.pwdValid()方法对应
        pgeMaxlength: 20,
        pgeBackColor: '',
        // pgeTabindex: 1,
        pgeClass: 'ant-input',
        pgeInstallClass: 'ant-input',
        tabCallback: 'ocx_password2',
        // pgeOnkeydown: this.pwdkjblur,
        // tabCallback:"input2",
        // windows10相关
        pgeWindowID: `password + ${new Date().getTime() + 1}`,
        pgeRZRandNum: sKey,
        pgeRZDataB: enStr,
      });
    }

    window.pgeCtrl = window.pgeditor;
  };
  /**
   * @desc 交易密码校验
   */
  tradepsdValidate =async ()=> {
    if (window.pgeditor.osBrowser == 10 || window.pgeditor.osBrowser == 11) {
      const wid1 = window.pgeditor.settings.pgeWindowID;

      let lengthValid=await new Promise(resolve => {
        // 长度校验
        window.pgeditor.pwdLength(() => {
          // eslint-disable-next-line no-undef
          if (outs[wid1].length == 0) {
            console.log('000')
            message.error('交易密码不能为空');
            this.setState({
              randomRes: {  },
              randomResType:0
            });
            resolve(false)
          }else{
            resolve(true)
          }
        });
      })
      if(!lengthValid){
        return false
      }
      let regexpValid= await new Promise(resolve => {
        // 正则表达式校验
        window.pgeditor.pwdValid(() => {
          // eslint-disable-next-line no-undef
          if (outs[wid1].valid == 1) {
            message.error('交易密码不符合要求');
            this.setState({
              randomRes: {  },
              randomResType:0
            });
            resolve(false)
          }else{
            resolve(true)
          }
        });
      })
      if(!regexpValid){
        return false
      }
      /**
       * @desc 获取 随机因子
       */
      let randomRes=await getRandomApi({})
      if (randomRes && randomRes.status === 1) {
        await new Promise(resolve => {
          window.pgeditor.pwdSetSk(randomRes.data.random_value, () => {
            window.pgeditor.pwdHash(() => {
              window.pgeditor.pwdResultRsa(async () => {
                // eslint-disable-next-line no-undef
                const password = outs[wid1].aes;
                // 提交交易密码
                    this.setState({
                      randomRes: { password, randomKey: randomRes.data.random_key },
                      randomResType:1
                    });
                    resolve()
              });
            });
          });
        })
      }else{
        message.error('交易密码校验异常，请刷新重试');
        this.setState({
          randomRes: {  },
          randomResType:0
        });
        return false
      }
    } else {
      // 长度校验
      if (window.pgeditor.pwdLength() == 0) {
        message.error('交易密码不能为空');
        this.setState({
          randomRes: {  },
          randomResType:0
        });
        return false;
      }
      // 正则表达式校验
      if (window.pgeditor.pwdValid() == 1) {
        message.error('交易密码不符合要求');
        this.setState({
          randomRes: {  },
          randomResType:0
        });
        return false;
      }
      /**
       * @desc 获取 随机因子
       */
      let randomResElse=await getRandomApi({})
      if (randomResElse && randomResElse.status === 1) {
        window.pgeditor.pwdSetSk(randomResElse.data.random_value);
        const password = window.pgeditor.pwdResultRsa();
        this.setState({
          randomRes: { password, randomKey: randomRes.data.random_key },
          randomResType:1
        });
      }else{
        message.error('交易密码校验异常，请刷新重试');
        this.setState({
          randomRes: {  },
          randomResType:0
        });
        return false
      }
    }
  };
  /**
   * @desc 提交交易密码
   */
  handleSubmit =async (e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        this.setState({
          confirmLoading:true
        })
        const { dispatch, tradePsdShow = false,infoData:{id} } = this.props;
        // 提交交易密码
        if(tradePsdShow){
          await this.tradepsdValidate()
          if(!this.state.randomResType) return false
        }
        Object.assign(values,{id:id})
        let res = await dispatch({
          type: 'tripOrderManage/reviewManage',
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
  onChangeTextArea=(e)=>{
    this.state.textArea=e.target.value
  }
  resetForm(){
    const {  form } = this.props;
    form.resetFields()
  }
  render() {
    const { noPermissionOrderInfoData:OrderInfoData ,initData: { orderStatus } } = this.props.tripOrderManage;
    const { getFieldDecorator,getFieldValue } = this.props.form
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
        value: OrderInfoData&&OrderInfoData.review,
      },
      {
        key: 6,
        title: '用户名',
        value: OrderInfoData&&OrderInfoData.buyerName,
      },
      {
        key: 7,
        title: '发起退款时间',
        value: OrderInfoData&&OrderInfoData.refundSubmitTime,
      },
      {
        key: 8,
        title: '初审',
        value: '成功',
      },
      {
        key: 9,
        title: '退款金额',
        value: OrderInfoData&&OrderInfoData.refundPayment+'元',
      },
      {
        key: 10,
        title: '备注',
        value: OrderInfoData&&OrderInfoData.refundRemark,
      },
    ]
    return (
      <Fragment>
        <Modal
        title="复审"
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
          <Button key="submit" type="primary" loading={this.state.confirmLoading} onClick={this.handleSubmit}>
            确定
          </Button>,
        ]}
        confirmLoading={this.confirmLoading}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
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
                  label='审核'
                  {...formItemLayout}
                >
                  {getFieldDecorator('reviewType', {
                    rules:[{ required: true, message: '必填项' }]
                  })(
                    <Radio.Group onChange={this.onChange} >
                      {confirmRadio.map(item=>
                        item && <Radio key={item.value} value={item.value}>{item.text}</Radio>
                      )}
                    </Radio.Group>
                  )}

                </FormItem>
                {/*<FormItem*/}
                {/*  label='交易密码'*/}
                {/*  {...formItemLayout}*/}
                {/*  htmlFor='tradepsd'*/}
                {/*  required={true}*/}
                {/*  rules={[{ required: true, message: '必填项' }]}*/}
                {/*  wrapperCol={{ span: 8 }}*/}
                {/*>*/}
                {/*  <span id='ocx_password2'></span>*/}
                {/*</FormItem>*/}
                <FormItem
                  label='备注'
                  {...formItemLayout}
                >
                  {getFieldDecorator('reviewRemark', {
                    rules:[
                      {max:50,message:'不超过50个字'}]
                  })(
                    <TextArea placeholder="" maxLength={50} allowClear onChange={this.onChangeTextArea} />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          {this.state.isSmsCodeShow === 1 && (
            <Form name='sms-form' onSubmit={this.handleSubmit}>
              <Form.Item label="验证码已发送至" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                <span>18866233193</span>
              </Form.Item>
              <Form.Item label="短信验证码" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: '验证码不能为空',
                    },
                  ],
                })(<Input placeholder="请输入短信验证码" />)}
              </Form.Item>
            </Form>
          )}
        </Card>
        </Modal>
      </Fragment>
    )
  }
}
