import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Tooltip, Modal, Form, message, Input  } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import groupBy from 'lodash/groupBy';
import forge from 'node-forge';
import { connect } from 'dva';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import { score } from '@/utils/utils'
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()

@connect(({
  login
}) => ({
  login
}))

export default class GlobalHeaderRight extends PureComponent {
  state = {
    modalVisible: false,
    level: 0,
    oldPasswordStatus: '',
    avatar: true
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

   //   修改密码
   changePassword = () => {
    this.setState({
      modalVisible: true
    })
  }
  //   退出登录
  signOut = () => {
    this.props.dispatch({
      type: 'login/logout'
    })
  }
  //   确认修改密码
  confirmChangePassword = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const oldPwd = forge.md.md5.create();
        oldPwd.update(values.oldPassword);
        const pwd = forge.md.md5.create();
        pwd.update(values.password);
        const response = await this.props.dispatch({
          type: 'login/changePassword',
          payload: {
            oriPassword: oldPwd.digest().toHex(),
            newPassword: pwd.digest().toHex(),
          }
        })
        if (response && response.status === 1) {
          this.setState({
            modalVisible: false
          })
          message.success(response.statusDesc)
          //   退出登录  重新登录
          this.signOut()
        } else {
          message.error(response.statusDesc)
        }
      }
    })
  }

  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { level } = this.state
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/* <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item> */}
        <Menu.Item key="userinfo" onClick={this.changePassword}>
          <Icon type="setting" />
          修改密码
        </Menu.Item>
        {/* <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          <FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />
        </Menu.Item>
        <Menu.Divider /> */}
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className} style={{ marginRight: 38 }}>
        {/* <HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder={formatMessage({ id: 'component.globalHeader.search' })}
          dataSource={[
            formatMessage({ id: 'component.globalHeader.search.example1' }),
            formatMessage({ id: 'component.globalHeader.search.example2' }),
            formatMessage({ id: 'component.globalHeader.search.example3' }),
          ]}
          onSearch={value => {
            console.log('input', value); // eslint-disable-line
          }}
          onPressEnter={value => {
            console.log('enter', value); // eslint-disable-line
          }}
        />
        <Tooltip title={formatMessage({ id: 'component.globalHeader.help' })}>
          <a
            target="_blank"
            href="https://pro.ant.design/docs/getting-started"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip> */}
        {/* <NoticeIcon
          className={styles.action}
          count={currentUser.notifyCount}
          onItemClick={(item, tabProps) => {
            console.log(item, tabProps); // eslint-disable-line
          }}
          locale={{
            emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
            clear: formatMessage({ id: 'component.noticeIcon.clear' }),
          }}
          onClear={onNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          loading={fetchingNotices}
          popupAlign={{ offset: [20, -16] }}
          clearClose
        >
          <NoticeIcon.Tab
            list={noticeData.notification}
            title={formatMessage({ id: 'component.globalHeader.notification' })}
            name="notification"
            emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          />
          <NoticeIcon.Tab
            list={noticeData.message}
            title={formatMessage({ id: 'component.globalHeader.message' })}
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          />
          <NoticeIcon.Tab
            list={noticeData.event}
            title={formatMessage({ id: 'component.globalHeader.event' })}
            name="event"
            emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
          />
        </NoticeIcon> */}
        {currentUser.name ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        {/* <SelectLang className={styles.action} /> */}
        <Modal 
            visible={this.state.modalVisible}
            onOk={this.confirmChangePassword}
            destroyOnClose={true}
            onCancel={() => this.setState({ modalVisible: false })}
            width={550}
            title={'修改密码'}
            bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
          >
            <Form>
              <FormItem
                label="username"
                style={{display: 'none'}}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
              >
                {getFieldDecorator('username', {
                  rules: [],
                  initialValue: 'admin'
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                label="旧密码"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}
                hasFeedback
                validateStatus={this.state.oldPasswordStatus}
              >
                {getFieldDecorator('oldPassword', {
                  rules: [{
                    required: true,
                    validator: async (rule, value, cb) => {
                      if (!value) {
                        cb('请填写信息')
                        return
                      }
                      // if (value.length < 8 || !(value.toString()).match(/^(?![0-9]+$)(?![a-zA-Z]+$)(?![\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]+$)[0-9A-Za-z\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]{8,16}$/)) {
                      //   cb('密码8-16位，必须包含字母、数字、符号至少两种')
                      //   this.setState({
                      //     oldPasswordStatus: 'error'
                      //   })
                      //   return
                      // }
                      this.setState({
                        oldPasswordStatus: 'success'
                      })
                    }
                  }],
                })(
                  <Input type='password' maxLength={16} id='success' />
                )}
              </FormItem>
              <FormItem
                label="新密码"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}
                hasFeedback
                validateStatus={this.state.passwordStatus}
              >
                {getFieldDecorator('password', {
                  rules: [{
                    required: true,
                    validator: (rule, value, cb) => {
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
                        level: score(value),
                        passwordStatus: 'success'
                      })
                      cb()
                    }
                  }],
                })(
                  <Input type='password' maxLength={16} style={{ textSecurity: 'disc' }} />
                )}
              </FormItem>
              {/* <FormItem
                label="密码强度"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}
              >
                <span className={classNames(styles.psdStrength, level < 40 && level > 0 ? styles.psdweak : '')}>弱</span>
                <span className={classNames(styles.psdStrength, level >= 40 && level < 70 ? styles.psdin : '')}>中</span>
                <span className={classNames(styles.psdStrength, level >= 70 ? styles.psdstrong : '')}>强</span>
              </FormItem> */}
              <FormItem
                label="确认新密码"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}
                hasFeedback
                validateStatus={this.state.newPassword2status}
              >
                {getFieldDecorator('newPassword2', {
                  rules: [{
                    required: true,
                    validator: (rule, value, cb) => {
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
                      const newpsd = this.props.form.getFieldValue('password')
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
                  }],
                })(
                  <Input type='password' maxLength={16} />
                )}
              </FormItem>
            </Form>
          </Modal>
      </div>
    );
  }
}
