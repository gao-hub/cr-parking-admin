import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Select, Col } from 'antd';
import { connect } from 'dva';
import { posRemain2 } from '@/utils/utils';
import { getParentUtmList } from './services';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
@connect(({ prizeManage, loading }) => ({
  prizeManage,
  submitLoading: loading.effects['prizeManage/modifyManage'],
}))

export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined
    };
  }

  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'prizeManage/setModifyInfo',
        payload: {},
      });
    }
    this.setState({
      visible,
    });
  };



  handleOk = async () => {
    const { dispatch, form, prizeManage: { modifyInfoData }, activityId } = this.props;
    console.log(this.props)
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        if (modifyInfoData.id) {
          if(values.breachRate==''){
            values.breachRate=null
          }
          res = await dispatch({
            type: 'prizeManage/modifyManage',
            payload: {
              ...values,
              id: modifyInfoData.id,
              activityId
            },
          });

        } else {
          res = await dispatch({
            type: 'prizeManage/addManage',
            payload: {
              ...values,
              activityId
            },
            
          });
        }
        if (res && res.status === 1) {
          this.changeVisible(false);
          message.success(res.statusDesc);
          this.props.getList(this.props.currPage, this.props.pageSize);
        } else message.error(res.statusDesc);
      }
    });
  };

  componentDidMount() {
    this.props.getChildData(this);
  }


  render() {
    const { form: { getFieldDecorator }, prizeManage: { modifyInfoData, prizeSelect } } = this.props;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        title={modifyInfoData.id ? '修改' : '添加'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
    
          <FormItem
            label="标题"
            {...formConfig}
          >
            {getFieldDecorator('prizeName', {
              rules: [{ required: true, message: '请输入标题' }],
              initialValue: modifyInfoData && modifyInfoData.prizeName,
            })(
              <Input placeholder={'请输入标题'} maxLength={6}/>,
            )}
          </FormItem>
          <FormItem label="奖品金额"  {...formConfig}>
            {getFieldDecorator('rewardAmount', {
              rules: [          
                {
                  required: true,
                  validator: (rule, val, cb) => {
                    let reg = /^[0-9]{1,8}(\.[0-9]{1,2})?$/
                    if (val == null || val == '') {
                      cb('请输入奖品金额');
                    }else if (!reg.test(val)) {
                      cb('请输入正确的奖品金额');
                    } else cb();

                  },
                },
              ],
              initialValue:
                modifyInfoData && (modifyInfoData.rewardAmount != null && modifyInfoData.rewardAmount != '')
                  ? modifyInfoData.rewardAmount
                  : null,
            })(<Input addonAfter={'元'} maxLength={8} placeholder={'请输入奖品金额'}/>)}
          </FormItem>
        
          <FormItem
            label="发放主体"
            {...formConfig}
          >
            {getFieldDecorator('businessAccountId', {
              rules: [{ required: true, message: '请选择' }],
              initialValue: modifyInfoData && modifyInfoData.businessAccountId,
            })(
              <Select allowClear placeholder='请选择'>
                {
                  prizeSelect && prizeSelect.map(v=>{
                    return (
                      <Select.Option key={v.key} value={v.value}>{v.title}</Select.Option>
                    )
                  })
                }
              </Select>,
            )}
          </FormItem>
          <FormItem label="中奖概率"  {...formConfig}>
            {getFieldDecorator('winningProbability', {
              rules: [
                {
                  required: true,
                  validator: (rule, val, cb) => {
                    if (val == null || val == '') {
                      cb('请输入中奖概率');
                    }else  if (
                      val < 0 || val > 100 || isNaN(val)
                    ) {
                      cb('请输入有效中奖概率');
                    } else {
                      cb();
                    }
                  },
                },
              ],
              initialValue:
                modifyInfoData && (modifyInfoData.winningProbability != null && modifyInfoData.winningProbability != '')
                  ? modifyInfoData.winningProbability
                  : null,
            })(<Input addonAfter={'%'} placeholder={'请输入中奖概率'}/>)}
          </FormItem>
        
        </Form>
      </Modal>
    );
  }
}
