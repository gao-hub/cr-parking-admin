import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, InputNumber, Radio, Row, Col } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';
import style from './index.less';
import { debounce } from '@/utils/utils';
// 表单校验规则
const rules = {
  activityName: [{ required: true, message: '请输入活动名称' }],
  activityImg: [{ required: true, message: '请选择活动banner' }],
  backgroundOne: [{ required: true, message: '请选择标题背景图1' }],
  backgroundTwo: [{ required: true, message: '请选择标题背景图2' }],
  backcolorOne: [{ required: true, message: '请输入色值' }],
  backcolorTwo: [{ required: true, message: '请输入色值' }],
  spikeNumLimit: [{ required: true, message: '请选择秒杀次数' }],
  activityBatchDuration: [{ required: true, message: '请输入商品秒杀时长' }],
  isUse: [{ required: true, message: '请选择状态' }],
  noticeDuration: [{ required: true, message: '请输入活动预告' }],
};
// 秒杀次数
const spikesNumberOption = [
  {
    value: 0,
    label: '不限制',
  },
  {
    value: 2,
    label: '用户在同一活动批次中仅可参与一次秒杀',
  },
  {
    value: 1,
    label: '用户每次活动仅可参与一次秒杀',
  },
  {
    value: 3,
    label: '用户每天仅可参与一次秒杀',
  },
];
const FormItem = Form.Item;
@Form.create()
@connect(({ commodityManagement }) => ({
  commodityManagement,
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: {},
    };
  }

  componentDidMount() {
    this.props.getChildData(this);
  }

  // 切换每人限购
  changeSpikeNumLimit = e => {
    const { data } = this.state;
    this.setState({ data: { ...data, spikeNumLimit: e.target.value } });
  };

  // 切换状态
  changeIsUse = e => {
    const { data } = this.state;
    this.setState({ data: { ...data, isUse: e.target.value } });
  };

  // 控制弹窗
  changeVisible = (visible, data) => {
    this.setState({
      visible,
      data,
    });
    this.props.form.resetFields();
  };

  // 提交
  handleOk = async () => {
    const { form, dispatch, getList, currPage, pageSize, actionType } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      const obj = { ...values, id: this.state.data.id };
      if (obj.buyGoodsLimitStatus == 1 && obj.buyGoodsLimitNum < 1) {
        message.warning('每人限购不可小于0件');
        return;
      }
      if (obj.buyGoodsLimitStatus == 0) {
        obj.buyGoodsLimitNum = null;
      }
      if (!err) {
        let res = {};
        if (actionType === 'add') {
          res = await dispatch({
            type: 'commodityManagement/addActivity',
            payload: obj,
          });
        } else {
          res = await dispatch({
            type: 'commodityManagement/editActivity',
            payload: obj,
          });
        }
        if (res && res.status === 1) {
          this.changeVisible(false, {});
          message.success(res.statusDesc);
          getList(currPage, pageSize);
        } else {
          message.error(res.statusDesc);
        }
      }
    });
  };

  // 切换每人限购
  changeBuyGoodsLimit = e => {
    if (e.target.value === 0) {
      this.props.form.setFieldsValue({
        buyGoodsLimitNum: null,
      });
    }
  };

  render() {
    const radioStyle = {
      display: 'block',
      height: '40px',
      lineHeight: '40px',
    };
    const {
      form: { getFieldDecorator },
      actionType,
    } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
    };
    const { data } = this.state;
    return (
      <Modal
        title={actionType === 'add' ? '添加' : '修改'}
        width="50%"
        visible={this.state.visible}
        onOk={debounce(this.handleOk, 800)}
        maskClosable={false}
        destroyOnClose
        onCancel={() => this.changeVisible(false, {})}
      >
        <Form>
          <FormItem label="活动名称" {...formConfig}>
            {getFieldDecorator('activityName', {
              rules: rules.activityName,
              initialValue: data && data.activityName,
            })(<Input maxLength={20} placeholder="请输入活动名称" />)}
          </FormItem>
          <FormItem label="活动banner" {...formConfig}>
            {(actionType === 'add' || (actionType !== 'add' && data.activityImg)) &&
              getFieldDecorator('activityImg', {
                rules: rules.activityImg,
                initialValue: data && data.activityImg,
              })(
                <Upload
                  defaultUrl={(data && data.activityImg) || ''}
                  uploadConfig={{
                    action: `${_baseApi}/activityPrize/upload`,
                    fileType: ['image'],
                    size: 2,
                  }}
                  setIconUrl={url => {
                    this.props.form.setFieldsValue({ activityImg: url });
                  }}
                />
              )}
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem label="标题背景图1" {...formItemLayout}>
                {(actionType === 'add' || (actionType !== 'add' && data.backgroundOne)) &&
                  getFieldDecorator('backgroundOne', {
                    rules: rules.backgroundOne,
                    initialValue: data && data.backgroundOne,
                  })(
                    <Upload
                      defaultUrl={(data && data.backgroundOne) || ''}
                      uploadConfig={{
                        action: `${_baseApi}/activityPrize/upload`,
                        fileType: ['image'],
                        size: 2,
                      }}
                      setIconUrl={url => {
                        this.props.form.setFieldsValue({ backgroundOne: url });
                      }}
                    />
                  )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="标题背景图2" {...formItemLayout}>
                {(actionType === 'add' || (actionType !== 'add' && data.backgroundTwo)) &&
                  getFieldDecorator('backgroundTwo', {
                    rules: rules.backgroundTwo,
                    initialValue: data && data.backgroundTwo,
                  })(
                    <Upload
                      defaultUrl={(data && data.backgroundTwo) || ''}
                      uploadConfig={{
                        action: `${_baseApi}/activityPrize/upload`,
                        fileType: ['image'],
                        size: 2,
                      }}
                      setIconUrl={url => {
                        this.props.form.setFieldsValue({ backgroundTwo: url });
                      }}
                    />
                  )}
              </FormItem>
            </Col>
          </Row>
          <FormItem label={<span className={style.actName}>背景色</span>} {...formConfig}>
            <FormItem style={{ display: 'inline-block', marginRight: '10px' }}>
              {getFieldDecorator('backcolorOne', {
                rules: rules.backcolorOne,
                initialValue: data && data.backcolorOne,
              })(<Input maxLength={20} placeholder="请输入色值" />)}
            </FormItem>
            {' —— '}
            <FormItem style={{ display: 'inline-block', marginLeft: '10px' }}>
              {getFieldDecorator('backcolorTwo', {
                rules: rules.backcolorTwo,
                initialValue: data && data.backcolorTwo,
              })(<Input maxLength={20} placeholder="请输入色值" />)}
            </FormItem>
          </FormItem>
          <FormItem label="商品秒杀时长" {...formConfig}>
            {getFieldDecorator('activityBatchDuration', {
              rules: rules.activityBatchDuration,
              initialValue: data && data.activityBatchDuration,
            })(
              <InputNumber
                disabled={data && (data.isStartSeckill === 2 || data.isStartSeckill === 3)}
                min={0}
                max={200}
                style={{ marginRight: '10px' }}
              />
            )}
            小时
          </FormItem>
          <FormItem label="秒杀次数" {...formConfig}>
            {getFieldDecorator('spikeNumLimit', {
              rules: rules.spikeNumLimit,
              initialValue: data && data.spikeNumLimit,
            })(
              <Radio.Group onChange={this.changeSpikeNumLimit}>
                {spikesNumberOption.map(item => (
                  <Radio style={radioStyle} key={item.value} value={item.value}>
                    {item.label}
                  </Radio>
                ))}
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="每人限购" {...formConfig}>
            {getFieldDecorator('buyGoodsLimitStatus', {
              initialValue: data && data.buyGoodsLimitStatus,
            })(
              <Radio.Group onChange={this.changeBuyGoodsLimit}>
                <Radio style={radioStyle} key={0} value={0}>
                  不限购
                </Radio>
                <Radio style={radioStyle} key={1} value={1}>
                  每款商品每人可购买
                  {
                    <FormItem
                      {...formConfig}
                      style={{ display: 'inline-block', margin: '0 10px 0 10px' }}
                    >
                      {getFieldDecorator('buyGoodsLimitNum', {
                        initialValue: data && data.buyGoodsLimitNum,
                      })(<InputNumber min={0} max={200} precision={0} />)}
                    </FormItem>
                  }
                  件
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="活动预告" {...formConfig}>
            活动开始前
            {getFieldDecorator('noticeDuration', {
              initialValue: data && data.noticeDuration,
              rules: rules.noticeDuration,
            })(<InputNumber min={0} max={200} style={{ margin: '0 10px 0 10px' }} />)}
            小时前台展示预告
          </FormItem>
          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('isUse', {
              rules: rules.isUse,
              initialValue: data && data.isUse,
            })(
              <Radio.Group onChange={this.changeIsUse}>
                <Radio key={1} value={1}>
                  启用
                </Radio>
                <Radio key={0} value={0}>
                  禁用
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
