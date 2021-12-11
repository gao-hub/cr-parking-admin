import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio, Select, message } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ tripAccountManage, loading }) => ({
  tripAccountManage,
  submitLoading: loading.effects['tripAccountManage/modifyManage'],
}))
class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const { getChildData } = this.props;
    getChildData(this);
  }

  changeVisible = visible => {
    this.setState({
      visible,
    });
  };

  render() {
    const {
      dataInfo={}
    } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const { visible = false } = this.state;

    return (
      <Modal
        title='充值'
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={visible}
        onOk={() => this.changeVisible(false)}
        maskClosable={false}
        destroyOnClose
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="收款方用户名" {...formConfig}>
            {dataInfo.userName}
          </FormItem>
          <FormItem label="收款方账户" {...formConfig}>
            {dataInfo.bankAccount}
          </FormItem>
          <FormItem label="收款银行" {...formConfig}>
            重庆富民银行
          </FormItem>

        </Form>
      </Modal>
    );
  }
}

export default Modify;
