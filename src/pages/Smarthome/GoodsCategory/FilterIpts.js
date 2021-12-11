import React, { PureComponent } from 'react';
import { Row, Col, Button, Select, Form, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';

const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

const statusArr = [
  {
    label: '启用',
    value: 1,
  },
  {
    label: '禁用',
    value: 0,
  },
];

@connect(({ goodsCategoryManage }) => ({
  goodsCategoryManage,
}))
@Form.create()
class FilterIpts extends PureComponent {
  componentWillMount() {
    const { getRef } = this.props;
    if (getRef) {
      getRef(this);
    }
  }

  formSubmit = async () => {
    const { dispatch, getList } = this.props;
    await dispatch({
      type: 'goodsCategoryManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    getList();
  };

  getFormValue = () => {
    const { form } = this.props;
    const formQueryData = form.getFieldsValue();

    if (formQueryData.updateTime && formQueryData.updateTime.length) {
      formQueryData.updateTimeStart = moment(formQueryData.updateTime[0]).format(dateFormat);
      formQueryData.updateTimeEnd = moment(formQueryData.updateTime[1]).format(dateFormat);
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
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('status')(
                    <Select allowClear>
                      {statusArr &&
                        statusArr.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...timeConfig}>
                <FormItem label="更新时间" {...formItemConfig}>
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
