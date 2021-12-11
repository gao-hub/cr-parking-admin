import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button, Select, Radio, Row, Col } from 'antd';
import { connect } from 'dva';
import { posRemain2 } from '@/utils/utils';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ winningRecord, loading }) => ({
  winningRecord,
  submitLoading: loading.effects['winningRecord/deliveryManage'],
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      fileList: [],
      infoData: {},
      lotteryType:0,   //奖品类型
    };
  }
  changeVisible = visible => {
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form, type, getList } = this.props;
    const { infoData} = this.state;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        res=await dispatch({
            type: 'winningRecord/deliveryManage',
            payload: {
              ...values,
              id:infoData.id
            }
          })
        if (res && res.status === 1) {
          message.success(res.statusDesc)
          this.changeVisible(false)
          getList(this.props.currPage, this.props.pageSize)
        } else message.error(res.statusDesc)
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);
  }
  render() {
    const {
      form: { getFieldDecorator },
      natureList
    } = this.props;
    const { infoData } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={'发货'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <span>确认供应商已发货，并填写物流信息</span>
          <br/>
          <FormItem label="物流单号" {...formConfig}>
            {getFieldDecorator('deliveryId', {
              // rules: [{
              //   required: true,
              //   message: '请输入物流单号',
              // }],
              initialValue: infoData && infoData.deliveryId,
            })(<Input maxLength={50} placeholder={'请输入物流单号'} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
