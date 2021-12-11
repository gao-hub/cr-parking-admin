import React, { PureComponent } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';

const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

const setTopOption = [
  {
    label: '置顶',
    value: 1,
  },
  { label: '非置顶', value: 0 },
];

const setStatusOption = [
  {
    label: '启用',
    value: 1,
  },
  { label: '禁用', value: 0 },
];

@connect(({ Articlemanagement }) => ({
  Articlemanagement,
}))
@Form.create()
class FilterIpts extends PureComponent {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tripOrderManage/setSearchInfo',
      payload: {},
    });
  }

  formSubmit = async () => {
    const { dispatch, getList, pageSize } = this.props;
    await dispatch({
      type: 'Articlemanagement/setSearchInfo',
      payload: this.getFormValue(),
    });
    getList(1, pageSize);
  };

  getFormValue = () => {
    const { form } = this.props;
    const formQueryData = form.getFieldsValue();
    if (formQueryData.updateTime && formQueryData.updateTime.length) {
      formQueryData.updateTimeStart = moment(formQueryData.updateTime[0]).format('YYYY-MM-DD');
      formQueryData.updateTimeEnd = moment(formQueryData.updateTime[1]).format('YYYY-MM-DD');
    }
    delete formQueryData.updateTime;
    return formQueryData;
  };

  reset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form {...formItemConfig}>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="标题" {...formItemConfig}>
                  {getFieldDecorator('newsTitle')(<Input />)}
                </FormItem>
              </Col>
              {/* <Col {...inputConfig}>
                <FormItem label="关联产品" {...formItemConfig}>
                  {getFieldDecorator('storeName')(<Input />)}
                </FormItem>
              </Col> */}
              <Col {...inputConfig}>
                <FormItem label="置顶状态" {...formItemConfig}>
                  {getFieldDecorator('newsTop')(
                    <Select allowClear>
                      {setTopOption &&
                        setTopOption.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('newsStatus')(
                    <Select allowClear>
                      {setStatusOption &&
                        setStatusOption.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...timeConfig}>
                <FormItem label="更新日期" {...formItemConfig}>
                  {getFieldDecorator('updateTime')(<RangePicker />)}
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
