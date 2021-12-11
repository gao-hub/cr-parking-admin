import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { routerRedux } from 'dva/router';
import { Checkbox, Alert, Icon, Button, message } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import { debounce } from '@/utils/utils';
import forge from 'node-forge';

import { _baseApi } from '@/defaultSettings.js';
const { Tab, UserName, Password, Mobile, Captcha, Submit, ImgCaptcha } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.validatorPwd = debounce(this.validatorPwd, 800);
  }
  state = {
    type: 'account',
    autoLogin: true,
    imgSrc: '',
    newPassword: false,
    mobile: '',
    passwordStatus: '',
    newPassword2status: ''
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile', 'captcha'], {}, async (err, values) => {
        if (err) { 
          reject(err);
        } else {
          const { dispatch } = this.props;
          const res = await dispatch({
            type: 'login/getCaptcha',
            payload: values,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  verification = async (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      const res = await dispatch({
        type: 'login/nextStep',
        payload: {
          ...values,
        },
      });
      if (res && res.status === 1) {
        this.setState({
          newPassword: true,
          mobile: values.mobile,
        })
      } else message.error(res.statusDesc)
    }
  };

  modifyPassword = async (err, values) => {
    if (!err) {
      const pwd = forge.md.md5.create();
      pwd.update(values.password);
      const { dispatch } = this.props;
      delete values['password1']
      const res = await dispatch({
        type: 'login/ResetPwd',
        payload: {
          password: pwd.digest().toHex(),
          mobile: this.state.mobile,
        },
      });
      if (res && res.status === 1) {
        message.success('密码重置成功')
        dispatch(routerRedux.push({
          pathname: '/user/login',
        }))
      } else moessage.error(res.statusDesc)
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };
  //点击获取图形验证码
  onGetImgCaptcha = () => {
    this.setState({
      imgSrc: `${_baseApi}/system/captcha/make?v=${new Date().getTime()}`,
    });
  };

  componentDidMount() {
    this.onGetImgCaptcha()
  }

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );
  //   自定义验证   校验密码
  validatorPwd = (rule, value, cb) => {
    if (!value) {
      this.setState({
        passwordStatus: 'error'
      })
      cb('请填写信息')
      return
    }
    if (value.length < 8 || !(value.toString()).match(/^(?![0-9]+$)(?![a-zA-Z]+$)(?![\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]+$)[0-9A-Za-z\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]{8,16}$/)) {
      this.setState({
        passwordStatus: 'error'
      })
      cb('密码8-16位，必须包含字母、数字、符号至少两种')
      return
    }
    this.setState({
      passwordStatus: 'success'
    })
    cb()
  }
  //    自定义  校验   确认密码
  confirmPassword = (rule, value, cb) => {
    if (!value) {
      this.setState({
        newPassword2status: 'error'
      })
      cb('请输入密码！')
      return
    }
    if (value.length < 8 || !(value.toString()).match(/^(?![0-9]+$)(?![a-zA-Z]+$)(?![\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]+$)[0-9A-Za-z\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]{8,16}$/)) {
      this.setState({
        newPassword2status: 'error'
      })
      cb('密码8-16位，必须包含字母、数字、符号至少两种')
      return
    }
    const newpsd = this.formRef.props.form.getFieldValue('password')
    if (value !== newpsd) {
      this.setState({
        newPassword2status: 'error'
      })
      cb('两次密码不同！')
      return
    }
    this.setState({
      newPassword2status: 'success'
    })
    cb()
  }

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        { 
          !this.state.newPassword ? <Login
            defaultActiveKey='verification'
            onTabChange={this.onTabChange}
            onSubmit={this.verification}
            ref={form => {
              this.loginForm = form;
            }}
          >
            <Mobile name="mobile" placeholder="手机号" />
            <ImgCaptcha
              name="captcha"
              placeholder="请输入图形验证码"
              onGetCode={this.onGetImgCaptcha}
              src={this.state.imgSrc}
            />
            <Captcha placeholder="请输入验证码" name="code" countDown={120} onGetCaptcha={this.onGetCaptcha} />
            <Submit loading={submitting}>
            下一步
            </Submit>
          </Login> : 
          <Login
            defaultActiveKey='modifyPassword'
            onTabChange={this.onTabChange}
            onSubmit={this.modifyPassword}
            wrappedComponentRef={(inst) => this.formRef = inst}
          >
            <Password
              name="password"
              placeholder="设置新密码"
              rules={
                [{
                  required: true,
                  validator: this.validatorPwd
                }]
              }
            />
            <Password
              name="password1"
              placeholder="再次输入新密码"
              rules={
                [{
                  required: true,
                  validator: this.confirmPassword
                }]
              }
            />
            <Submit loading={submitting}>
            提交
            </Submit>
          </Login>
        }
      </div>
    );
  }
}

export default LoginPage;
