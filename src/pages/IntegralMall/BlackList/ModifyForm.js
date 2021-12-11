import React, { PureComponent, Fragment } from 'react';
import { Modal, Form, Input, Radio, message, Row, Col, Button } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ BlackList, loading }) => ({
  BlackList,
  submitLoading: loading.effects['BlackList/modifyManage'],
}))
class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }

  componentDidMount() {
    const {
      dispatch
    } = this.props;
    dispatch({
      type: 'BlackList/parentUtmSelector',
      payload: {},
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'BlackList/setUserInfo',
      payload: {},
    });
  }

  handleOk = async () => {
    const {
      dispatch,
      form,
      type,
      onCancel,
      currPage,
      pageSize,
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        const { BlackList: { userInfo }, getList, id } = this.props;
        if (type === 'add') {
          res = await dispatch({
            type: 'BlackList/saveManage',
            payload: {
              userId: userInfo.userId,
              parentUtmId: userInfo.parentUtmId,
              ...values
            },
          });
        }
        if (type === 'remove') {
          res = await dispatch({
            type: 'BlackList/removeManage',
            payload: {
              id,
              ...values
            },
          });
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setState({
            visible: false
          })
          onCancel();
          getList(currPage, pageSize)
        } else message.error(res && res.statusDesc);
      }
    });
  };

  // 查询用户信息
  onSearch = async () => {
    //   未查到用户信息！！！
    const { dispatch, form } = this.props;
    form.resetFields(['truename', 'userPhone', 'parentUtmName']);
    const json = form.getFieldsValue();
    if (json.userName?.trim()) {
      const res = await dispatch({
        type: 'BlackList/getUserInfo',
        payload: {
          username: json.userName
        }
      })
      if (res && res.status !== 1) {
        message.error(res.statusDesc)
      }
    } else {
      message.warning("请输入要查询的用户名")
    }
  }


  render() {
    const {
      form = {},
      BlackList: { userInfo },
      onCancel,
      dispatch,
      type,
      permission
    } = this.props;
    const { getFieldDecorator } = form;
    const formConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const {
      visible = false,
    } = this.state;
    return (
      <Modal
        width={600}
        title={type === 'remove' ? '移除黑名单' : '新增黑名单'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose
        onCancel={() => {
          dispatch({
            type: 'BlackList/setModifyInfo',
            payload: {},
          });
          onCancel();
        }}
      >
        <Form>
          <FormItem label="用户名" {...formConfig}>
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('userName', {
                  rules: [{ required: type === 'add', message: '请输入用户名'}],
                  initialValue: userInfo && userInfo.userName,
                })(<Input placeholder="请输入用户名" disabled={type === 'remove'} />)}
              </Col>
              {
                type === 'add' && permission.includes('chuangrong:integralBlackList:info') && 
                <Col span={12}>
                  <Button type="primary" onClick={this.onSearch}>查询</Button>
                </Col>
              }
            </Row>
          </FormItem>
          <FormItem label="姓名" {...formConfig}>
            {getFieldDecorator('truename', {
              rules: [{ required: type === 'add', message: '姓名必填' }],
              initialValue: userInfo && userInfo.truename,
            })(<Input placeholder="姓名" disabled />)}
          </FormItem>
          <FormItem label="手机号" {...formConfig}>
            {getFieldDecorator('userPhone', {
              rules: [{ required: type === 'add', message: '手机号必填' }],
              initialValue: userInfo && userInfo.mobile,
            })(<Input placeholder="手机号" disabled />)}
          </FormItem>
          <FormItem label="渠道" {...formConfig}>
            {getFieldDecorator('parentUtmName', {
              rules: [{ required: false, message: '渠道' }],
              initialValue: userInfo && userInfo.parentUtmName,
            })(<Input placeholder="渠道" disabled />)}
          </FormItem>
          {
            type === 'remove' &&
            <>
              <FormItem label="当前有效冻结积分" {...formConfig}>
                {getFieldDecorator('currValidFreezeIntegral', {
                  rules: [{ required: false, message: '请输入当前有效冻结积分' }],
                  initialValue: userInfo && userInfo.currValidFreezeIntegral,
                })(<Input placeholder="请输入当前有效冻结积分" disabled />)}
              </FormItem>
              <FormItem label="补发冻结积分" {...formConfig}>
                {getFieldDecorator('reissueStatus', {
                  rules: [{ required: true, message: '请选择是否补发冻结积分' }],
                })(
                  <RadioGroup>
                    <Radio value={1}>补发</Radio>
                    <Radio value={0}>不补发</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </>
          }
          <FormItem label="备注" {...formConfig}>
            {getFieldDecorator('remark', {
              rules: [{ required: false }],
            })(<TextArea placeholder="备注" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Modify;
