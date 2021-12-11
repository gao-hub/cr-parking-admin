import React, { PureComponent } from 'react';
import { Modal, Button, message, Table, Form, Row, Col, Input, TreeSelect, Spin } from 'antd';
const { TreeNode } = TreeSelect;
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';
import _ from 'lodash';
const { inputConfig, formItemConfig } = selfAdaption();
const FormItem = Form.Item;
// 活动商品列
let columns = [
  {
    title: '商品编号',
    dataIndex: 'productNo',
  },
  {
    title: '商品图片',
    dataIndex: 'image',
    width: '20%',
    render: record => {
      return <img style={{ width: '20%' }} src={record} />;
    },
  },
  {
    title: '商品名称',
    dataIndex: 'storeName',
    width: '40%',
  },
  {
    title: '多规格',
    dataIndex: 'specType',
    render: record => {
      return record === 0 ? '否' : '是';
    },
  },
  {
    title: '价格',
    dataIndex: 'otPrice',
  },
  {
    title: '库存',
    dataIndex: 'stock',
  },
];
@Form.create()
@connect(({ commodityManagement, loading }) => ({
  commodityManagement,
  loading: loading.effects['commodityManagement/listHome'],
}))
export default class EventGoodsModify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedRowKeys: [], // 选中行key
      selectedRows: [], // 选中行
      classifyList: [], // 活动商品数据
      currPage: 1,
      pageSize: 10,
    };
  }

  componentDidMount() {
    this.props.getChildData(this);
  }

  // 控制活动商品弹框
  changeVisible = visible => {
    this.setState(
      {
        visible,
      },
      () => {
        if (visible) {
          this.getList(this.state.currPage, this.state.pageSize);
          this.getCategories();
        }
      }
    );
  };

  // 回填已选择的活动商品
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const {
      commodityManagement: { listHome },
    } = this.props;
    let that = this;
    this.setState({ selectedRowKeys, selectedRows }, () => {
      selectedRows.forEach((item, index) => {
        listHome.forEach((val, oIndex) => {
          if (item.id == val.id) {
            listHome[oIndex] = selectedRows[index];
          }
        });
      });
      that.props.dispatch({
        type: 'commodityManagement/setListHome',
        payload: listHome,
      });
    });
  };

  // 添加商品
  handleOk = () => {
    if (this.state.selectedRows.length == 0) {
      message.warning('请选择活动商品');
    } else {
      this.props.getdata(this.state.selectedRows);
      this.close();
    }
  };

  // 关闭活动商品弹框
  close = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
      currPage: 1,
    });
  };

  // 页数改变时
  onChange = currPage => {
    this.getList(currPage, this.state.pageSize);
  };

  // 一页加载数量改变时
  onShowSizeChange = (currPage, pageSize) => {
    this.getList(currPage, pageSize);
  };

  // 获取活动商品列表
  getList = (currPage, pageSize) => {
    let that = this;
    this.setState({ currPage, pageSize }, () => {
      that.props.dispatch({
        type: 'commodityManagement/listHome',
        payload: {
          currPage,
          pageSize,
          ...that.props.form.getFieldsValue(),
        },
      });
    });
  };

  // 获取商品分类
  getCategories = async () => {
    let res = await this.props.dispatch({
      type: 'commodityManagement/getCategories',
      payload: {
        type: '0',
      },
    });
    this.setState({ classifyList: res });
  };

  // 搜索
  formSubmit = () => {
    this.getList(1, this.state.pageSize);
  };

  // 判断是不是取消选择
  onSelectVal = (record, selected, sltRows) => {
    let { selectedRowKeys, selectedRows } = this.state;
    if (selected) {
      selectedRowKeys = selectedRowKeys.concat(record.homeStoreProductId);
      selectedRows = selectedRows.concat(record);
    } else {
      selectedRowKeys = selectedRowKeys.filter(item => item != record.homeStoreProductId);
      selectedRows = selectedRows.filter(
        item => item.homeStoreProductId != record.homeStoreProductId
      );
    }
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows,
    });
  };

  // 全选
  onSelectAll = (selected, sltRows, changeRows) => {
    let { selectedRowKeys, selectedRows } = this.state;
    if (selected) {
      let keys = changeRows.map(val => val.homeStoreProductId);
      selectedRowKeys = selectedRowKeys.concat(keys);
      selectedRows = selectedRows.concat(changeRows);
    } else {
      selectedRows = selectedRows.filter(item => {
        return (
          changeRows.filter(record => record.homeStoreProductId == item.homeStoreProductId)
            .length == 0
        );
      });
      selectedRowKeys = selectedRowKeys.filter(item => {
        return changeRows.filter(record => record.homeStoreProductId == item).length == 0;
      });
    }
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows,
    });
  };

  render() {
    const { selectedRowKeys, classifyList, currPage, pageSize } = this.state;
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectVal,
      onSelectAll: this.onSelectAll,
    };
    const {
      loading,
      commodityManagement: { listHome, listHomeTotal },
    } = this.props;
    const paginationProps = {
      showTotal: listHomeTotal => `共 ${listHomeTotal} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '30', '40'],
      current: currPage,
      pageSize,
      total: listHomeTotal,
      onChange: this.onChange,
      onShowSizeChange: this.onShowSizeChange,
    };

    return (
      <Modal
        title="选择活动商品"
        width="86%"
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose
        onCancel={this.close}
      >
        <Spin spinning={loading}>
          <div className={tableStyles.tableList}>
            <div className={tableStyles.tableListForm}>
              <Form>
                <Row gutter={24} type="flex">
                  <Col {...inputConfig}>
                    <FormItem {...formItemConfig}>
                      {getFieldDecorator('cateId')(
                        <TreeSelect allowClear placeholder="选择商品分类" dropdownStyle={{height: '600px'}}>
                          {classifyList.map(item => (
                            <TreeNode
                              value={item.value}
                              title={item.label}
                              key={item.value}
                              selectable={false}
                            >
                              {item.children.map(item1 => (
                                <TreeNode
                                  value={item1.value}
                                  title={item1.label}
                                  key={item1.value}
                                />
                              ))}
                            </TreeNode>
                          ))}
                        </TreeSelect>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...inputConfig}>
                    <FormItem {...formItemConfig}>
                      {getFieldDecorator('name')(<Input placeholder="搜索商品名称" />)}
                    </FormItem>
                  </Col>
                  <Col {...inputConfig}>
                    <Button onClick={this.formSubmit} type="primary">
                      搜索
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div>
            <Table
              rowKey="homeStoreProductId"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={listHome}
              pagination={paginationProps}
              footer={() => (
                <div style={{ marginBottom: 16 }}>
                  <span style={{ marginLeft: 8 }}>
                    {selectedRowKeys.length > 0 ? `已选中 ${selectedRowKeys.length} 条数据` : ''}
                  </span>
                </div>
              )}
            />
          </div>
        </Spin>
      </Modal>
    );
  }
}
