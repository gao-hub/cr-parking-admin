import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio, Select, message, DatePicker, Col, Row } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload';
import { _baseApi } from '@/defaultSettings';


const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ searchManage, loading }) => ({
  searchManage,
  submitLoading: loading.effects['searchManage/modifyManage'],
}))
class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      advertPosition: '',
      visible: false,
      fileList: [],
    };
  }

  componentDidMount() {
    const { getChildData } = this.props;
    getChildData(this);
  }

  changeVisible = visible => {
    const { dispatch } = this.props;
    if (!visible) {
      dispatch({
        type: 'searchManage/setModifyInfo',
        payload: {},
      });
    }
    this.setState({
      visible,
    });
  };

  handleOk = async () => {
    const {
      dispatch,
      form,
      tabIndex,
      searchManage: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        const { searchManage = {}, getList, currPage, pageSize } = this.props;
        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'searchManage/modifyManage',
            payload: {
              ...values,
              id: searchManage.modifyInfoData.id,
              searchType: tabIndex
            },
          });
        } else {
          res = await dispatch({
            type: 'searchManage/addManage',
            payload: {
              ...values,
              searchType: tabIndex
            }
          });
        }
        if (res && res.status === 1) {
          this.changeVisible(false);
          message.success(res.statusDesc);
          getList(currPage, pageSize);
        } else message.error(res.statusDesc);
      }
    });
  };


  render() {
    const conslistObj = {
      '1': '热门搜索',
      '2': '搜索提示文案'
    }
    const {
      form = {},
      searchManage: { modifyInfoData, initData },
    } = this.props;
    const { getFieldDecorator, setFieldsValue } = form;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };
    const { visible = false, fileList } = this.state;

    return (
      <Modal
        title={modifyInfoData.id ? '修改' : '添加'}
        width={600}
        visible={visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose
        confirmLoading={this.props.submitLoading ? true : false}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="标签位置" {...formConfig}>
            {conslistObj[this.props.tabIndex]}
          </FormItem>
          <FormItem label="词条名称" {...formConfig}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  validator: (rules, val, callback) => {
                    if (!val) {
                      callback('请输入词条名称')
                    }
                    callback()
                  }
                }
              ],
              initialValue: modifyInfoData && modifyInfoData.name,
            })(<Input placeholder="请输入" maxLength={20} />)}
          </FormItem>
          <FormItem label="排序" {...formConfig}>
            {getFieldDecorator('sortId', {
              rules: [
                {
                  required: true,
                  validator: (rules, value, callback) => {
                    if (!value) {
                      callback('请输入排序')
                    }
                    if (isNaN(value - 0) || !((value - 0).toString()).match(/(^[1-9]\d*$)/)) callback('请输入正整数')
                    callback()
                  }
                }
              ],
              initialValue: modifyInfoData && modifyInfoData.sortId,
            })(<Input placeholder="请输入" maxLength={3} />)}
          </FormItem>
          <FormItem label="词条描述" {...formConfig}>
            {getFieldDecorator('remark', {
              rules: [{ required: false, message: '请输入词条描述' }],
              initialValue: modifyInfoData && modifyInfoData.remark,
            })(<Input placeholder="请输入词条描述" maxLength={200} />)}
          </FormItem>
          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择状态' }],
              initialValue: modifyInfoData && modifyInfoData.status,
            })(
              <Radio.Group>
                <Radio key={1} value={1}>
                  启用
                </Radio>
                <Radio key={0} value={0}>
                  禁用
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Modify;
