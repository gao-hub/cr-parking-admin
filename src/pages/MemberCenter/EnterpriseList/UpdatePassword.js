/* eslint-disable consistent-return */
import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import { connect } from 'dva';
import { accpApi, keyJson, getRandomApi } from '@/utils/lianlianPsd';

@Form.create()
@connect(({ enterpriseManage }) => ({
  enterpriseManage,
}))
class UpdatePassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      params: {},
      isFirt: true,
      keyJson: {}
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
          this.setState({ isFirt: false, keyJson: { sKey: res.data.sKey, enStr: res.data.enStr } })
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
    this.handleCancel('submit', params);
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
          message.error('原交易密码不能为空');
          return;
        }
        // 正则表达式校验
        window.pgeditor.pwdValid(() => {
          // eslint-disable-next-line no-undef
          if (outs[wid1].valid == 1) {
            message.error('原交易密码不符合要求');
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
                    this.submitTradePsdApi({ password, randomValues:randomRes.data.random_value ,randomKey: randomRes.data.random_key });
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
        message.error('原交易密码不能为空');
        return false;
      }
      // 正则表达式校验
      if (window.pgeditor.pwdValid() == 1) {
        message.error('原交易密码不符合要求');
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
          this.submitTradePsdApi({ password, randomValues:randomRes.data.random_value ,randomKey: randomRes.data.random_key });
        }
      });
    }
  };

  /**
   * @desc 提交提现
   */
  handleSubmit = () => {
    this.handleSubmitTradePsd();
  };

  /**
   * @desc 关闭弹窗
   */
  handleCancel = (flag, params) => {
    if(params){
      params.keyJson = this.state.keyJson;
    }
    const { callback = (flag, params) => {} } = this.props;
    callback(flag, params);
    this.setState({
      isLoading: false,
      isFirt: true
    })
  };


  render() {
    const {
      isShow = false,
    } = this.props;
    const { isLoading = false } = this.state;

    return (
      <Modal
        title="修改交易密码"
        visible={isShow}
        onOk={() => this.handleSubmit()}
        onCancel={this.handleCancel}
        destroyOnClose
        maskClosable={false}
        confirmLoading={isLoading}
      >
        <Form>
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span>
                <i style={{ marginRight: '4px', color: '#f5222d' }}>*</i>
                原交易密码：
              </span>
              <span height="40" id="ocx_password2" />
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default UpdatePassword;
