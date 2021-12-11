import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio, Select, message, DatePicker, Col, Row } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';
import moment from 'moment';


const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker

@Form.create()
@connect(({ advertManage, loading }) => ({
  advertManage,
  submitLoading: loading.effects['advertManage/modifyManage'],
}))
class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      advertPosition: '',
      visible: false,
      fileList: [],
      startTime: null,
      endTime: null
    };
  }

  componentDidMount() {
    const { getChildData } = this.props;
    getChildData(this);
  }

  changeVisible = visible => {
    const { dispatch } = this.props;
    if (!visible) {
      dispatch({
        type: 'advertManage/setModifyInfo',
        payload: {},
      });
    }
    this.setState({
      visible,
      startTime: null,
      endTime: null
    });
  };

  // 选择时间
  onChangeTime = (date) => {
    console.log(date)
    const { form } = this.props
    const { setFieldsValue } = form;
    if (date.length > 0) {
      let startTime = date[0].format('YYYY-MM-DD')
      let endTime = date[1].format('YYYY-MM-DD')
      this.setState({
        startTime,
        endTime
      })
      setFieldsValue({
        showTime: `${startTime}-${endTime}`
      })
    }
  }
  // 禁止选中时间
  disabledDateTime = current => {
    return current && current < moment().subtract(1, 'days');
  }

  handleOk = async () => {
    const {
      dispatch,
      form,
      advertManage: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        const { advertManage = {}, getList, currPage, pageSize } = this.props;
        const { startTime, endTime } = this.state
        const  showTime  = values['showTime']
        const obj = {
          '2': 21,
          '4': 41,
          '5': 51
        }
        // 处理广告位
        if(this.props.tabIndex !== '1'){
          values.advertPositionId = obj[this.props.tabIndex];
        }
        values['showTime'] = startTime === null ?`${startTime}-${endTime}`:
        `${showTime[0].format('YYYY-MM-DD')}-${showTime[1].format('YYYY-MM-DD')}`

        if (modifyInfoData.id) {
          values ['startTime'] = startTime === null ?showTime[0].format('YYYY-MM-DD'):startTime;
          values ['endTime'] = endTime === null ?showTime[1].format('YYYY-MM-DD'):endTime;
          res = await dispatch({
            type: 'advertManage/modifyManage',
            payload: {
              ...values,
              id: advertManage.modifyInfoData.id,
              advertType: this.props.tabIndex
            },
          });
        } else {
          res = await dispatch({
            type: 'advertManage/addManage',
            payload: {
              ...values,
              startTime,
              endTime,
              advertType: this.props.tabIndex,
            }
          });
        }
        if (res && res.status === 1) {
          this.changeVisible(false);
          message.success(res.statusDesc);
          getList(currPage, pageSize);
        } else message.error(res.statusDesc);
      }
    });
  };


  render() {
    const conslistObj = {
      '2': '发现banner',
      '4': '插屏广告',
      '5': '活动悬浮窗'
    }
    const {
      form = {},
      advertManage: { modifyInfoData, initData },
    } = this.props;
    const { getFieldDecorator, setFieldsValue } = form;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const { visible = false, fileList, advertPosition } = this.state;

    return (
      <Modal
        title={modifyInfoData.id ? '修改' : '添加'}
        width={600}
        visible={visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose
        confirmLoading={this.props.submitLoading ? true : false}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          {
            this.props.tabIndex === '1' ?
            <FormItem label="广告位" {...formConfig}>
              {getFieldDecorator('advertPositionId',{
                rules: [
                  {
                    required: true,
                    validator: (rules, val, callback) => {
                      if (!val) {
                        callback('请选择广告名称')
                      }
                      callback()
                    }
                  }
                ],
                initialValue: modifyInfoData && modifyInfoData.advertPositionId,
              })(
                <Select placeholder={'请选择'} onChange={val=>{
                  this.setState({
                    advertPosition: val
                  })
                  this.props.form.setFieldsValue({
                    advertColor: ''
                  })
                }}>
                  {
                    initData.frontPagePositions && initData.frontPagePositions.map(item => {
                      return (
                        <Option key={item.key} value={item.value}>
                          {item.title}
                        </Option>
                      );
                    })
                  }
                </Select>
              )}
            </FormItem>
              :
            <FormItem label="广告位" {...formConfig}>
              {conslistObj[this.props.tabIndex]}
            </FormItem>
          }
          <FormItem label="广告名称" {...formConfig}>
            {getFieldDecorator('advertName', {
              rules: [
                {
                  required: true,
                  validator: (rules, val, callback) => {
                    if (!val) {
                      callback('请输入广告名称')
                    }
                    callback()
                  }
                }
              ],
              initialValue: modifyInfoData && modifyInfoData.advertName,
            })(<Input placeholder="请输入广告名称" maxLength={20} />)}
          </FormItem>

          <FormItem label="广告图片" {...formConfig}>
            {getFieldDecorator('imageUrl', {
              rules: [{ required: true, message: '请上传广告图片' }],
              initialValue: modifyInfoData && modifyInfoData.imageUrl,
            })(
              <Upload
                defaultUrl={modifyInfoData && modifyInfoData.imageUrl}
                uploadConfig={{
                  action: `${_baseApi}/poster/upload`,
                  fileType: ['image'],
                  size: 2,
                }}
                setIconUrl={url => form.setFieldsValue({ imageUrl: url })}
              >
                {fileList.length && fileList[0].response && fileList[0].response.status == '99' ? (
                  <span style={{ color: 'red', marginLeft: '5px' }}>
                    {fileList[0].response.statusDesc}
                  </span>
                ) : null}
              </Upload>
            )}
          </FormItem>
          {
            (advertPosition === 11 || advertPosition === 12) &&
            <FormItem label="背景色值" {...formConfig}>
              {getFieldDecorator('advertColor', {
                rules: [{ required: true, message: '请输入背景色值' }],
                initialValue: modifyInfoData && modifyInfoData.advertColor,
              })(<Input placeholder="请输入" maxLength={20} />)}
            </FormItem>
          }
          <FormItem label="页面地址" {...formConfig}>
            {getFieldDecorator('jumpUrl', {
              rules: [{ required: false, message: '请输入页面地址' }],
              initialValue: modifyInfoData && modifyInfoData.jumpUrl,
            })(<Input placeholder="请输入页面地址" maxLength={250} />)}
          </FormItem>

          <FormItem label="排序" {...formConfig}>
            {getFieldDecorator('sortid', {
              rules: [
                {
                  required: true,
                  validator: (rules, value, callback) => {
                    if (!value) {
                      callback('请输入排序')
                    }
                    if (isNaN(value - 0) || !((value - 0).toString()).match(/(^[1-9]\d*$)/)) callback('请输入正整数')
                    callback()
                  }
                }
              ],
              initialValue: modifyInfoData && modifyInfoData.sortid,
            })(<Input placeholder="请输入" maxLength={3} />)}
          </FormItem>

          <FormItem label="广告描述" {...formConfig}>
            {getFieldDecorator('remark', {
              rules: [{ required: false, message: '请输入广告描述' }],
              initialValue: modifyInfoData && modifyInfoData.remark,
            })(<Input placeholder="请输入广告描述" maxLength={200} />)}
          </FormItem>

          <Form.Item label="展示时间" {...formConfig} >

            {getFieldDecorator('showTime', {
              rules: [{ required: true, message: '请输入展示时间' }],
              initialValue: modifyInfoData && modifyInfoData.showTime,
            })(<RangePicker disabledDate={this.disabledDateTime} onChange={this.onChangeTime} />)}
          </Form.Item>



          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择状态' }],
              initialValue: modifyInfoData && modifyInfoData.status,
            })(
              <Radio.Group>
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

export default Modify;
