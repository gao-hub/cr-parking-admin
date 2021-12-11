import React, { Component } from 'react';
import { Modal, Form, Input, Select, Radio, message } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';

const FormItem = Form.Item;
const { Option } = Select;

const typeOption = [
  {
    label: '实物产品',
    value: 1,
  },
  {
    label: '现金红包',
    value: 0,
  },
];

@Form.create()
@connect(({ setPrize, loading }) => ({
  setPrize,
  loading: loading.effects['setPrize/addPrizeSetting'] ||
    loading.effects['setPrize/editPrizeSetting'] ||
    loading.effects['setPrize/getPrizeInfo'],
}))
export default class ModifyForm extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    data: {},
    subject: [], //发放主体
    gearsList: [], // 档位列表
    defaultImage: '', // 红包默认图片
  };

  componentDidMount() {
    this.props.getChild(this);
  }

  setVisible = () => {
    let { visible } = this.state;
    let { actionType, actionId } = this.props;
    if (visible) {
      this.props.form.resetFields();
      this.setState({
        data: {}
      })
    } else {
      actionType === 'edit' && this.getPrizeSetting({ id: actionId });
    }
    this.setState({
      visible: !visible,
    });
  };

  // 获取奖品设置
  getPrizeSetting = async (payload) => {
    let res = await this.props.dispatch({
      type: 'setPrize/getInfo',
      payload,
    });
    if (res && res.status === 1) {
      this.setState({
        data: res.data,
      });
    } else message.error(res.statusDesc);
  };

  // 奖品类型状态改变
  changePrizeType = async e => {
    let { data } = this.state;
    let { defaultImage } = this.props.setPrize;
    await this.setState({
      data: {
        ...data,
        prizeType: e.target.value,
      },
    });
    // 红包
    if (e.target.value === 0) {
      if (!data.prizeImg) {
        this.props.form.setFieldsValue({
          prizeImg: defaultImage,
        });
      }
    } else {
      if (!data.prizeImg) {
        this.props.form.setFieldsValue({
          prizeImg: '',
        });
      }
    }
  };

  handleOk = () => {
    let {
      actionType, actionId,activityId
    } = this.props;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        values.activityId = activityId;
        if (actionType === 'add') {
          res = await this.props.dispatch({
            type: 'setPrize/addPrize',
            payload: values,
          });
        } else {
          res = await this.props.dispatch({
            type: 'setPrize/editPrize',
            payload: {
              ...values,
              id: actionId,
            },
          });
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.setVisible();
          this.props.getList();
        } else message.error(res.statusDesc);
      }
    });
  };

  render() {
    const {
      form, actionType,
      setPrize: {
        gradesSelect,
        businessSelect,
        defaultImage,
      },
    } = this.props;
    const { data, visible } = this.state;
    const { getFieldDecorator } = form;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };

    return (
      <>
        <Modal
          title={actionType === 'add' ? '添加奖品设置' : '修改奖品设置'}
          bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
          visible={visible}
          destroyOnClose={true}
          onOk={this.handleOk}
          maskClosable={false}
          onCancel={this.setVisible}
        >
          <Form>
            <FormItem label='档位' {...formConfig}>
              {
                getFieldDecorator('activityGradeId', {
                  rules: [{ required: true, message: '请选择档位' }],
                  initialValue: data && data.activityGradeId,
                })(
                  <Select>
                    {
                      gradesSelect.map(item => (
                        <Option key={item.value} value={item.value}>{item.title}</Option>
                      ))
                    }
                  </Select>,
                )
              }
            </FormItem>
            <FormItem label='标题' {...formConfig}>
              {
                getFieldDecorator('prizeName', {
                  rules: [{ required: true, message: '请填写标题' }],
                  initialValue: data && data.prizeName,
                })(
                  <Input maxLength={30} placeholder='请输入标题'></Input>,
                )
              }
            </FormItem>
            <FormItem label='奖品类型' {...formConfig}>
              {
                getFieldDecorator('prizeType',
                  {
                    rules: [{ required: true, message: '请选择奖品类型' }],
                    initialValue: data && data.prizeType,
                  })(
                  <Radio.Group onChange={this.changePrizeType}>
                    {
                      typeOption.map(item => (
                        <Radio key={item.value} value={item.value}>{item.label}</Radio>
                      ))
                    }
                  </Radio.Group>,
                )
              }
            </FormItem>
            {
              data.prizeType === 0 && (
                <FormItem label='现金红包' {...formConfig}>
                  {
                    getFieldDecorator('rewardAmount', {
                      rules: [
                        {
                          required: true,
                          message: '请输入现金红包',
                        },
                        {
                          pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                          message: '奖励金额输入不正确',
                        },
                      ],
                      initialValue: data && data.rewardAmount
                    })(
                      <Input maxLength={6} placeholder='请输入' addonAfter='元' />,
                    )
                  }
                </FormItem>
              )
            }
            {
              data.prizeType === 0 && (
                <FormItem label='发放主体' {...formConfig}>
                  {
                    getFieldDecorator('businessAccountId',
                      {
                        rules: [{ required: true, message: '请选择发放主体' }],
                        initialValue: data && data.businessAccountId,
                      })(
                      <Select>
                        {
                          businessSelect.map(item => (
                            <Option key={item.value} value={item.value}>{item.title}</Option>
                          ))
                        }
                      </Select>,
                    )
                  }
                </FormItem>
              )
            }
            {
              data.prizeType === 1 && (
                <FormItem
                  {...formConfig}
                  label={'图片'}
                  extra={<span style={{ fontSize: '10px' }}>(注：建议尺寸96x96像素，支持JPG、PNG、JPEG格式)</span>}
                >
                  {getFieldDecorator('prizeImg', {
                    rules: [{
                      required: true,
                      message: '请上传图片',
                    }],
                    initialValue: data && data.prizeImg,
                  })(
                    <Upload
                      defaultUrl={data && data.prizeImg}
                      uploadConfig={{
                        action: `${_baseApi}/activityPrize/upload`,
                        fileType: ['image'],
                        notIncludeGif: true,
                        size: 3,
                        // imgSize: {
                        //   width: 96,
                        //   height: 96,
                        // },
                      }}
                      setIconUrl={url => {
                        form.setFieldsValue({ prizeImg: url });
                        this.setState({
                          data: {
                            ...data,
                            prizeImg: url,
                          },
                        });
                      }}
                    >
                    </Upload>,
                  )}
                </FormItem>
              )
            }
            {
              data.prizeType === 0 && (
                <FormItem
                  {...formConfig}
                  label={'图片'}
                  extra={<span style={{ fontSize: '10px' }}>(注：建议尺寸96x96像素，支持JPG、PNG、JPEG格式)</span>}
                >
                  {getFieldDecorator('prizeImg', {
                    rules: [{
                      required: true,
                      message: '请上传图片',
                    }],
                    initialValue: data && data.prizeImg,
                  })(
                    <Upload
                      defaultUrl={data && (data.prizeImg || defaultImage)}
                      uploadConfig={{
                        action: `${_baseApi}/activityPrize/upload`,
                        fileType: ['image'],
                        size: 3,
                        // imgSize: {
                        //   width: 96,
                        //   height: 96,
                        // },
                      }}
                      setIconUrl={url => {
                        form.setFieldsValue({ prizeImg: url });
                        this.setState({
                          data: {
                            ...data,
                            prizeImg: url,
                          },
                        });
                      }}
                    >
                    </Upload>,
                  )}
                </FormItem>
              )
            }
            <FormItem label='成本价' {...formConfig}>
              {
                getFieldDecorator('costPrice', {
                  rules: [
                    {
                      required: true,
                      message: '请输入成本价',
                    },
                    {
                      pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                      message: '成本价输入不正确',
                    },
                  ],
                  initialValue: data && data.costPrice,
                })(
                  <Input placeholder='请输入' addonAfter='元' />,
                )
              }
            </FormItem>
            <FormItem label='排序' {...formConfig}>
              {
                getFieldDecorator('sortId', {
                  initialValue: data && data.sortId,
                })(
                  <Input placeholder='请输入' />,
                )
              }
              <div style={{ color: 'gray' }}>同档位奖品展示顺序</div>
            </FormItem>
          </Form>
        </Modal>
      </>

    );
  }
}
