import React, { Component, Fragment } from 'react';
import {
  Form,
  Row,
  Col,
  Card,
  Button,
  message, Icon,
} from 'antd';
import { connect } from 'dva';
import permission from '@/utils/PermissionWrapper';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// 添加/修改表单
import RechargeModifyForm from './RechargeModifyForm';
import WithdrawalModifyForm from './WithdrawalModifyForm';

const FormItem = Form.Item;


@Form.create()

@permission

@connect(({ tripAccountManage }) => ({
  tripAccountManage,
}))

export default class SystemConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataInfo: {},
      isModalShow: 0, // 连连支付密码 Modal
    };
  }

  componentDidMount() {
    this.getInfo()
  }
  async getInfo(){
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'tripAccountManage/getModifyInfo',
      payload: {},
    });
    if (res && res.status === 1) {
      this.setState({
        dataInfo: res.data,
      });
    }
  }
  saveBtn = () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        const { dispatch } = this.props;
        if (this.props.tripAccountManage.modifyInfo) {
          // 状态为edit，则每修改一条数据请求一次接口 之后再对表格进行操作
          res = await dispatch({
            type: 'tripAccountManage/modifyManage',
            payload: {
              ...values,
              id: this.props.tripAccountManage.modifyInfo.id,
            },
          });
        } else {
          res = dispatch({
            type: 'tripAccountManage/addManage',
            payload: {
              ...values,
            },
          });
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
        } else message.error(res.statusDesc);
      }
    });
  };

  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:tripAccount:recharge') ? (
        <Button onClick={() => this.modifyChild.changeVisible(true)}>
          <Icon type="reload"/>
          充值
        </Button>
        ) : null}
        {permission.includes('chuangrong:tripAccount:withdraw') ? (
        <Button onClick={() => this.setState({ isModalShow: 1 })}>
          <Icon type="reload"/>
          提现
        </Button>
        ) : null}
      </Fragment>
    );
  };

  render() {
    const { modifyInfo } = this.props.tripAccountManage;
    const { permission } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { dataInfo,isModalShow } = this.state;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 10,
      },
    };
    return (
      <Fragment>
        {permission.includes('chuangrong:tripAccount:view') ? (
          <>
            <PageHeaderWrapper renderBtn={this.renderBtn}>
            </PageHeaderWrapper>
            <Card style={{ marginTop: '20px' }}>
              <h2 style={{ fontWeight: 'bold' }}>账户管理</h2>
              <Form>
                <Row gutter={24}>
                  <Col span={14}>
                    <Row gutter={24}>
                      <FormItem
                        label={'企业名称'}
                        {...formItemLayout}
                      >
                        {dataInfo.businessName}
                      </FormItem>
                      <FormItem
                        label={'用户名'}
                        {...formItemLayout}
                      >
                        {dataInfo.userName}
                      </FormItem>
                      <FormItem
                        label={'公司类型'}
                        {...formItemLayout}
                      >
                        {dataInfo.type === 0 ? '物业公司' : '销售公司'}
                      </FormItem>
                      <FormItem
                        label={'手机号'}
                        {...formItemLayout}
                      >
                        {dataInfo.contactsPhone}
                      </FormItem>
                      <FormItem
                        label={'ACCP商户编号'}
                        {...formItemLayout}
                      >
                        {dataInfo.oidUserno}
                      </FormItem>
                      <FormItem
                        label={'合作银行账户'}
                        {...formItemLayout}
                      >
                        {dataInfo.bankAccount}
                      </FormItem>
                      <FormItem
                        label={'开户状态'}
                        {...formItemLayout}
                      >
                        {dataInfo.openStatus === 0 ? '未开户' : '已开户'}
                      </FormItem>
                      <FormItem
                        label={'开户时间'}
                        {...formItemLayout}
                      >
                        {dataInfo.createTime}
                      </FormItem>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </Card>
            <RechargeModifyForm
              getChildData={child => (this.modifyChild = child)}
              dataInfo={dataInfo}
            />
            <WithdrawalModifyForm
              isShow={isModalShow===1}
              getChildData={child => (this.withdrawalmodifyChild = child)}
              dataInfo={dataInfo}
              callback={async () => {
                this.setState({ isModalShow: 0 });
              }}
              getInfo={()=>{
                this.getInfo()
              }}
            />
          </>
        ) : null}
      </Fragment>
    );
  }
}
