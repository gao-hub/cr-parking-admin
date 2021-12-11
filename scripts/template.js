/**
 * pages模板快速生成脚本,执行命令 yarn template `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];
const dirPath = process.argv[3];

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：yarn tep test');
  process.exit(0);
}

// 页面模版
const indexTep = `
import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PermissionWrapper from '@/utils/PermissionWrapper';
import { connect } from 'dva';
import { Card, Button, Icon, Menu, Dropdown, Modal } from 'antd';
import StandardTable from '@/components/StandardTable';
import ExportLoading from '@/components/ExportLoading';
import FilterIpts from './FilterIpts';

const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
    width: 80,
  },
  {
    title: '是否推荐',
    dataIndex: 'customerServicePhone',
    render: record => {
      switch (record) {
        case 5:
          return '推荐中';
        case 6:
          return '仓库中';
        default:
          return '';
      }
    },
    width: 140,
  },
  {
    title: '操作',
    render: record => {
      const { permission } = this.props;
      const rid = record.id;
      const action = (
        <Menu>
          {permission.includes('chuangrong:travelOrder:info') ? (
            <Menu.Item onClick={() => {}}>详情</Menu.Item>
          ) : null}
          {record.reviewType === 3 &&
            (permission.includes('chuangrong:travelOrder:refund') ? (
              <Menu.Item onClick={() => {}}>修改</Menu.Item>
            ) : null)}
          {record.reviewType === 2 &&
            (permission.includes('chuangrong:travelOrder:review') ? (
              <Menu.Item
                onClick={() => {
                  Modal.confirm({
                    title: 'Confirm',
                    content: 'Bla bla ...',
                    okText: '确定',
                    cancelText: '取消',
                    onCancel: () => {},
                    onOk: () => {},
                  });
                }}
              >
                {index === '1' ? '下架' : '上下架'}
              </Menu.Item>
            ) : null)}
          {record.refundType === 0 &&
            record.orderStatus === 2 &&
            (permission.includes('chuangrong:travelOrder:updateOne') ? (
              <Menu.Item
                onClick={() => {
                  Modal.confirm({
                    title: 'Confirm',
                    content: 'Bla bla ...',
                    okText: '确定',
                    cancelText: '取消',
                    onCancel: () => {},
                    onOk: () => {},
                  });
                }}
              >
                推荐
              </Menu.Item>
            ) : null)}
        </Menu>
      );
      return (
        <Dropdown overlay={action}>
          <a className="ant-dropdown-link">
            操作
            <Icon type="down" />
          </a>
        </Dropdown>
      );
    },
  },
];

@PermissionWrapper
@connect(({ productsManage, loading }) => ({
  productsManage,
  loading: loading.effects['productsManage/fetchList'],
}))
class ${titleCase(dirName)} extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 1,
      currPage: 1,
      pageSize: 10,
      isDetailShow: false,
      isEditShow: false,
    };
  }

  renderBtn = () => {
    const { permission, exportLoading } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:travelOrder:export') && (
          <ExportLoading exportLoading={exportLoading} exportExcel={this.exportExcel}>
            导出
          </ExportLoading>
        )}
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          新增
        </Button>
        <Button onClick={() => window.location.reload()}>
          <Icon type="reload" />
          刷新
        </Button>
      </Fragment>
    );
  };

  onChange = currPage => {
    const { pageSize } = this.state;
    this.setState(
      {
        currPage,
      },
      () => {
        this.getList(currPage, pageSize);
      }
    );
  };

  onShowSizeChange = (currPage, pageSize) => {
    this.setState(
      {
        currPage,
        pageSize,
      },
      () => {
        this.getList(currPage, pageSize);
      }
    );
  };

  getList = async (currPage = 1, pageSize = 10) => {
    const { productsManage: searchInfo, dispatch } = this.props;
    await this.setState({ currPage, pageSize });
    const paraFilter = searchInfo || {};
    await dispatch({
      type: 'productsManage/fetchList',
      payload: {
        currPage,
        pageSize,
        ...paraFilter,
      },
    });
  };

  render() {
    const {
      permission,
      loading,
      productsManage: { list, total },
    } = this.props;
    const { currPage, pageSize } = this.state;
    const values = {
      columns: defcolumns,
      data: {
        list: list.records,
      },
      loading,
      pagination: {
        showTotal: totalarg => '共'+ totalarg + '条',
        current: currPage,
        pageSize,
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        onChange: this.onChange,
        onShowSizeChange: this.onShowSizeChange,
      },
    };
    return (
      <Fragment>
        <PageHeaderWrapper renderBtn={this.renderBtn}>
          <Card bordered={false}>
            {permission.includes('chuangrong:travelOrder:list') ? (
              <>
                <FilterIpts getList={this.getList} pageSize={pageSize} />
                <StandardTable {...values} />
              </>
            ) : null}
          </Card>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

export default ${titleCase(dirName)};
`;

const filterTep = `
import React, { PureComponent } from 'react';
import { Row, Col, Input, Button, Select, Form, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import tableStyles from '@/style/TableList.less';
import { selfAdaption } from '@/utils/utils';

const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption();

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

@connect(({ productsManage }) => ({
  productsManage,
}))
@Form.create()
class FilterIpts extends PureComponent {
  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'tripOrderManage/getAllSelect',
    // });
  }

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
      type: 'tripOrderManage/setSearchInfo',
      payload: this.getFormValue(),
    });
    getList(1, pageSize);
  };

  getFormValue = () => {
    const { form } = this.props;
    const formQueryData = form.getFieldsValue();
    // if (formQueryData.tripTime && formQueryData.tripTime.length) {
    //   formQueryData.tripTimeStart = moment(formQueryData.tripTime[0]).format('YYYY-MM-DD');
    //   formQueryData.tripTimeEnd = moment(formQueryData.tripTime[1]).format('YYYY-MM-DD');
    // }
    // delete formQueryData['tripTime'];
    // delete formQueryData['finishTime'];
    return formQueryData;
  };

  reset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  render() {
    const {
      form: { getFieldDecorator },
      isShowFrame,
    } = this.props;

    const classifyStatus = false;

    return (
      <div className={tableStyles.tableList}>
        <div className={tableStyles.tableListForm}>
          <Form {...formItemConfig}>
            <Row gutter={24} type="flex">
              <Col {...inputConfig}>
                <FormItem label="商品订单号" {...formItemConfig}>
                  {getFieldDecorator('orderNo')(<Input type="number" />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="所属类目" {...formItemConfig}>
                  {getFieldDecorator('productName')(
                    <Select allowClear>
                      {classifyStatus &&
                        classifyStatus.map((item, index) => (
                          <Option key={index} value={item.id}>
                            {item.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="购买人" {...formItemConfig}>
                  {getFieldDecorator('orderNo')(<Input />)}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="订单状态" {...formItemConfig}>
                  {getFieldDecorator('classifyId')(
                    <Select allowClear>
                      {classifyStatus &&
                        classifyStatus.map((item, index) => (
                          <Option key={index} value={item.id}>
                            {item.label}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              {isShowFrame ? (
                <Col {...inputConfig}>
                  <FormItem label="售后状态" {...formItemConfig}>
                    {getFieldDecorator('classifyId')(
                      <Select allowClear>
                        {classifyStatus &&
                          classifyStatus.map((item, index) => (
                            <Option key={index} value={item.id}>
                              {item.label}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              ) : null}
              <Col {...inputConfig}>
                <FormItem label="购买时间" {...formItemConfig}>
                  {getFieldDecorator('buyerName')(
                    <RangePicker
                      onChange={(date, dateString) => {
                        console.log(date, dateString);
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col {...inputConfig}>
                <FormItem label="发货时间" {...formItemConfig}>
                  {getFieldDecorator('saleCountEnd')(
                    <RangePicker
                      onChange={(date, dateString) => {
                        console.log(date, dateString);
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col {...timeConfig}>
                <FormItem label="退款时间" {...formItemConfig}>
                  {getFieldDecorator('reviewType')(
                    <RangePicker
                      onChange={(date, dateString) => {
                        console.log(date, dateString);
                      }}
                    />
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

export default FilterIpts;
`;

// scss文件模版
const scssTep = `
.${dirName}Wrap {
  @include wh(100%, 100%);
}
`;

// model文件模版
const modelTep = `import * as ${dirName}Api from './service';

export default {
  namespace: '${dirName}',
  state: {

  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const data = yield call(${dirName}Api.demo, {});
      if (data.code === 0) {
        yield put({ 
          type: 'save',
          payload: {
            data: data.data
          }
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
`;

// service页面模版
const serviceTep = `import { postRequest } from '../../utils/api';

const ${dirName} = async(params) => {
  return await postRequest('/${dirName}', params);
};

export default ${dirName};
`;

fs.mkdirSync(`${dirPath}/${dirName}`);
process.chdir(`${dirPath}/${dirName}`);

fs.writeFileSync('index.js', indexTep);
fs.writeFileSync('index.scss', scssTep);
fs.writeFileSync('model.js', modelTep);
fs.writeFileSync('service.js', serviceTep);
fs.writeFileSync('FilterIpts.js', filterTep);

console.log(`模版${dirName}已创建,请手动增加models`);

function titleCase(str) {
  const array = str.toLowerCase().split(' ');
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  return array.join(' ');
}

process.exit(0);
