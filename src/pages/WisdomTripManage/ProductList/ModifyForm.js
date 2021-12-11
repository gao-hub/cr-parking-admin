import React, { PureComponent } from 'react';
import { Modal, Form, message, Checkbox } from 'antd';
import { connect } from 'dva';
import { _baseApi } from '@/defaultSettings';

const FormItem = Form.Item;

@Form.create()
@connect(({ tripProductManage, loading }) => ({
  tripProductManage,
  submitLoading: loading.effects['tripProductManage/modifyManage'],
}))
class Modify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataInfo: {},
    };
  }

  componentDidMount() {
    const { getChildData } = this.props;

    getChildData(this);
  }

  componentWillUnmount(){
    this.setState({
      dataInfo: null
    })
  }

  changeVisible = visible => {
    this.setState({
      visible,
    });
  };


  handleOk = async () => {
    const {
      form,
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (values.tagId && values.tagId.length) { values.tagId = values.tagId.join(','); }
        else { values.tagId = ''; }
        const res = await this.props.dispatch({
          type: 'tripProductManage/updateTag',
          payload: {
            ...values,
            id: this.state.dataInfo.id,
          },
        });
        if (res && res.status === 1) {
          message.success('修改成功');
          this.changeVisible(false);
          this.props.getList(this.props.currPage, this.props.pageSize,this.props.onSale);
        } else {
          message.error(res.statusDesc);
        }
      }
    });
  };



  render() {
    const {
      form :{getFieldDecorator},
      tripProductManage: { initData },
    } = this.props;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const { visible = false,dataInfo } = this.state;

    return (
      <Modal
        title='改归属标签'
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem  {...formConfig}>
            {getFieldDecorator('tagId', {
              initialValue:
                dataInfo && dataInfo.tagId != null
                  ? dataInfo.tagId.split(',')
                  : null,
            })(
              <Checkbox.Group>
                {initData &&
                initData.map(item => {
                  return (
                    <Checkbox key={item.key} value={item.value}>
                      {item.title}
                    </Checkbox>
                  );
                })}
              </Checkbox.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Modify;
