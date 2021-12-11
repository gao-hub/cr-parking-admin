import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button, Select, Radio, Row, Col } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ lotteryBlacklist, loading }) => ({
  lotteryBlacklist,
  submitLoading: loading.effects['lotteryBlacklist/add'],
}))
export default class Add extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  changeVisible = visible => {
    this.resetUserInfoData();
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    //   未查到用户信息！！！
    const { dispatch, form, lotteryBlacklist: { userInfoData },getList } = this.props;
    const { idx } = this.state;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let a ={...values};
        let res = await dispatch({
          type: 'lotteryBlacklist/add',
          payload: {
            userName:userInfoData.username,
            userId:userInfoData.userId,
            truename:userInfoData.truename,
            parentUtmId:userInfoData.parentUtmId,
            userPhone:userInfoData.mobile,
            ...values,
          }
        })
        if (res && res.status === 1) {
          message.success(res.statusDesc)
          this.changeVisible(false)
          getList(this.props.currPage, this.props.pageSize)
          this.resetUserInfoData();
        }
      }
    });
  };
  onSearch = async () => {
    //   未查到用户信息！！！
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res = await dispatch({
          type: 'lotteryBlacklist/searchUser',
          payload: {
            ...values,
          }
        })
        if (res && res.status === 1) {
          // message.success(res.statusDesc)
          // this.changeVisible(false)
          // this.props.getList(this.props.currPage, this.props.pageSize)
        } else message.error(res.statusDesc)
      }
    })
  }
  componentDidMount() {
    this.props.getChildData(this);
  }

  // 重置userInfoData
  resetUserInfoData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryBlacklist/setUserInfo',
      payload: {}
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
      lotteryBlacklist: { userInfoData }
    } = this.props;
    const { infoData } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={'新增黑名单'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        okType={userInfoData.isAddBlackList===1?'primary':'disabled'}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="用户名" required {...formConfig}>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('username', {
                  rules: [{
                    required: true,
                    message: '请输入用户名',
                  }],
                  // initialValue: userInfoData && userInfoData.username,
                })(<Input  placeholder={'请输入用户名'} />)}
              </Col>
              <Col span={8}>
                <Button type="primary" onClick={this.onSearch} >查询</Button>
              </Col>
            </Row>
          </FormItem>

          <FormItem label="姓名" required {...formConfig}>
            <span>{userInfoData.truename || '无'}</span>
          </FormItem>

          <FormItem label="手机号" required {...formConfig}>
            <span>{userInfoData.mobile || '无'}</span>
          </FormItem>

          <FormItem label="渠道" {...formConfig}>
            <span>{userInfoData.parentUtmName || '无'}</span>
          </FormItem>

          <FormItem label="备注" {...formConfig}>
            {getFieldDecorator('remark', {
              // initialValue: infoData && infoData.remark,
            })(<TextArea maxLength={100} placeholder={'请输入备注'} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
