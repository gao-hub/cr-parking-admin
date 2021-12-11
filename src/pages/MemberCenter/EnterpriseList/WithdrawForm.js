/* eslint-disable consistent-return */
import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';
import { accpApi, keyJson, getRandomApi } from '@/utils/lianlianPsd';

@Form.create()
@connect(({ enterpriseManage }) => ({
  enterpriseManage,
}))
class WithdrawForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: 0,
      isSmsCodeShow: 0,
      params: {},
    };
  }

  /**
   * @desc Modal 打开，挂载连连支付控件
   */
  componentWillReceiveProps = async nextProps => {
    const { isShow = false } = nextProps;
    if (isShow) {
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
    this.setState({ isLoading: 1 });
    const { dispatch, form = {}, modalJson = {} } = this.props;

    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await dispatch({
          type: 'enterpriseManage/withdrawTradePsdSubmit',
          payload: {
            ...modalJson,
            ...params,
            ...values,
          },
        });

        if (res && res.status === 1) {
          // data 存在，输入短信验证，否则直接成功
          if (res.data) {
            this.setState({ isLoading: 0 });
            const { data = {} } = res;

            this.setState({
              isSmsCodeShow: 1,
              params: {
                txnSeqno: data.txn_seqno,
                accpToken: data.token,
              },
            });
          } else {
            this.setState({ isLoading: 0 });
            message.success(res.statusDesc);
            this.handleCancel();
          }
        } else {
          this.setState({ isLoading: 0 });
          message.error(res.statusDesc);
        }
      }
    });
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
   * @desc 提交短信验证码
   */
  handleSubmitSmsCode = () => {
    const { dispatch, form = {}, modalJson = {} } = this.props;
    const { params = {} } = this.state;

    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        this.setState({ isLoading: 1 });

        const res = await dispatch({
          type: 'enterpriseManage/withdrawSmsCodeSubmit',
          payload: {
            ...modalJson,
            ...values,
            ...params,
          },
        });

        if (res && res.status === 1) {
          this.setState({ isLoading: 0 });

          message.success(res.statusDesc);
          this.handleCancel();
        } else {
          this.setState({ isLoading: 0 });
          message.error(res.statusDesc);
        }
      }
    });
  };

  /**
   * @desc 提交提现
   */
  handleSubmit = () => {
    const { isSmsCodeShow = 0 } = this.state;

    if (isSmsCodeShow) {
      this.handleSubmitSmsCode();
    } else {
      this.handleSubmitTradePsd();
    }
  };

  /**
   * @desc 关闭弹窗
   */
  handleCancel = () => {
    const { callback = () => {} } = this.props;

    this.setState({ isSmsCodeShow: 0 });
    callback();
  };

  render() {
    const {
      isShow = false,
      modalJson = {},
      form: { getFieldDecorator },
    } = this.props;
    const { isLoading = 0, isSmsCodeShow = 0 } = this.state;

    return (
      <Modal
        title={isSmsCodeShow === 1 ? '短信验证码' : '交易密码'}
        visible={isShow}
        onOk={() => this.handleSubmit()}
        onCancel={this.handleCancel}
        destroyOnClose
        maskClosable={false}
        confirmLoading={isLoading}
      >
        <Form>
          <div style={{ display: isSmsCodeShow === 1 ? 'none' : 'block' }}>
            <div>
              <Form.Item label="可提现金额" labelCol={{ span: 10 }} wrapperCol={{ span: 8 }}>
                <span>{modalJson.balance}</span>
              </Form.Item>
              <Form.Item label="提现金额" labelCol={{ span: 10 }} wrapperCol={{ span: 8 }}>
                {getFieldDecorator('amount', {
                  rules: [
                    {
                      required: true,
                      message: '请输入提现金额',
                    },
                  ],
                })(<Input placeholder="请输入提现金额" />)}
              </Form.Item>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span>
                <i style={{ marginRight: '4px', color: '#f5222d' }}>*</i>
                交易密码：
              </span>
              <span height="40" id="ocx_password2" />
            </div>
          </div>

          {isSmsCodeShow === 1 && (
            <div>
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
            </div>
          )}
        </Form>
      </Modal>
    );
  }
}

export default WithdrawForm;
