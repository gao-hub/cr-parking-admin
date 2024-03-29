import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import forge from 'node-forge';
import Login from '@/components/Login';
import styles from './Login.less';

import { _baseApi } from '@/defaultSettings.js';

const { Tab, UserName, Password, Mobile, Captcha, Submit, ImgCaptcha } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    imgSrc: '/system/captcha/make',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    if (!err) {
      const md = forge.md.md5.create();
      md.update(values.password);
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          password: md.digest().toHex()
        },
        callback: ()=>this.onGetImgCaptcha()
      });
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
      imgSrc: _baseApi + '/system/captcha/make?v=' + new Date().getTime(),
    });
  };

  componentDidMount() {
    this.setState({
      imgSrc: _baseApi + '/system/captcha/make?v=' + new Date().getTime(),
    });
  }

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
          <UserName name="username" placeholder="手机号" />
          <Password
            name="password"
            placeholder="密码"
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <ImgCaptcha
            name="validateCode"
            placeholder="请输入图形验证码"
            onGetCode={this.onGetImgCaptcha}
            src={this.state.imgSrc}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <div style={{ overflow: 'hidden' }}>
            {/* <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox> */}
            {/* <Link to="/user/ResetPwd" style={{ float: 'right', cursor: 'pointer' }}>
              <FormattedMessage id="app.login.forgot-password" />
            </Link> */}
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          {/* <div className={styles.other}>
            <FormattedMessage id="app.login.sign-in-with" />
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/User/Register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div> */}
        </Login>
      </div>
    );
  }
}

export default LoginPage;
