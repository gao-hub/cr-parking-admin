import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

const dateFormat = 'YYYY-MM-DD';

@connect(({ GoodsManage }) => ({
  GoodsManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  constructor(props){
    super(props)
    this.state = {
      goodsType: [
        {
          key: 0,
          value: 0,
          title: '实物',
        },
        {
          key: 1,
          value: 1,
          title: '虚拟',
        },
      ],
      status: [
        {
          key: 0,
          value: 0,
          title: '仓库中',
        },
        {
          key: 1,
          value: 1,
          title: '在架',
        },
      ],
      recommendFlag: [
        {
          key: 0,
          value: 0,
          title: '--'
        },
        {
          key: 1,
          value: 1,
          title: '推荐中'
        }
      ]
    };
  }

  formSubmit = async e => {
    await this.props.dispatch({
      type: 'GoodsManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()    
    if (formQueryData.createTime && formQueryData.createTime.length) {
      formQueryData.createTimeStart = moment(formQueryData.createTime[0]).format('YYYY-MM-DD');
      formQueryData.createTimeEnd = moment(formQueryData.createTime[1]).format('YYYY-MM-DD');
      delete formQueryData['createTime'];
    }
    return formQueryData;
  };
  reset = async () => {
    await this.props.dispatch({
      type: 'GoodsManage/setSearchInfo',
      payload: {},
    });
    this.props.form.resetFields();
  };
  componentDidMount() {
    this.props.getChild(this);
    const { dispatch } = this.props;
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'GoodsManage/setSearchInfo',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
    } = this.props;
    const { goodsType, status, recommendFlag } = this.state;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="商品名称" {...formItemConfig}>
                  {getFieldDecorator('goodsName')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="商品类型" {...formItemConfig}>
                  {getFieldDecorator('goodsType')(
                    <Select placeholder={'请选择商品类型'} allowClear>
                      {Array.isArray(goodsType) &&
                        goodsType.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="在架状态" {...formItemConfig}>
                  {getFieldDecorator('isShow')(
                    <Select placeholder={'请选择在架状态'} allowClear>
                      {Array.isArray(status) &&
                        status.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="是否推荐" {...formItemConfig}>
                  {getFieldDecorator('recommendFlag')(
                    <Select placeholder={'请选择是否推荐'} allowClear>
                      {Array.isArray(recommendFlag) &&
                        recommendFlag.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="售价" {...formItemConfig}>
                  {getFieldDecorator('otPriceStart')(
                    <Input style={{ width: '40%' }}/>,
                  )} ~ {getFieldDecorator('otPriceEnd')(
                  <Input style={{ width: '40%' }}/>,
                )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="创建时间" {...formItemConfig}>
                  {getFieldDecorator('createTime')(<RangePicker format={dateFormat} />)}
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
