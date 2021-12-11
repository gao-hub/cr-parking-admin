// 客户更改为员工
import React, { PureComponent } from 'react';
import { Modal, Form,  message,  Select } from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;

@Form.create()
@connect(({ userManage, loading }) => ({
  userManage,
  submitLoading: loading.effects['userManage/updateSpreads'],
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataInfo: {},
      currPage: 1,
      pageSize: 10,
    };
  }
  changeVisible = visible => {
    this.setState({
      visible,
    });
  };

  handleOk = async () => {
    const {
      dispatch,
      form,
      userManage: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await this.props.dispatch({
          type: 'userManage/updateCRole',
          payload: {
            ...values,
            userId: this.state.dataInfo.userId,
          },
        });
        if (res && res.status === 1) {
          message.success('修改成功');
          this.changeVisible(false);
          this.props.getList(this.props.currPage, this.props.pageSize);
        } else {
          message.error(res.statusDesc);
        }
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/initSelect',
      payload: {}
    })
  }
  // 清除数据
  cleanData() {
    this.setState({
      dataInfo: {},
      currPage: 1,
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      userManage: {
        initData:{utmTypes}
      },
    } = this.props;
    const { dataInfo } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };

    return (
      <Modal
        title={'客户更改为员工'}
        width={800}
        bodyStyle={{ maxHeight: 480, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        confirmLoading={this.props.submitLoading ? true : false}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="用户名" {...formConfig}>
            <span>{dataInfo.username}</span>
          </FormItem>
          <FormItem label="手机号" {...formConfig}>
            <span>{dataInfo.mobile}</span>
          </FormItem>
          <FormItem label="渠道" {...formConfig}>
            {getFieldDecorator('utmId', {
              rules: [{ required: true, message: '请选择渠道' }],
            })(
              <Select allowClear>
                {
                  utmTypes && utmTypes.map(item => <Option key={item.key} value={item.value}>{item.title}</Option>)
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
