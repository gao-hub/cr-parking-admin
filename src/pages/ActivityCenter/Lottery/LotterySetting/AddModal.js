import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button, Select, Radio, Row, Col } from 'antd';
import { connect } from 'dva';
import { posRemain2 } from '@/utils/utils';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';
import { getDefaultImage } from './services';

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
      lotteryType: 1,   //奖品类型
      distributionList: [],
      redEnvelopeImg: ''
    };
  }

  changeVisible = visible => {
    this.setState({
      visible,
      lotteryType: 1
    });
  };
  handleOk = async () => {
    const { dispatch, form } = this.props;
    const { activityId, infoData } = this.state;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        values.winningProbability = values.winningProbabilityNum;
        if (infoData.id) {
          res = await dispatch({
            type: 'lotterySetting/modifyManage',
            payload: {
              id: infoData.id,
              activityId,
              ...values,
            },
          });
        } else {
          res = await dispatch({
            type: 'lotterySetting/addManage',
            payload: {
              activityId,
              ...values,
            },
          });
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc);
          this.changeVisible(false);
          this.props.getList(this.props.currPage, this.props.pageSize);
        } else message.error(res.statusDesc);
      }
    });
  };
  /**
   * 点击切换奖品类型
   * */
  RadioGroup = e => {
    if (e.target.value === 0) {
      this.setState({ lotteryType: 0 });
      if(!this.state.infoData.prizeImg) {
        this.props.form.setFieldsValue({
          prizeImg: this.state.redEnvelopeImg
        })
      }
    } else {
      this.setState({ lotteryType: 1 });
      if(!this.state.infoData.prizeImg) {
        this.props.form.setFieldsValue({
          prizeImg: ''
        })
      }
    }
  };

  componentDidMount() {
    this.props.getChildData(this);
    const { infoData } = this.state;
    this.getInit();
    if(!infoData.id){
      this.getUrl();
    }
  }

  getInit = async () =>{
    const { dispatch } = this.props;
    let res = await dispatch({
      type: 'lotterySetting/getDistribution',
      payload: {},
    });
    if(res && res.status === 1){
      this.setState({
        distributionList: res.data.businessAccounts || []
      })
    }
  }

  getUrl = async () => {
    const res = await getDefaultImage();
    if(res && res.status === 1){
      this.setState({
        redEnvelopeImg: res.data
      })
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { infoData, redEnvelopeImg } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={infoData.id?'编辑奖品':'添加奖品'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="标题" required {...formConfig}>
            {getFieldDecorator('prizeName', {
              rules: [{
                required: true,
                message: '请输入标题',
              }],
              initialValue: infoData && infoData.prizeName,
            })(<Input maxLength={6} placeholder={'请输入标题'}/>)}
          </FormItem>
          <FormItem label="奖品类型" {...formConfig}>
            {getFieldDecorator('prizeType', {
              rules: [{ required: true, message: '请选择奖品类型' }],
              initialValue: infoData && (infoData.prizeType === undefined ? 1 : infoData.prizeType),
            })(
              <RadioGroup onChange={this.RadioGroup}>
                <Radio value={1}>实物产品</Radio>
                <Radio value={0}>现金红包</Radio>
              </RadioGroup>)}
          </FormItem>
          {
            this.state.lotteryType === 0 ?
              <FormItem label="请输入" required {...formConfig}>
                {getFieldDecorator('rewardAmount', {
                  rules: [
                    {
                      required: true,
                      message: '请输入奖励金额',
                    },
                    {
                      pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                      message: '奖励金额输入不正确',
                    }
                  ],
                  initialValue: infoData && infoData.rewardAmount,
                })(<Input maxLength={6} placeholder={'请输入'} addonAfter={'元'}/>)}
              </FormItem>
              : null}
          {
            this.state.lotteryType === 0 ?
              <FormItem label="发放主体" {...formConfig}>
                {getFieldDecorator('businessAccountId', {
                  rules: [{ required: true, message: '请选择发放主体' }],
                  initialValue:
                    infoData && infoData.businessAccountId != null
                      ? infoData.businessAccountId
                      : undefined,
                })(
                  <Select placeholder="请选择" allowClear>
                    {
                      this.state.distributionList.map(item => {
                        return <Option value={item.value} key={item.key}>{item.title}</Option>
                      })
                    }
                  </Select>,
                )}
              </FormItem> : null}
          {
            this.state.lotteryType === 0 &&
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
                initialValue: infoData && (infoData.prizeImg || redEnvelopeImg)
              })(
                <Upload
                  defaultUrl={infoData && (infoData.prizeImg || redEnvelopeImg)}
                  uploadConfig={{
                    action: `${_baseApi}/activityPrize/upload`,
                    fileType: ['image'],
                    size: 3,
                  }}
                  setIconUrl={url => {
                    this.props.form.setFieldsValue({ prizeImg: url });
                    let obj = infoData;
                    obj.prizeImg = url;
                    this.setState({
                      infoData: obj
                    })
                  }}
                >
                  {this.state.fileList.length &&
                  this.state.fileList[0].response &&
                  this.state.fileList[0].response.status == '99' ? (
                    <span style={{ color: 'red', marginLeft: '5px' }}>
                    {this.state.fileList[0].response.statusDesc}
                  </span>
                  ) : null}
                </Upload>,
              )}
            </FormItem>
          }
          {
            this.state.lotteryType === 1 &&
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
                initialValue: infoData && infoData.prizeImg
              })(
                <Upload
                  defaultUrl={infoData && infoData.prizeImg}
                  uploadConfig={{
                    action: `${_baseApi}/activityPrize/upload`,
                    fileType: ['image'],
                    size: 3,
                  }}
                  setIconUrl={url => {
                    this.props.form.setFieldsValue({ prizeImg: url });
                    let obj = infoData;
                    obj.prizeImg = url;
                    this.setState({
                      infoData: obj
                    })
                  }}
                >
                  {this.state.fileList.length &&
                  this.state.fileList[0].response &&
                  this.state.fileList[0].response.status == '99' ? (
                    <span style={{ color: 'red', marginLeft: '5px' }}>
                    {this.state.fileList[0].response.statusDesc}
                  </span>
                  ) : null}
                </Upload>,
              )}
            </FormItem>
          }
          <FormItem
            label="成本价"
            required
            {...formConfig}
          >
            {getFieldDecorator('costPrice', {
              rules: [
                {
                  required: true,
                  message: '请输入成本价',
                },
                {
                  pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                  message: '成本价输入不正确',
                }
              ],
              initialValue: infoData && infoData.costPrice,
            })(
              <Input placeholder={'请输入'} addonAfter={'元'}/>
            )}
          </FormItem>
          <FormItem
            label="库存"
            required
            {...formConfig}
          >
            {getFieldDecorator('totalNum', {
              rules: [{
                  required: true,
                  message: '请输入库存',
                },
                {
                  pattern: /^[+]{0,1}(\d+)$/,
                  message: '库存输入不正确',
                }
              ],
              initialValue: infoData && infoData.totalNum,
            })(
              <Input placeholder={'请输入库存'} maxLength={5}/>,
            )}
          </FormItem>
          <FormItem
            label="中奖概率"
            required
            {...formConfig}
          >
            {getFieldDecorator('winningProbabilityNum', {
              rules: [{
                  required: true,
                  message: '请输入中奖概率',
                },
                {
                  pattern: /^[0-9]{1,9}(\.[0-9]{1,2})?$/,
                  message: '中奖概率输入不正确',
                }
              ],
              initialValue: infoData && infoData.winningProbabilityNum,
            })(
              <Input placeholder={'请输入中奖概率'} addonAfter={'%'}/>,
            )}
          </FormItem>

          <FormItem
            label="中奖限制"
            {...formConfig}
          >
            <Row>
              <Col span={9} style={{ textAlign: 'center' }}>
                每人最多可中此奖
              </Col>
              <Col span={11}>
                <FormItem>
                  {getFieldDecorator('winningLimitNum', {
                    rules: [
                      {
                        validator: (rule, val, cb) => {
                          // if (val == null || val == '' || val == 0) {
                          //   cb('投资金额不能都为0');
                          // } else
                          if (val && !val.toString().match(/^[+]{0,1}(\d+)$/)) {
                            cb(
                              '请输入正确的最多中奖次数',
                            );
                          } else {
                            cb();
                          }
                        },
                      },
                    ],
                    initialValue:
                      infoData && infoData.winningLimitNum != null
                        ? infoData.winningLimitNum
                        : null,
                  })(
                    <Input
                      addonAfter={'次'}
                      placeholder={'请输入'}
                      maxLength={10}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
