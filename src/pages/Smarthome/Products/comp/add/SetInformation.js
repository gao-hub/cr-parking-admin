import React, { PureComponent } from 'react';
import { Row, Col, Form, Radio } from 'antd';

const formItemConfig = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};

@Form.create()
class BasicInformation extends PureComponent {
  componentDidMount() {
    const { getThis } = this.props;
    getThis(this);
  }

  handleFormData = () => {
    const { form } = this.props;
    let returnData;
    form.validateFields((err, values) => {
      if (!err) {
        returnData = {
          ...values,
        };
      }
    });
    return returnData;
  };

  render() {
    const { form, infoData, disabled } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <div>设置信息</div>
        <Form {...formItemConfig}>
          <Row gutter={24}>
            <Col>
              <Form.Item label="上架设置">
                {getFieldDecorator('isShow', {
                  initialValue: infoData && infoData.isShow,
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Radio.Group disabled={disabled}>
                    <Radio value={1}>上架</Radio>
                    <Radio value={0}>放入仓库</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col>
              <Form.Item label="下架设置">
                {getFieldDecorator('offSet', {
                  initialValue: infoData ? infoData.offSet : 0,
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Radio.Group disabled={disabled}>
                    <Radio value={0}>库存为0时自动下架</Radio>
                    <Radio value={1}>手动下架</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default BasicInformation;
