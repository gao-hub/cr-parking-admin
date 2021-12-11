import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio, Select, message } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ posterManage, loading }) => ({
  posterManage,
  submitLoading: loading.effects['posterManage/modifyManage'],
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
    if (visible) {
      dispatch({
        type: 'posterManage/getAdSpace',
        payload: {},
      });
      dispatch({
        type: 'posterManage/getAdPlatform',
        payload: {},
      });
    }
    if (!visible) {
      dispatch({
        type: 'posterManage/setModifyInfo',
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
      posterManage: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        const { posterManage = {}, getList, currPage, pageSize } = this.props;

        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'posterManage/modifyManage',
            payload: {
              ...values,
              id: posterManage.modifyInfoData.id,
            },
          });
        } else {
          res = await dispatch({
            type: 'posterManage/addManage',
            payload: values,
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
    const {
      form = {},
      posterManage: { modifyInfoData, adSpace = [], adPlatform = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const { visible = false, fileList } = this.state;

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
          <FormItem label="展示平台" {...formConfig}>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择展示平台' }],
              initialValue: modifyInfoData && modifyInfoData.type,
            })(
              <Radio.Group>
                {Array.isArray(adPlatform) &&
                  adPlatform.map(item => (
                    <Radio key={item.key} value={item.value}>
                      {item.title}
                    </Radio>
                  ))}
              </Radio.Group>
            )}
          </FormItem>

          <FormItem label="广告位" {...formConfig}>
            {getFieldDecorator('posterCode', {
              rules: [{ required: true, message: '请输入广告位' }],
              initialValue: modifyInfoData && modifyInfoData.posterCode,
            })(
              <Select placeholder="请输入广告位">
                {Array.isArray(adSpace) &&
                  adSpace.map(item => (
                    <Option key={item.key} value={item.value}>
                      {item.title}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>

          <FormItem label="广告名称" {...formConfig}>
            {getFieldDecorator('posterName', {
              // rules: [{ required: true, message: '请输入广告名称' }],
              initialValue: modifyInfoData && modifyInfoData.posterName,
            })(<Input placeholder="请输入广告名称" />)}
          </FormItem>

          <FormItem label="广告图片" {...formConfig}>
            {getFieldDecorator('posterUrl', {
              rules: [{ required: true, message: '请上传广告图片' }],
              initialValue: modifyInfoData && modifyInfoData.posterUrl,
            })(
              <Upload
                defaultUrl={modifyInfoData && modifyInfoData.posterUrl}
                uploadConfig={{
                  action: `${_baseApi}/poster/upload`,
                  fileType: ['image'],
                  size: 3,
                }}
                setIconUrl={url => form.setFieldsValue({ posterUrl: url })}
              >
                {fileList.length && fileList[0].response && fileList[0].response.status == '99' ? (
                  <span style={{ color: 'red', marginLeft: '5px' }}>
                    {fileList[0].response.statusDesc}
                  </span>
                ) : null}
              </Upload>
            )}
          </FormItem>

          <FormItem label="页面地址" {...formConfig}>
            {getFieldDecorator('pageUrl', {
              rules: [{ required: false, message: '请输入页面地址' }],
              initialValue: modifyInfoData && modifyInfoData.pageUrl,
            })(<Input placeholder="请输入页面地址" />)}
          </FormItem>

          <FormItem label="排序" {...formConfig}>
            {getFieldDecorator('sort', {
              rules: [{ required: true, message: '请输入排序' }],
              initialValue: modifyInfoData && modifyInfoData.sort,
            })(<Input placeholder="请输入排序" />)}
          </FormItem>

          <FormItem label="广告描述" {...formConfig}>
            {getFieldDecorator('remarks', {
              rules: [{ required: false, message: '请输入广告描述' }],
              initialValue: modifyInfoData && modifyInfoData.remarks,
            })(<Input placeholder="请输入广告描述" />)}
          </FormItem>

          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('posterStatus', {
              rules: [{ required: true, message: '请选择状态' }],
              initialValue: modifyInfoData && modifyInfoData.posterStatus,
            })(
              <Select allowClear>
                <Option key={0} value={0}>
                  禁用
                </Option>
                <Option key={1} value={1}>
                  启用
                </Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Modify;
