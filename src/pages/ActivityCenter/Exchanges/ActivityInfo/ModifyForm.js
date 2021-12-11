import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';

const FormItem = Form.Item;

@Form.create()
export default class ModifyForm extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
  };

  componentDidMount() {
    this.props.getChild(this);
  }

  setVisible = () => {
    let { visible } = this.state;
    if (visible) {
      this.props.form.resetFields();
    }
    this.setState({
      visible: !visible,
    });
  };

  handleOk = () => {
    let { data } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.changeGrade(
          {
            key: new Date().getTime().toString(),
            ...data,
            ...values,
          },
        );
      }
    });
  };

  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };

    return (
      <Modal
        title={data ? '修改档位' : '新增档位'}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        onCancel={this.setVisible}
      >
        <Form>
          <FormItem label='档位名称' {...formConfig}>
            {
              getFieldDecorator('gradeName', {
                rules: [{ required: true, message: '请填写档位名称', },
                ],
                initialValue: data && data.gradeName,
              })(
                <Input maxLength={6} placeholder='请输入档位名称'/>,
              )
            }
          </FormItem>
          <FormItem label='设置档位门槛' {...formConfig}>
            {
              getFieldDecorator('gradeQuota',
                {
                  initialValue: data && data.gradeQuota,
                  rules: [
                    { required: true, message: '请输入档位门槛' },
                    {
                      validator: (rule, val, cb) => {
                        if (
                          val &&
                          !val.toString().match(/^[0-9]{1,9}(\.[0-9]{1,4})?$/)
                        ) {
                          cb('请输入有效的档位门槛');
                        } else {
                          cb();
                        }
                      },
                    },
                  ],
                })(
                <Input placeholder='请输入'/>,
              )
            }
            <div style={{ color: 'gray', marginTop: '10px' }}>
              兑换额度值至少大于等于该档位门槛时，才可领取该档的奖品
            </div>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
