import React, { Component } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(({ advertManage }) => ({
  advertManage,
}))
@Form.create()
export default class FilterIpts extends Component {
  state = {
    updateTimeStart:'',
    updateTimeEnd:''
  }
  formSubmit = async e => {
    let {updateTimeStart,updateTimeEnd} = this.state
    let json =  this.getFormValue()
    await this.props.dispatch({
      type: 'advertManage/setSearchInfo',
      payload:{
        ...json,
        updateTimeStart,
        updateTimeEnd
      },
    });
    this.props.getList(1, this.props.pageSize);
  };
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    return formQueryData;
  };
  reset = () => {
    this.props.form.resetFields();
    this.setState({
      updateTimeStart:'',
      updateTimeEnd:''
    })
  };
  onChangeTime = time=>{
      if(time){
        this.setState({
          updateTimeStart:time[0]?moment(time[0]).format(dateFormat):'',
          updateTimeEnd:time[1]?moment(time[1]).format(dateFormat):'',
        })
      }
  }
  componentDidMount() {
    this.props.getChild(this);

  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'advertManage/setSearchInfo',
      payload: {},
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      searchWholeState,
      advertManage: { adSpace = [], adPlatform = [], initData = {} },
    } = this.props;
    const formConfig = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form>
            <Row gutter={24} type="flex">
              {
                this.props.tabIndex === '1' &&
                <Col {...inputConfig}>
                  <FormItem label="广告位" {...formItemConfig}>
                    {getFieldDecorator('advertPositionId')(
                      <Select placeholder={'请选择'}>
                        {
                          initData.frontPagePositions && initData.frontPagePositions.map(item => {
                            return (
                              <Option key={item.key} value={item.value}>
                                {item.title}
                              </Option>
                            );
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
              }
              <Col {...inputConfig}>
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('status')(
                    <Select placeholder={'请选择状态'}>
                          <Option key={0} value={0}>
                            禁用
                          </Option>
                          <Option key={1} value={1}>
                            启用
                          </Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="更新时间" {...formItemConfig}>
                {getFieldDecorator('showtime')(
                    <RangePicker  key={this.state.keyValue} onChange={this.onChangeTime}/>

                )}
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
