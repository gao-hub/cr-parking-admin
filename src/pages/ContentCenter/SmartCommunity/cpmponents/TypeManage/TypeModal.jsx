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
    const { dispatch, form, SmartCommunity: { typeInfoData } } = this.props;
    const { type } = this.state
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res
        if(type == 1) {
          res= await dispatch({
            type: 'SmartCommunity/addType',
            payload: {
              ...values,
            }
          })
        }
        if(type == 2){
          res= await dispatch({
            type: 'SmartCommunity/modifyType',
            payload: {
              ...values,
              id: typeInfoData.id,
            }
          })
        }
        if (res && res.status === 1) {
          message.success(res.statusDesc)
          this.onCancel()
          this.props.getTypeList(this.props.currPage, this.props.pageSize)
          this.props.dispatch({
            type: 'SmartCommunity/getTypeSelect'
          });
        } else if(res) message.error(res.statusDesc)
      }
    });
  };
  //  关闭弹窗
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'SmartCommunity/setTypeInfo',
      payload: {
        typeInfoData: {},
        typeId: ''
      }
    })
    this.changeVisible(false)
  }
  render() {
    const { form: { getFieldDecorator }, SmartCommunity: { typeInfoData } } = this.props;
    const { type, visible } = this.state
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={type == 1 ? '添加类型' : '修改类型'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={this.onCancel}
      >
        <Form>

          <FormItem
            label="类型名称"
            {...formConfig}
          >
            {getFieldDecorator('groupsName', {
              rules: [{ required: true, message: '请输入类型名称'}],
              initialValue: typeInfoData && typeInfoData.groupsName
            })(
              <Input placeholder={'请输入类型名称'}/>
            )}
          </FormItem>

          <FormItem
            label="排序"
            {...formConfig}
          >
            {getFieldDecorator('sort', {
              rules: [{ required: true, message: '请输入排序'}],
              initialValue: typeInfoData && typeInfoData.sort
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
              initialValue: typeInfoData && typeInfoData.remark
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
                initialValue: typeInfoData && typeInfoData.productState ? typeInfoData.productState : 0
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
    );
  }
}
