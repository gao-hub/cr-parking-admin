import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio, Select, message, DatePicker, Col, Row } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';


const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ iconManage, loading }) => ({
  iconManage,
  submitLoading: loading.effects['iconManage/modifyManage'],
}))
class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      fileList: [],
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
        type: 'iconManage/setModifyInfo',
        payload: {},
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
      tabIndex,
      iconManage: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        const { iconManage = {}, getList, currPage, pageSize } = this.props;
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'iconManage/modifyManage',
            payload: {
              ...values,
              id: iconManage.modifyInfoData.id,
              location: this.props.tabIndex,
            },
          });
        } else {
          res = await dispatch({
            type: 'iconManage/addManage',
            payload: {
              ...values,
              location: this.props.tabIndex,
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
      '2': '首页menu',
      '3': '发现',
      '4': '我的'
    }
    const {
      form = {},
      iconManage: { modifyInfoData, initData },
    } = this.props;
    const { getFieldDecorator, setFieldsValue } = form;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const { visible = false, fileList } = this.state;
    const navigationData = [
      { key: 1, value: 1, title: '底部导航1' },
      { key: 2, value: 2, title: '底部导航2' },
      { key: 3, value: 3, title: '底部导航3' },
      { key: 4, value: 4, title: '底部导航4' },
      { key: 5, value: 5, title: '底部导航5' },
    ]
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
            <FormItem label="icon位置" {...formConfig}>
              {getFieldDecorator('locationNo',{
                rules: [
                  {
                    required: true,
                    validator: (rules, val, callback) => {
                      if (!val) {
                        callback('请选择icon位置')
                      }
                      callback()
                    }
                  }
                ],
                initialValue: modifyInfoData && modifyInfoData.locationNo,
              })(
                <Select placeholder={'请选择'}>
                  {
                    navigationData.map(item => {
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
            <FormItem label="icon位置" {...formConfig}>
              {conslistObj[this.props.tabIndex]}
            </FormItem>
          }
          <FormItem label="icon名称" {...formConfig}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  validator: (rules, val, callback) => {
                    if (!val) {
                      callback('请输入icon名称')
                    }
                    callback()
                  }
                }
              ],
              initialValue: modifyInfoData && modifyInfoData.name,
            })(<Input placeholder="请输入" maxLength={4} />)}
          </FormItem>
          {
            this.props.tabIndex === '1' ?
            <div>
              <FormItem label="选中时文字色值" {...formConfig}>
                {getFieldDecorator('colorNo', {
                  rules: [
                    {
                      required: true,
                      message: '请输入选中时文字色值'
                    }
                  ],
                  initialValue: modifyInfoData && modifyInfoData.colorNo,
                })(<Input placeholder="请输入" maxLength={20} />)}
              </FormItem>
              <FormItem label="icon图标-选中样式" {...formConfig}>
                {getFieldDecorator('iconUrl', {
                  rules: [{ required: true, message: '请上传icon图标-选中样式' }],
                  initialValue: modifyInfoData && modifyInfoData.iconUrl,
                })(
                  <Upload
                    defaultUrl={modifyInfoData && modifyInfoData.iconUrl}
                    uploadConfig={{
                      action: `${_baseApi}/iconConfig/uploadIconPicture`,
                      fileType: ['image'],
                      size: 2,
                    }}
                    setIconUrl={url => form.setFieldsValue({ iconUrl: url })}
                  >
                    {fileList.length && fileList[0].response && fileList[0].response.status == '99' ? (
                      <span style={{ color: 'red', marginLeft: '5px' }}>
                    {fileList[0].response.statusDesc}
                  </span>
                    ) : null}
                  </Upload>
                )}
              </FormItem>
              <FormItem label="icon图标-未选中样式" {...formConfig}>
                {getFieldDecorator('iconUrlTwo', {
                  rules: [{ required: true, message: '请上传icon图标-未选中样式' }],
                  initialValue: modifyInfoData && modifyInfoData.iconUrlTwo,
                })(
                  <Upload
                    defaultUrl={modifyInfoData && modifyInfoData.iconUrlTwo}
                    uploadConfig={{
                      action: `${_baseApi}/iconConfig/uploadIconPicture`,
                      fileType: ['image'],
                      size: 2,
                    }}
                    setIconUrl={url => form.setFieldsValue({ iconUrlTwo: url })}
                  >
                    {fileList.length && fileList[0].response && fileList[0].response.status == '99' ? (
                      <span style={{ color: 'red', marginLeft: '5px' }}>
                    {fileList[0].response.statusDesc}
                  </span>
                    ) : null}
                  </Upload>
                )}
              </FormItem>
            </div>
              :
            <FormItem label="icon图标" {...formConfig}>
              {getFieldDecorator('iconUrl', {
                rules: [{ required: true, message: '请上传icon图标' }],
                initialValue: modifyInfoData && modifyInfoData.iconUrl,
              })(
                <Upload
                  defaultUrl={modifyInfoData && modifyInfoData.iconUrl}
                  uploadConfig={{
                    action: `${_baseApi}/iconConfig/uploadIconPicture`,
                    fileType: ['image'],
                    size: 2,
                  }}
                  setIconUrl={url => form.setFieldsValue({ iconUrl: url })}
                >
                  {fileList.length && fileList[0].response && fileList[0].response.status == '99' ? (
                    <span style={{ color: 'red', marginLeft: '5px' }}>
                  {fileList[0].response.statusDesc}
                </span>
                  ) : null}
                </Upload>
              )}
            </FormItem>
          }

          {
            this.props.tabIndex !== '1' &&
            <div>
              <FormItem label="页面地址" {...formConfig}>
                {getFieldDecorator('pageUrl', {
                  rules: [{ required: false, message: '请输入页面地址' }],
                  initialValue: modifyInfoData && modifyInfoData.pageUrl,
                })(<Input placeholder="请输入页面地址" maxLength={250} />)}
              </FormItem>
              <FormItem label="排序" {...formConfig}>
                {getFieldDecorator('sortId', {
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
                  initialValue: modifyInfoData && modifyInfoData.sortId,
                })(<Input placeholder="请输入" maxLength={3} />)}
              </FormItem>
            </div>
          }
          <FormItem label="icon描述" {...formConfig}>
            {getFieldDecorator('description', {
              rules: [{ required: false, message: '请输入icon描述' }],
              initialValue: modifyInfoData && modifyInfoData.description,
            })(<Input placeholder="请输入icon描述" maxLength={200} />)}
          </FormItem>
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
