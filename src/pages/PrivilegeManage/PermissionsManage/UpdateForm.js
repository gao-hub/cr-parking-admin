import React, { PureComponent, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Tree,
} from 'antd';
const FormItem =  Form.Item;
const { TextArea } =  Input;


@Form.create()
export default class IndexComponent extends PureComponent {
  static defaultProps = {
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {

    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }


  renderContent = () => {
    const { form } = this.props;
    const application = {
      id: '1',
      status: 2,
      orderNo: 3,
      childOrderNo: 5
    }
    const {
        form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 10 },
        },
      };
    return (
      <Fragment>
        <Card bordered={false}>
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label={'权限'}>
                {getFieldDecorator('title', {
                    rules: [
                    {
                        required: true,
                        message: '请输入权限',
                    },
                    ],
                })(<Input placeholder={'请输入权限'} />)}
                </FormItem>
                <FormItem {...formItemLayout} label={'权限名称'}>
                {getFieldDecorator('title1', {
                    rules: [
                    {
                        required: true,
                        message: '请输入权限名称',
                    },
                    ],
                })(<Input placeholder={'请输入权限名称'} />)}
                </FormItem>
                <FormItem {...formItemLayout} label={'权限说明'}>
                {getFieldDecorator('title3', {
                    rules: [
                    {
                        required: true,
                        message: '请输入权限说明',
                    },
                    ],
                })(<TextArea placeholder={'请输入权限说明'} />)}
                </FormItem>
                
            </Form>
        </Card>
      </Fragment>
    )
  };

  onOk = (e)=>{
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // dispatch({
        //   type: 'form/submitRegularForm',
        //   payload: values,
        // });
      }
    });
    // this.props.handleUpdateModalVisible(false)
  }


  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    return (
      <Modal
        width = {640}
        bodyStyle = {{ padding: '32px 40px 48px' }}
        destroyOnClose
        title = {this.props.modalType == '1' ? '添加权限' : '修改权限'}
        visible = {updateModalVisible}
        onOk = {this.onOk} 
        onCancel = {() => handleUpdateModalVisible(false, values)}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}