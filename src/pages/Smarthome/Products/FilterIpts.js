import React, { PureComponent } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
import InputGroup from './comp/InputGroup/index';

const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { TreeNode } = TreeSelect;

const isShowStatus = [
  {
    label: '在架',
    value: 1,
  },
  {
    label: '仓库中',
    value: 0,
  },
];

const isGoodStatus = [
  {
    label: '推荐中',
    value: 1,
  },
  {
    label: '未推荐',
    value: 0,
  },
];

@connect(({ productsManage }) => ({
  storeCategoryList: productsManage.storeCategoryList,
}))
@Form.create()
class FilterIpts extends PureComponent {
  componentWillMount() {
    const { dispatch, getRef1, getRef2 } = this.props;
    if (getRef1) {
      getRef1(this);
    }
    if (getRef2) {
      getRef2(this);
    }
    dispatch({
      type: 'productsManage/getSelectStoreCategoryList',
      payload: {
        type: '0',
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productsManage/setSearchInfo',
      payload: {},
    });
  }

  formSubmit = async () => {
    const { dispatch, getList, pageSize } = this.props;
    await dispatch({
      type: 'productsManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    getList(1, pageSize);
  };

  getFormValue = () => {
    const { form } = this.props;
    const formQueryData = form.getFieldsValue();

    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format(dateFormat);
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format(dateFormat);
    }
    if (formQueryData.otPrice && formQueryData.otPrice.length) {
      const { otPrice } = formQueryData;
      formQueryData.productPriceStart = Number(otPrice[0]);
      formQueryData.productPriceEnd = Number(otPrice[1]);
    }

    delete formQueryData.createTime;
    delete formQueryData.otPrice;

    return formQueryData;
  };

  reset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
      isShowShow,
      storeCategoryList,
    } = this.props;

    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form {...formItemConfig}>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="产品名称" {...formItemConfig}>
                  {getFieldDecorator('storeName')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="所属类目" {...formItemConfig}>
                  {getFieldDecorator('cateId')(
                    <TreeSelect>
                      {storeCategoryList.map(item => (
                        <TreeNode
                          value={item.value}
                          title={item.label}
                          key={item.value}
                          selectable={false}
                        >
                          {item.children.map(item1 => (
                            <TreeNode value={item1.value} title={item1.label} key={item1.value} />
                          ))}
                        </TreeNode>
                      ))}
                    </TreeSelect>
                  )}
                </FormItem>
              </Col>
              {isShowShow ? (
                <Col {...inputConfig}>
                  <FormItem label="在架状态" {...formItemConfig}>
                    {getFieldDecorator('isShow')(
                      <Select allowClear>
                        {isShowStatus &&
                          isShowStatus.map(item => (
                            <Option key={item.value} value={item.value}>
                              {item.label}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              ) : null}
              <Col {...inputConfig}>
                <FormItem label="是否推荐" {...formItemConfig}>
                  {getFieldDecorator('isGood')(
                    <Select allowClear>
                      {isGoodStatus &&
                        isGoodStatus.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="售价" {...formItemConfig}>
                  {getFieldDecorator('otPrice')(<InputGroup width="40%" type="number" />)}
                </FormItem>
              </Col>
              <Col {...timeConfig}>
                <FormItem label="创建时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(<RangePicker />)}
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
