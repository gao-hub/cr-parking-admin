import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio, Select, message } from 'antd';
import { connect } from 'dva';
// import Upload from '@/components/Upload';
// import { _baseApi } from '@/defaultSettings';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ homeConfig, loading }) => ({
  homeConfig,
  submitLoading: loading.effects['homeConfig/modifyManage'],
}))
class TabModifyForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:0,
      visible: false,
      fileList: [],
      stateRadio: [
        {
          key: '1',
          value: 1,
          title: '启用',
        },
        {
          key: '2',
          value: 0,
          title: '禁用',
        },
      ],
      productRadio: [
        {
          key: '1',
          value: 5,
          title: '国内游',
        },
        {
          key: '2',
          value: 6,
          title: '周边游',
        },
      ],
    };
  }

  componentDidMount() {
    const { getChildData } = this.props;

    getChildData(this);
  }

  changeVisible = visible => {
    const { dispatch } = this.props;
    if (visible) {
      // dispatch({
      //   type: 'homeConfig/getAdSpace',
      //   payload: {},
      // });
      // dispatch({
      //   type: 'homeConfig/getAdPlatform',
      //   payload: {},
      // });
    }
    if (!visible) {
      dispatch({
        type: 'homeConfig/setModifyInfo',
        payload: {},
      });
    }
    this.setState({
      visible,
    });
  };

  handleOk = async () => {
    if(this.state.isLoading){
      return
    }
    this.setState({
      isLoading:1
    })
    const {
      dispatch,
      form,
      homeConfig: { modifyInfoData },
    } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        const copyValues = values;
        if (copyValues.commodityType) {
          copyValues.commodityType = copyValues.commodityType.join(',');
        }
        const { homeConfig = {}, getList, currPage, pageSize } = this.props;

        if (modifyInfoData.id) {
          res = await dispatch({
            type: 'homeConfig/modifyTabManage',
            payload: {
              ...copyValues,
              id: homeConfig.modifyInfoData.id,
            },
          });
          dispatch({
            type: 'homeConfig/getTabSelect',
            payload: {},
          });
        } else {
          res = await dispatch({
            type: 'homeConfig/addTabManage',
            payload: copyValues,
          });
          dispatch({
            type: 'homeConfig/getTabSelect',
            payload: {},
          });
        }
        if (res && res.status === 1) {
          this.setState({
          isLoading:0
          })
          this.changeVisible(false);
          message.success(res.statusDesc);
          getList(currPage, pageSize);
        } else {
          this.setState({
            isLoading:0
          })
          message.error(res.statusDesc)
        };
      }else{
        this.setState({
          isLoading:0
        })
      }
    });
  };

  render() {
    const {
      form = {},
      homeConfig: { modifyInfoData, adSpace = [] },
    } = this.props;

    const { getFieldDecorator } = form;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const { visible = false, fileList, stateRadio, productRadio ,isLoading} = this.state;

    return (
      <Modal
        title={modifyInfoData.id ? '修改' : '添加'}
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose
        onCancel={() => this.changeVisible(false)}
        confirmLoading={isLoading ? true : false}
      >
        <Form>
          <FormItem label="标题" {...formConfig}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入标题' }],
              initialValue: modifyInfoData && modifyInfoData.title,
            })(<Input placeholder="请输入标题" maxLength={4} />)}
          </FormItem>

          <FormItem label="商品类型" {...formConfig}>
            {getFieldDecorator('commodityType', {
              // rules: [{ required: true, message: '请输入广告位' }],
              initialValue: modifyInfoData && modifyInfoData.commodityType,
            })(
              <Select placeholder="选择商品类型" mode="multiple">
                {Array.isArray(productRadio) &&
                  productRadio.map(item => (
                    <Option key={item.key} value={item.value}>
                      {item.title}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>

          <FormItem label="排序" {...formConfig}>
            {getFieldDecorator('sorted', {
              rules: [{ required: true, message: '请输入排序' }],
              initialValue: modifyInfoData && modifyInfoData.sorted,
            })(<Input placeholder="请输入排序" />)}
          </FormItem>

          <FormItem label="描述" {...formConfig}>
            {getFieldDecorator('remark', {
              // rules: [{ required: false, message: '请输入广告描述' }],
              initialValue: modifyInfoData && modifyInfoData.remark,
            })(<Input placeholder="请输入描述" />)}
          </FormItem>

          <FormItem label="状态" {...formConfig}>
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择状态' }],
              initialValue: modifyInfoData && modifyInfoData.status,
            })(
              <Radio.Group>
                {Array.isArray(stateRadio) &&
                  stateRadio.map(item => (
                    <Radio key={item.key} value={item.value}>
                      {item.title}
                    </Radio>
                  ))}
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default TabModifyForm;
