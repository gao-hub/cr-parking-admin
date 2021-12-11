import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio, Select, message, Row } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';
import { accpApi, keyJson, getRandomApi } from '@/utils/lianlianPsd';
import { posRemain2 } from '@/utils/utils'

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ tripAccountManage }) => ({
  tripAccountManage
}))
class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: 0,
      visible: false,
      fileList: [],
      randomRes: {  },
      randomResType:0,
      isSmsCodeShow: 0,
      params: {},
    };
  }

  componentDidMount() {
    const { getChildData } = this.props;

    getChildData(this);
  }

  /**
   * @desc Modal 打开，挂载连连支付控件
   */
  componentWillReceiveProps  = async nextProps => {
    /**
     * @desc 获取 sKey、enStr
     */
    const { isShow = false } = nextProps;
    if (isShow && (isShow!==this.props.isShow)) {
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
  }

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
  changeVisible = visible => {
    const { dispatch } = this.props;
    this.setState({
      visible,
    });
  };

  handleOk =  () => {
    const { isSmsCodeShow = 0 } = this.state;
    if(isSmsCodeShow){
      this.smsSubmit()
    }else{
      this.tradePwdSubmit()
    }
  };
  tradePwdSubmit=async ()=>{
    const {
      dispatch,
      form,
      dataInfo,
    } = this.props;

    form.validateFieldsAndScroll(async (err, values) => {
      this.setState({
        randomRes:{
          err,values
        }
      })
      if (!err) {
        // 提交交易密码
        await this.tradepsdValidate()
        if(this.state.randomResType){
          this.setState({ isLoading: 1 });
          let res;
          res = await dispatch({
            type: 'tripAccountManage/withdraw',
            payload: Object.assign(values,{userId:dataInfo.userId},this.state.randomRes),
          });
          if (res && res.status === 1) {
            if (res.data) {
              this.setState({ isLoading: 0 });
              const { data = {} } = res;
              this.setState({
                isSmsCodeShow: 1,
                params: {
                  txnSeqno: data.txn_seqno,
                  accpToken: data.token,
                  amount:data.total_amount
                },
              });
            } else {
              message.success(res.statusDesc);
              this.setState({
                isSmsCodeShow: 0 ,
                isLoading: 0
              });
              const {callback=()=>{},getInfo=()=>{}}=this.props
              callback()
              getInfo()
            }
          } else{
            this.setState({
              isSmsCodeShow: 0 ,
              isLoading: 0
            });
            message.error(res.statusDesc);
          }
        }
      }
    });
  }

  smsSubmit=async ()=>{
    const { dispatch, form = {}, dataInfo} = this.props;
    const { params = {} } = this.state;

    form.validateFieldsAndScroll(['code'],async (err, values) => {
      if (!err) {
        this.setState({ isLoading: 1 });

        const res = await dispatch({
          type: 'tripAccountManage/lianlianSmsCode',
          payload: {
            ...values,
            ...params,
            userId:dataInfo.userId
          },
        });

        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setState({ isLoading: 0,isSmsCodeShow: 0 });
          const {callback=()=>{},getInfo=()=>{}}=this.props
          callback()
          getInfo()
        } else {
          this.setState({ isLoading: 0 });
          message.error(res.statusDesc?res.statusDesc:'请求接口异常');
        }
      }else{
        message.error(err)
      }
    });
  }

  render() {
    const {
      isShow = false,
      form = {},
      dataInfo={}
    } = this.props;
    const { getFieldDecorator } = form;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const { isLoading = 0, isSmsCodeShow = 0 } = this.state;
    return (
      <Modal
        title='提现'
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={isShow}
        onOk={() => this.handleOk()}
        maskClosable={false}
        destroyOnClose
        confirmLoading={isLoading}
        onCancel={() => {
          const { callback = () => {} } = this.props;
          this.setState({ isLoading: 0,isSmsCodeShow: 0 });
          callback();
        }}
      >
        {isSmsCodeShow !== 1 && (
        <Form name='tradeform'>
          <FormItem label="可提现金额" {...formConfig}>
            {dataInfo.bankBalance}元
          </FormItem>
          <FormItem label="提现金额" {...formConfig}>
            {getFieldDecorator('amount', {
              rules: [
                { required: true, message: '请输入提现金额' },
                {
                  validator: (rule, val, cb) => {
                    try {
                      if (val && !val.toString().match(posRemain2)) {
                        cb('请输入正确的提现金额');
                      } else { cb(); }
                    } catch (err) {
                      cb(err);
                    }
                  },
                },
              ],
            })(<Input placeholder="提现金额" addonAfter="元" />)}
          </FormItem>

          <FormItem
            label="交易密码"
            {...formConfig}
            htmlFor='tradepsd'
            required
            rules={[
              { required: true, message: '必填项' },
              ]}
          >
            <span id='ocx_password2' />
          </FormItem>

        </Form>
      )}
        {this.state.isSmsCodeShow === 1 && (
          <Form name='smsform'>
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
      </Modal>
    );
  }
}

export default Modify;
