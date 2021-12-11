import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Select, Col } from 'antd';
import { connect } from 'dva';
import { posRemain2 } from '@/utils/utils';
import { getParentUtmList } from './services';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
@connect(({ channelManage, loading }) => ({
  channelManage,
  submitLoading: loading.effects['channelManage/modifyManage'],
}))

export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      primaryChannelList: [],   //   一级渠道
    };
  }

  changeVisible = visible => {
    if (!visible) {
      this.props.dispatch({
        type: 'channelManage/setModifyInfo',
        payload: {},
      });
    }
    this.setState({
      visible,
    });
  };

  /**
   * 获取默认链接
   * */
  getDefaultVisible = visible => {
    this.props.dispatch({
      type: 'channelManage/getDefaultInfo',
      payload: {},
    });
  };

  handleOk = async () => {
    const { dispatch, form, channelManage: { modifyInfoData } } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        if (modifyInfoData.id) {
          if(values.breachRate==''){
            values.breachRate=null
          }
          res = await dispatch({
            type: 'channelManage/modifyManage',
            payload: {
              ...values,
              id: this.props.channelManage.modifyInfoData.id,
            },
          });

        } else {
          res = await dispatch({
            type: 'channelManage/addManage',
            payload: values,
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
    this.getParentUtm()
  }

  //   获取一级渠道信息
  getParentUtm = async () => {
    const res = await getParentUtmList()
    if (res && res.status === 1) {
      this.setState({
        primaryChannelList: res.data.parentUtmList || []
      })
    }
  }

  render() {
    const { form: { getFieldDecorator }, channelManage: { modifyInfoData } } = this.props;
    const { primaryChannelList } = this.state;
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
            label="渠道层级"
            {...formConfig}
          >
            {getFieldDecorator('utm', {
              // rules: [{ required: true, message: '请选择状态' }],
              initialValue: 0,
            })(
              <Select disabled>
                <Option key={0} value={0} defaultValue>二级渠道</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem
            label="所属一级渠道"
            {...formConfig}
          >
            {getFieldDecorator('parentUtmId', {
              rules: [{ required: true, message: '请选择所属一级渠道' }],
              initialValue: modifyInfoData && modifyInfoData.parentUtmId,
            })(
              <Select
                placeholder={'请输入所属一级渠道'}
                disabled={modifyInfoData && modifyInfoData.parentUtmId}
              >
                {
                  primaryChannelList.map((item) => <Option key={item.id} value={item.id} defaultValue>{item.utmName}</Option>)
                }
              </Select>,
            )}
          </FormItem>
          <FormItem
            label="渠道名称"
            {...formConfig}
          >
            {getFieldDecorator('utmName', {
              rules: [{ required: true, message: '请输入渠道名称' }],
              initialValue: modifyInfoData && modifyInfoData.utmName,
            })(
              <Input placeholder={'请输入渠道名称'} maxLength={50}/>,
            )}
          </FormItem>
          <FormItem label="提前退货违约金比例"  {...formConfig}>
            {getFieldDecorator('breachRate', {
              rules: [
                {
                  validator: (rule, val, cb) => {
                    if ((val > 20) || (val && (val != '' && !val.toString().match(posRemain2)))) {
                      cb('请输入正确的提前退货违约金比例，提前退货违约金比例不能大于20%');
                    } else cb();
                  },
                },
              ],
              initialValue:
                modifyInfoData && ((modifyInfoData.breachRate != null && modifyInfoData.breachRate != '')||modifyInfoData.breachRate == '0')
                  ? modifyInfoData.breachRate
                  : null,
            })(<Input addonAfter={'%'} placeholder={'请输入提前退货违约金比例'} maxLength={10}/>)}
          </FormItem>
          <FormItem
            label="推广地址"
            {...formConfig}
          >
            {getFieldDecorator('spreadsUrl', {
              rules: [{ required: true, message: '请输入推广地址' }],
              initialValue: modifyInfoData && modifyInfoData.spreadsUrl,
            })(
              <Input placeholder={'https://mmh5.maimaichewei.com/landingPageUser?'} maxLength={200}/>,
            )}
          </FormItem>
          <FormItem
            label="状态"
            {...formConfig}
          >
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择状态' }],
              initialValue: modifyInfoData && modifyInfoData.status,
            })(
              <Select allowClear>
                <Option key={1} value={1}>启用</Option>
                <Option key={0} value={0}>禁用</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem
            label="渠道负责人"
            {...formConfig}
          >
            {getFieldDecorator('utmLeaderName', {
              rules: [],
              initialValue: modifyInfoData && modifyInfoData.utmLeaderName,
            })(
              <Input placeholder={'请输入渠道负责人'} maxLength={20}/>,
            )}
          </FormItem>
          <FormItem
            label="备注"
            {...formConfig}
          >
            {getFieldDecorator('remark', {
              rules: [],
              initialValue: modifyInfoData && modifyInfoData.remark,
            })(
              <TextArea placeholder={'请输入备注'}></TextArea>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
