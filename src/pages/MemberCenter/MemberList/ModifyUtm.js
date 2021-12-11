// 修改渠道
import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Button, Table, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
const FormItem = Form.Item;

@Form.create()
@connect(({ userManage, loading }) => ({
  userManage,
  submitLoading: loading.effects['userManage/updateUtm'],
}))
export default class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataInfo: {},
    };
  }
  changeVisible = visible => {
    this.setState({
      visible,
    });
  };
  
  
  handleOk = async () => {
    const {
      dispatch,
      form,
      userManage: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await this.props.dispatch({
          type: 'userManage/updateUtm',
          payload: {
            ...values,
            userId: this.state.dataInfo.userId,
          },
        });
        if (res && res.status === 1) {
          message.success('修改成功');
          this.changeVisible(false);
          this.props.getList(this.props.currPage, this.props.pageSize);
        } else {
          message.error(res.statusDesc);
        }
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);
  }
  componentWillUnmount(){
    this.setState({
      dataInfo: null
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
      userManage: { modifyInfoData,initData  },
    } = this.props;
    const { utmTypes } = initData;
    const { dataInfo } = this.state;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const { currPage,pageSize } = this.state;
    
    return (
      <Modal
        title={'修改推荐人'}
        width={1360}
        bodyStyle={{ maxHeight: 480, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        confirmLoading={this.props.submitLoading ? true : false}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem label="用户名" {...formConfig}>
            <span>{dataInfo.username}</span>
          </FormItem>
          <FormItem label="当前渠道" {...formConfig}>
            <span>{dataInfo.utmName || '暂无渠道'}</span>
          </FormItem>
          <FormItem label="新渠道" required={!dataInfo.utmId} {...formConfig}>
            {getFieldDecorator('utmId', {
              rules: [
                { required: !dataInfo.utmId, message: '请选择渠道' },
                {
                  validator:(rule, value)=>{
                    if (!value || dataInfo.utmId !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('渠道不能是自己！');
                  },
                }
              ],
            })(<Select allowClear>
              {
                utmTypes && utmTypes.map(item => <Option key={item.key} value={item.value}>{item.title}</Option>)
              }
            </Select>)}
          </FormItem>
          <FormItem label="备注" {...formConfig}>
            {getFieldDecorator('remark', {})(<Input placeholder={'请输入备注'} />)}
          </FormItem>
        </Form>

      </Modal>
    );
  }
}
