import React, { Component } from 'react';
import { Row, Col, Input, Button, Form, InputNumber } from 'antd';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption, filterEmptyObject } from '@/utils/utils';

const { inputConfig, formItemConfig, searchConfig } = selfAdaption();

const FormItem = Form.Item;

@connect(({ parkingConversionModel }) => ({
  parkingConversionModel,
}))
@Form.create()
class FilterIpts extends Component {
  componentDidMount() {
    const { getChild } = this.props;
    getChild(this);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'parkingConversionModel/setSearchInfo',
      payload: {},
    });
  }

  reset = () => {
    const { form } = this.props;

    form.resetFields();
  };

  formSubmit = async () => {
    const { dispatch, getList, pageSize } = this.props;

    await dispatch({
      type: 'parkingConversionModel/setSearchInfo',
      payload: this.getFormValue(),
    });

    getList(1, pageSize);
  };

  //   获取表单信息
  getFormValue = () => {
    const { form } = this.props;

    const formQueryData = form.getFieldsValue();

    return filterEmptyObject(formQueryData);
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="楼盘名称" {...formItemConfig}>
                  {getFieldDecorator('buildingName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="车位编号" {...formItemConfig}>
                  {getFieldDecorator('parkingCode')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="转化次数" {...formItemConfig}>
                  {getFieldDecorator('tranferTimes')(<Input />)}
                </FormItem>
              </Col>
              <Col {...searchConfig}>
                <FormItem {...formItemConfig}>
                  <Button onClick={this.formSubmit} type="primary">
                    搜索
                  </Button>
                  <Button onClick={this.reset} style={{ marginLeft: 8 }}>
                    清空
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default FilterIpts;
