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
@connect(({ lotterySetting, loading }) => ({
  lotterySetting,
  submitLoading: loading.effects['lotterySetting/modifyManage'],
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
    const { dispatch, form} = this.props;
    const { id, totalNum } = this.state.infoData;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if(values.changeNumType < 0 && values.changeNum > totalNum){
          message.warning('减少的库存数量不能大于现有库存数量');
          return;
        }
        let res;
        res = await dispatch({
          type: 'lotterySetting/modifyStock',
          payload: {
            id,
            changeNum:values.changeNum*values.changeNumType
          }
        })
        if (res && res.status === 1) {
          message.success(res.statusDesc)
          this.changeVisible(false)
          this.props.getList(this.props.currPage, this.props.pageSize)
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
        title={'修改库存'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="当前库存量" required {...formConfig}>
              <span>{infoData.remainingNum}</span>
          </FormItem>
          <FormItem label="修改类型" {...formConfig}>
            {getFieldDecorator('changeNumType', {
              rules: [{ required: true, message: '请选择修改类型' }],
            })(
              <RadioGroup>
                <Radio value={1}>增加库存</Radio>
                <Radio value={-1}>减少库存</Radio>
              </RadioGroup>)}
          </FormItem>
          <FormItem label="请输入" required {...formConfig}>
            {getFieldDecorator('changeNum', {
              rules: [
                {
                  required: true,
                  message: '请输入库存',
                },
                {
                  pattern: /^[+]{0,1}(\d+)$/,
                  message: '库存输入不正确',
                }
              ],
              initialValue: infoData && infoData.changeNum,
            })(<Input maxLength={6} placeholder={'请输入数量'} />)}
          </FormItem>
          <FormItem label="温馨提示" {...formConfig}>
            <span style={{ textAlign: 'center', marginLeft: 10, color: 'gray' }}>
              默认在当前的基础上增加或者减少库存
            </span>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
