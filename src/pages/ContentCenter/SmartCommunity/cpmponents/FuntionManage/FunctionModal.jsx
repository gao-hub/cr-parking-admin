import React, { PureComponent } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  message, 
  Button, 
  Select, 
  InputNumber, 
  Radio
} from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload'
import { debounce } from '@/utils/utils'
import { _baseApi } from '@/defaultSettings.js';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ SmartCommunity, loading }) => ({
  SmartCommunity,
  submitLoading: loading.effects['SmartCommunity/modifyManage']
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      fileList: [],
      infoData: {},
      functionType: [{key: 1, value:'生活助手'}],    //   功能类型
    };
  }
  componentDidMount() {
    this.props.getChildData(this);
  }
  changeVisible = (visible, type) => {
    this.setState({
      visible,
      type
    });
  };

  handleOk = async () => {
    const { dispatch, form, SmartCommunity: { functionInfoData } } = this.props;
    const { type } = this.state
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res
        if(type == 1) {
          res= await dispatch({
            type: 'SmartCommunity/addFunction',
            payload: {
              ...values,
            }
          })
        }
        if(type == 2){
          res= await dispatch({
            type: 'SmartCommunity/modifyFunction',
            payload: {
              ...values,
              id: functionInfoData.id,
            }
          })
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc)
          this.onCancel()
          this.props.getList(this.props.currPage, this.props.pageSize)
        } else if(res) message.error(res.statusDesc)
      }
    });
  };
  //  关闭弹窗
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'SmartCommunity/setFunctionInfo',
      payload: {
        functionInfoData: {},
        functionId: ''
      }
    })
    this.changeVisible(false)
  }
  render() {
    const { form: { getFieldDecorator }, SmartCommunity: { functionInfoData, typeList = [] } } = this.props;
    const { functionType, type, visible } = this.state
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <>
        {
          visible && <Modal
            title={type == 1 ? '添加功能' : '修改功能'}
            bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
            visible={visible}
            onOk={this.handleOk}
            maskClosable={false}
            destroyOnClose={true}
            onCancel={this.onCancel}
          >
            <Form>
              <FormItem
                label="功能类型"
                {...formConfig}
              >
                {getFieldDecorator('groupsId', {
                  rules: [{ required: true, message: '请选择功能类型'}],
                  initialValue: functionInfoData && functionInfoData.groupsId
                })(
                  <Select
                    placeholder="请选择功能类型"
                  >
                    {typeList.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.groupsName}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
    
              <FormItem
                label="功能名称"
                {...formConfig}
              >
                {getFieldDecorator('productName', {
                  rules: [{ required: true, message: '请输入功能名称'}],
                  initialValue: functionInfoData && functionInfoData.productName
                })(
                  <Input placeholder={'请输入功能名称'}/>
                )}
              </FormItem>

              <FormItem
                label="功能code"
                {...formConfig}
              >
                {getFieldDecorator('productCode', {
                  rules: [{ required: true, message: '请输入功能code'}],
                  initialValue: functionInfoData && functionInfoData.productCode
                })(
                  <Input placeholder={'请输入功能code'}/>
                )}
              </FormItem>
    
              <FormItem {...formConfig} label={'icon图片'}>
                {getFieldDecorator('icon', {
                  rules: [{
                    required: true,
                    message: '请上传icon图片',
                  }],
                  initialValue: (functionInfoData&& functionInfoData.icon)
                })(
                  <Upload
                    defaultUrl={(functionInfoData&& functionInfoData.icon)}
                    uploadConfig={{
                      action: `${_baseApi}/communityProduct/upload`,
                      fileType: ['image'],
                      size: 3
                    }}
                    setIconUrl={(url) => this.props.form.setFieldsValue({ icon: url })}
                  >
                    {
                      this.state.fileList.length && this.state.fileList[0].response && this.state.fileList[0].response.status == '99' ?
                        <span style={{ color: 'red', marginLeft: '5px' }}>{this.state.fileList[0].response.statusDesc}</span>
                        : null
                    }
                  </Upload>
                )}
              </FormItem>
    
              <FormItem
                label="URL地址"
                {...formConfig}
              >
                {getFieldDecorator('url', {
                  // rules: [{ required: true, message: '请输入URL地址'}],
                  initialValue: functionInfoData && functionInfoData.url
                })(
                  <Input placeholder={'请输入URL地址'}/>
                )}
              </FormItem>
    
              <FormItem
                label="排序"
                {...formConfig}
              >
                {getFieldDecorator('sort', {
                  rules: [{ required: true, message: '请输入排序'}],
                  initialValue: functionInfoData && functionInfoData.sort
                })(
                  <Input placeholder={'请输入排序'}/>
                )}
              </FormItem>
    
              <FormItem
                label="备注"
                {...formConfig}
              >
                {getFieldDecorator('remark', {
                  // rules: [{ required: true, message: '请输入URL地址'}],
                  initialValue: functionInfoData && functionInfoData.remark
                })(
                  <Input placeholder={'请输入备注'}/>
                )}
              </FormItem>
              
              {
                type === 1 && <FormItem
                  label="状态"
                  {...formConfig}
                >
                  {getFieldDecorator('productState', {
                    rules: [{ required: true, message: '请选择状态'}],
                    initialValue: functionInfoData && functionInfoData.productState ? functionInfoData.productState : 0
                  })(
                    <Radio.Group>
                      <Radio value={0}>启用</Radio>
                      <Radio value={1}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              }
          </Form>
          </Modal>
        }
      </>
    );
  }
}
