import React, { PureComponent, Fragment } from 'react';
import { Modal, Form, Input, Radio, Select, message, DatePicker } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';
import moment from 'moment';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

@Form.create()
@connect(({ homeConfig, loading, user }) => ({
  user,
  homeConfig,
  submitLoading: loading.effects['homeConfig/modifyManage'],
}))
class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      fileList: [],
      jumpPageRadio: [
        {
          key: '1',
          value: '1',
          title: '无',
        },
        {
          key: '2',
          value: '2',
          title: '自定义URL',
        },
      ],
      stateRadio: [
        {
          key: '1',
          value: 1,
          title: '启用',
        },
        {
          key: '2',
          value: 0,
          title: '禁用',
        },
      ],
      // advertType: [
      //   {
      //     key: '1',
      //     value: 1,
      //     title: '首页banner',
      //   },
      //   {
      //     key: '2',
      //     value: 2,
      //     title: '金刚区',
      //   },
      // ],
      jumpPageSelected: '0',
    };
  }

  componentDidMount() {
    const {
      getChildData,
      homeConfig: { modifyInfoData },
    } = this.props;

    if (modifyInfoData ? modifyInfoData.contentUrl : '') {
      this.setState({
        jumpPageSelected: '2',
      });
    }

    getChildData(this);
  }

  changeVisible = visible => {
    const { dispatch } = this.props;
    if (visible) {
      // dispatch({
      //   type: 'homeConfig/getAdSpace',
      //   payload: {},
      // });
      // dispatch({
      //   type: 'homeConfig/getAdPlatform',
      //   payload: {},
      // });
    }
    if (!visible) {
      dispatch({
        type: 'homeConfig/setModifyInfo',
        payload: {},
      });
      this.setState({
        jumpPageSelected: '1',
      });
    }
    this.setState({
      visible,
    });
  };

  handleOk = async () => {
    const {
      dispatch,
      form,
      homeConfig: { modifyInfoData },
      user,
    } = this.props;
    const { jumpPageSelected } = this.state;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        const copyValues = values;
        const { homeConfig = {}, getList, currPage, pageSize } = this.props;
        if (copyValues.rangeTime && copyValues.rangeTime.length) {
          copyValues.startTime = moment(copyValues.rangeTime[0]).format('YYYY-MM-DD');
          copyValues.endTime = moment(copyValues.rangeTime[1]).format('YYYY-MM-DD');
          delete copyValues.rangeTime;
        }
        if (jumpPageSelected === '1') {
          copyValues.contentUrl = '';
        }
        // 广告位类型，默认首页
        copyValues.advertType = 1;
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'homeConfig/modifyManage',
            payload: {
              ...copyValues,
              id: homeConfig.modifyInfoData.id,
            },
          });
        } else {
          res = await dispatch({
            type: 'homeConfig/addManage',
            payload: copyValues,
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

  jumpPageChange = e => {
    const {
      dispatch,
      homeConfig: { modifyInfoData },
    } = this.props;
    if (e.target.value === '1') {
      this.setState({
        jumpPageSelected: e.target.value,
      });
      dispatch({
        type: 'homeConfig/setModifyInfo',
        payload: {
          ...modifyInfoData,
          contentUrl: '',
        },
      });
    } else {
      this.setState({
        jumpPageSelected: e.target.value,
      });
    }
  };

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  disabledDate = current =>
    // Can not select days before today and today
    current && current < moment().startOf('day');

  disabledRangeTime = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => this.range(0, 60).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  };

  render() {
    const {
      form = {},
      homeConfig: { modifyInfoData, adSpace = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const {
      visible = false,
      fileList,
      jumpPageRadio,
      jumpPageSelected,
      stateRadio,
      // advertType,
    } = this.state;

    return (
      <Modal
        title={modifyInfoData.id ? '修改' : '添加'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="广告位" {...formConfig}>
            {/* {getFieldDecorator('advertType', {
              rules: [{ required: true, message: '请输入广告位' }],
              initialValue: modifyInfoData && modifyInfoData.advertType,
            })(
              <Select placeholder="请输入广告位">
                {Array.isArray(advertType) &&
                  advertType.map(item => (
                    <Option key={item.key} value={item.value}>
                      {item.title}
                    </Option>
                  ))}
              </Select>
            )} */}
            首页banner
          </FormItem>

          <FormItem label="广告名称" {...formConfig}>
            {getFieldDecorator('advertName', {
              rules: [{ required: true, message: '请输入广告名称' }],
              initialValue: modifyInfoData && modifyInfoData.advertName,
            })(<Input maxLength={20} placeholder="请输入广告名称" />)}
          </FormItem>

          <FormItem label="广告图片" {...formConfig}>
            {getFieldDecorator('imageUrl', {
              rules: [{ required: true, message: '请上传广告图片' }],
              initialValue: modifyInfoData && modifyInfoData.imageUrl,
            })(
              <Upload
                defaultUrl={modifyInfoData && modifyInfoData.imageUrl}
                uploadConfig={{
                  action: `${_baseApi}/travelAdvert/upload`,
                  fileType: ['image'],
                  size: 3,
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

          <FormItem label="跳转页面" {...formConfig}>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择跳转页面' }],
              initialValue: modifyInfoData && modifyInfoData.contentUrl ? '2' : '1',
            })(
              <Radio.Group onChange={this.jumpPageChange}>
                {Array.isArray(jumpPageRadio) &&
                  jumpPageRadio.map(item => (
                    <Radio key={item.key} value={item.value}>
                      {item.title}
                    </Radio>
                  ))}
              </Radio.Group>
            )}
          </FormItem>

          {modifyInfoData.contentUrl || jumpPageSelected === '2' ? (
            <Fragment>
              <FormItem label="URL" {...formConfig}>
                {getFieldDecorator('contentUrl', {
                  rules: [{ required: true, message: '请输入页面地址' }],
                  initialValue: modifyInfoData && modifyInfoData.contentUrl,
                })(<Input maxLength={250} placeholder="请输入URL" />)}
              </FormItem>
            </Fragment>
          ) : null}
          <FormItem label="排序" {...formConfig}>
            {getFieldDecorator('sorted', {
              rules: [{ required: true, message: '请输入排序' }],
              initialValue: modifyInfoData && modifyInfoData.sorted,
            })(<Input placeholder="请输入排序" maxLength={3} />)}
          </FormItem>
          <FormItem label="广告描述" {...formConfig}>
            {getFieldDecorator('remark', {
              rules: [{ required: false, message: '请输入广告描述' }],
              initialValue: modifyInfoData && modifyInfoData.remark,
            })(<Input maxLength={200} placeholder="请输入广告描述" />)}
          </FormItem>

          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择状态' }],
              initialValue: modifyInfoData && modifyInfoData.status,
            })(
              <Radio.Group>
                {Array.isArray(stateRadio) &&
                  stateRadio.map(item => (
                    <Radio key={item.key} value={item.value}>
                      {item.title}
                    </Radio>
                  ))}
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="展示时间" {...formConfig}>
            {getFieldDecorator('rangeTime', {
              rules: [{ required: true, message: '请选择展示时间' }],
              initialValue: modifyInfoData && modifyInfoData.rangeTime,
            })(
              <RangePicker disabledDate={this.disabledDate} disabledTime={this.disabledRangeTime} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Modify;
