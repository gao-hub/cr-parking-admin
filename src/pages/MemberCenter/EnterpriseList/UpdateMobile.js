/* eslint-disable consistent-return */
import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import { connect } from 'dva';
import { accpApi, keyJson, getRandomApi } from '@/utils/lianlianPsd';

@Form.create()
@connect(({ enterpriseManage }) => ({
  enterpriseManage,
}))
class UpdateMobile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      params: {},
      isFetch: true,
      isFetchTwo: true,
      count: 60,
      countTwo: 60,
      isFirt: true,
      resInfo: {} //连连获取手机验证码的返回数据
    };
  }

  /**
   * @desc Modal 打开，挂载连连支付控件
   */
  componentWillReceiveProps = async nextProps => {
    const { isShow = false } = nextProps;
    if (isShow && this.state.isFirt) {
      /**
       * @desc 获取 sKey、enStr
       */
      const res = await accpApi({});
      if (res && res.status === 1) {
        if (res.data) {
          this.setState({ isFirt: false })
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
        pgeId: 'ocx_1',
        pgeEdittype: 0,
        pgeCert: keyJson.public_key, // RSA加密公钥
        pgeCert1: keyJson.public_key_convert,
        pgeEreg1: '[\\s\\S]*', // 输入过程中字符类型限制，如"[0-9]*"表示只能输入数字
        pgeEreg2: '[\\s\\S]{6,20}', // 输入完毕后字符类型判断条件，与pgeditor.pwdValid()方法对应
        pgeMaxlength: 20,
        pgeBackColor: '',
        // pgeTabindex: 1,
        pgeClass: 'ocx_style',
        pgeInstallClass: 'ocx_style',
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
   * @desc 提交交易密码接口
   */
  submitTradePsdApi = async params => {
    const that = this;
    const { dispatch, modalJson = {} } = this.props;
    let fieldsValue = this.props.form.getFieldsValue();
    if(!fieldsValue.newMobile){
      message.warning('请输入新手机号');
      return
    }
    if(fieldsValue.newMobile === modalJson.regPhone){
      message.warning('新手机号和旧手机号一致，请核实后重新输入');
      return
    }
    const res = await dispatch({
      type: 'enterpriseManage/getCodeSecond',
      payload: {
        ...modalJson,
        ...params,
        ...fieldsValue,
        mobile: modalJson.regPhone
      },
    });
    if (res && res.status === 1) {
      if( res.data?.ret_code === '0000') {
        message.success(res.data?.ret_msg);
        this.setState({
          resInfo: res.data,
          isFetchTwo: false
        }, ()=>{
          that.setTime('isFetchTwo', 'countTwo');
        })
      } else {
        message.success(res.data?.ret_msg);
      }
    }else{
      message.error(res.statusDesc);
    }
  };

  /**
   * @desc 提交交易密码
   */
  handleSubmitTradePsd = () => {
    if (window.pgeditor.osBrowser == 10 || window.pgeditor.osBrowser == 11) {
      const wid1 = window.pgeditor.settings.pgeWindowID;
      // 长度校验
      window.pgeditor.pwdLength(() => {
        // eslint-disable-next-line no-undef
        if (outs[wid1].length == 0) {
          message.error('交易密码不能为空');
          return;
        }
        // 正则表达式校验
        window.pgeditor.pwdValid(() => {
          // eslint-disable-next-line no-undef
          if (outs[wid1].valid == 1) {
            message.error('交易密码不符合要求');
            return;
          }
          getRandomApi({}).then(randomRes => {
            if (randomRes && randomRes.status === 1) {
              window.pgeditor.pwdSetSk(randomRes.data.random_value, () => {
                window.pgeditor.pwdHash(() => {
                  window.pgeditor.pwdResultRsa(async () => {
                    // eslint-disable-next-line no-undef
                    const password = outs[wid1].aes;
                    // 提交交易密码
                    this.submitTradePsdApi({ password, randomKey: randomRes.data.random_key });
                  });
                });
              });
            }
          });
        });
      });
    } else {
      // 长度校验
      if (window.pgeditor.pwdLength() == 0) {
        message.error('交易密码不能为空');
        return false;
      }
      // 正则表达式校验
      if (window.pgeditor.pwdValid() == 1) {
        message.error('交易密码不符合要求');
        return false;
      }

      /**
       * @desc 获取 随机因子
       */
      getRandomApi({}).then(async randomRes => {
        if (randomRes && randomRes.status === 1) {
          window.pgeditor.pwdSetSk(randomRes.data.random_value);
          const password = window.pgeditor.pwdResultRsa();
          // 提交交易密码
          this.submitTradePsdApi({ password, randomKey: randomRes.data.random_key });
        }
      });
    }
  };

  /**
   * @desc 更新手机号
   */
  handleSubmit = () => {
    this.setState({ isLoading: true });
    const { dispatch, form = {}, modalJson = {} } = this.props;
    const { resInfo } = this.state;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await dispatch({
          type: 'enterpriseManage/updateMobile',
          payload: {
            userId: modalJson.userId,
            seqno: resInfo.txn_seqno,
            token: resInfo.token,
            areaCode: values.codeNew
          },
        });
        if (res && res.status === 1) {
          if( res.data?.ret_code === '0000') {
            message.success(res.data?.ret_msg);
            this.setState({
              isLoading: false
            });
            this.handleCancel('submit');
          } else {
            this.setState({
              isLoading: false
            });
            message.success(res.data?.ret_msg);
          }
        } else {
          this.setState({ isLoading: false });
          message.error(res.statusDesc);
        }
      }
    });
  };

  /**
   * @desc 关闭弹窗
   */
  handleCancel = (flag) => {
    const { callback = () => {} } = this.props;
    callback(flag);
    this.setState({
      isLoading: false,
      isFetch: true,
      isFetchTwo: true,
      count: 60,
      countTwo: 60,
      isFirt: true
    })
  };


  setTime = (name, count) =>{
    let timer = null;
    let that = this;
    if (!this.state[name]) {
      timer = setInterval(() => {
        that.setState({
          [count]: that.state[count] - 1
        }, ()=>{
          if (that.state[count] === 1) {
            that.setState({
              [name]: true
            });
            clearInterval(timer);
            that.setState({
              [count]: 60
            })
          }
        })
      }, 1000);
    }
  }

  getCode = async (name, count) =>{
    const { modalJson = {} } = this.props;
    if(name === 'isFetch'){
      if(!this.props.modalJson.regPhone){
        message.warning('原手机号不能为空');
        return
      }
      const res = await this.props.dispatch({
        type: 'enterpriseManage/getCode',
        payload: {
          mobile: modalJson.regPhone
        }
      })
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        this.setState({
          [name]: false
        }, ()=>{
          this.setTime(name, count);
        })
      }else{
        message.error(res.statusDesc);
      }
    } else {
      this.handleSubmitTradePsd();
    }
  }

  render() {
    const {
      isShow = false,
      modalJson = {},
      form: { getFieldDecorator },
    } = this.props;
    const { isLoading = false } = this.state;

    return (
      <Modal
        title="修改手机号"
        visible={isShow}
        onOk={() => this.handleSubmit()}
        onCancel={this.handleCancel}
        destroyOnClose
        maskClosable={false}
        confirmLoading={isLoading}
      >
        <Form>
          <div>
            <div>
              <Form.Item label="原手机号" labelCol={{ span: 6 }} wrapperCol={{ span: 8 }}>
                <span>{modalJson.mobile}</span>
              </Form.Item>
              <Form.Item label="验证码" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('areaCode', {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码',
                    },
                    {
                      pattern: /^[1-9]\d*|0$/,
                      message: '请输入正确的验证码'
                    }
                  ],
                })(
                  <Input style={{ width: 160 }} maxLength={6} />
                )}
                <Button
                  type="primary"
                  style={{ marginLeft: 10, width: 102 }}
                  disabled={!this.state.isFetch}
                  onClick={()=>this.getCode('isFetch', 'count')}>
                  {this.state.isFetch ? '获取验证码' : `${this.state.count}s`}
                </Button>
              </Form.Item>
            </div>
            <div style={{ textAlign: 'left', marginLeft: '9%', marginBottom: 20 }}>
              <span>
                <i style={{ marginRight: '3px', color: '#f5222d' }}>*</i>
                交易密码：
              </span>
              <span height="40" id="ocx_password2" />
            </div>
            <Form.Item label="新手机号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('newMobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入新手机号',
                  },
                  {
                    pattern: /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/,
                    message: '请输入正确的新手机号'
                  }
                ],
              })(
                <Input style={{ width: 160 }} maxLength={11} />
              )}
            </Form.Item>
            <Form.Item label="验证码" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('codeNew', {
                rules: [
                  {
                    required: true,
                    message: '请输入验证码',
                  },
                  {
                    pattern: /^[1-9]\d*|0$/,
                    message: '请输入正确的验证码'
                  }
                ],
              })(
                <Input style={{ width: 160 }} maxLength={6} />
              )}
              <Button
                type="primary"
                style={{ marginLeft: 10, width: 102 }}
                disabled={!this.state.isFetchTwo}
                onClick={()=>this.getCode('isFetchTwo', 'countTwo')}>
                {this.state.isFetchTwo ? '获取验证码' : `${this.state.countTwo}s`}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default UpdateMobile;
