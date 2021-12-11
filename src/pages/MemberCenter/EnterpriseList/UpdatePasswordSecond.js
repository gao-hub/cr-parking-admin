/* eslint-disable consistent-return */
import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import { connect } from 'dva';
import { accpApi, keyJson, getRandomApi } from '@/utils/lianlianPsd';

@Form.create()
@connect(({ enterpriseManage }) => ({
  enterpriseManage,
}))
class UpdatePasswordSecond extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      params: {},
      isFirt: true
    };
  }

  /**
   * @desc Modal 打开，挂载连连支付控件
   */
  componentWillReceiveProps = async nextProps => {
    const { isShow = false, oldPassInfo } = nextProps;
    if (isShow && this.state.isFirt) {
      /**
       * @desc 获取 sKey、enStr
       */
      const res = await accpApi({});
      if (res && res.status === 1) {
        if (res.data) {
          this.setState({ isFirt: false })
          this.inputMount(oldPassInfo.keyJson.sKey, oldPassInfo.keyJson.enStr);
          if (window.pgeditor && document.getElementById('ocx_password3')) {
            document.getElementById('ocx_password3').innerHTML = window.pgeditor.load();
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
    console.info(sKey, enStr);
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
        tabCallback: 'ocx_password3',
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
    this.setState({ isLoading: true });
    const { dispatch, form = {}, modalJson = {}, oldPassInfo } = this.props;
    const res = await dispatch({
      type: 'enterpriseManage/updatePassWord',
      payload: {
        password: oldPassInfo.password,
        ...modalJson,
        ...params
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
  };

  /**
   * @desc 提交交易密码
   */
  handleSubmitTradePsd = () => {
    const randomKey = this.props.oldPassInfo.randomKey;
    const randomValues = this.props.oldPassInfo.randomValues;
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
          window.pgeditor.pwdSetSk(randomValues, () => {
            window.pgeditor.pwdHash(() => {
              window.pgeditor.pwdResultRsa(async () => {
                // eslint-disable-next-line no-undef
                const newPassword = outs[wid1].aes;
                // 提交交易密码
                this.submitTradePsdApi({ newPassword, randomKey });
              });
            });
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
      window.pgeditor.pwdSetSk(randomValues);
      const newPassword = window.pgeditor.pwdResultRsa();
      // 提交交易密码
      this.submitTradePsdApi({ newPassword, randomKey });
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
  handleCancel = (flag) => {
    const { callback = () => {} } = this.props;
    callback(flag);
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
                交易密码：
              </span>
              <span height="40" id="ocx_password3" />
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default UpdatePasswordSecond;
