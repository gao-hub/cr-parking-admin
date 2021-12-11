import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import permission from '@/utils/PermissionWrapper';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Menu, Icon, Button, Table, Modal, message, Card, Dropdown } from 'antd';
import AddCategory from './AddCategory';
import AddQuestion from '../AddQuestion';
import Swal from 'sweetalert2';
import styles from './index.less';

// 获取ids,子类树排序时需要获取子类的所有id
const getChildIds = (list = [], id) => {
  let res = '';
  for (let item of list) {
    if (res) break;
    if (item.children && item.children.length) {
      for (let child of item.children) {
        if (child.id === id) {
          res = item.children.map(item => item.id).join(',');
          break;
        }
      }
    }
  }
  return res;
};

@permission
@connect(({ helperCenter }) => ({
  helperCenter,
}))
export default class CategoryList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    currPage: 1,
    pageSize: 10,
    previewImg: '',
    previewVisible: false,
    actionType: '',
    actionId: '',
    typeId: '',
    syncColumns: [],
    staticColumns: [
      {
        title: '操作',
        width: 200,
        render: record => {
          const { permission } = this.props;
          const action = (
            <div className={styles.operation}>
              {/* 问题信息添加 */}
              {permission.includes('chuangrong:helpInfo:add') &&
              record.level === 1 && <span onClick={() => this.handleChildAdd(record)}>
                <Icon type='plus' />
              </span>}
              {/* 分类编辑 */}
              {permission.includes('chuangrong:helpType:update') &&
              record.level === 1 && (
                <span onClick={() => this.handleEdit(record, 'category')}>
                    <Icon type='edit' />
                  </span>
              )}
              {/* 问题编辑 */}
              {permission.includes('chuangrong:helpInfo:update') &&
              record.level === 2 && (
                <span onClick={() => this.handleEdit(record, 'question')}>
                    <Icon type='edit' />
                  </span>
              )}
              {/*上移*/}
              {permission.includes('chuangrong:helpType:sort') &&
              record.level === 1 && (
                <span className={record.disabledUp ? styles.disabledIcons : ''}
                      onClick={() => this.handleMove(record, 'up')}>
                  <Icon type='arrow-up' />
                  </span>
              )}
              {permission.includes('chuangrong:helpType:sort') &&
              record.level === 2 && (
                <span className={record.disabledUp ? styles.disabledIcons : ''}
                  onClick={() => this.handleChildMove(record, 'up')}>
                    <Icon type='arrow-up' />
                  </span>
              )}
              {/*下移*/}
              {permission.includes('chuangrong:helpType:sort') &&
              record.level === 1 && (
                <span className={record.disabledDown ? styles.disabledIcons : ''}
                  onClick={() => this.handleMove(record, 'down')}>
                    <Icon type='arrow-down' />
                  </span>
              )}
              {permission.includes('chuangrong:helpType:sort') &&
              record.level === 2 && (
                <span className={record.disabledDown ? styles.disabledIcons : ''}
                  onClick={() => this.handleChildMove(record, 'down')}>
                  <Icon type='arrow-down' />
                  </span>
              )}
              {/* 分类删除 */}
              {permission.includes('chuangrong:helpType:delete') &&
              record.level === 1 && (
                <span onClick={() => this.handleDelete(record)}>
                    <Icon type='delete' />
                  </span>
              )}
              {/* 问题删除 */}
              {permission.includes('chuangrong:helpInfo:delete') &&
              record.level === 2 && (
                <span onClick={() => this.handleChildDelete(record)}>
                    <Icon type='delete' />
                  </span>
              )}
            </div>
          );
          return action;
        },
      },
    ],
    defcolumns: [
      {
        title: '名称',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '点击量',
        dataIndex: 'clickNum',
        key: 'clickNum',
      },
      {
        title: '图标',
        dataIndex: 'typePic',
        key: 'typePic',
        width: 150,
        render: (record, row) =>
          row.typePic && row.typePic  !== '/' ? (
            <Card
              hoverable
              style={{ width: 50 }}
              bodyStyle={{ padding: 0 }}
              onClick={() => this.previewImg(row.typePic)}
              cover={<img src={row.typePic} />}
            />
          ) : '/',
      },
      {
        title: '状态',
        dataIndex: 'openStatusStr',
        key: 'openStatusStr',
      },
    ],
  };

  componentDidMount() {
    this.syncChangeColumns([...this.state.defcolumns, ...this.state.staticColumns]);
    this.getList(this.state.currPage, this.state.pageSize);
  }

  syncChangeColumns = array => {
    this.setState({
      syncColumns: array,
    });
  };

  getList = (currPage, pageSize) => {
    this.props.dispatch({
      type: 'helperCenter/getCategoryList',
      payload: {
        currPage,
        pageSize,
      },
    });
  };

  handleAdd = type => {
    this.setState(
      {
        actionType: 'add',
        actionId: '',
      },
      () => {
        this.childCategory.setVisible();
      },
    );
  };

  handleChildAdd = data => {
    this.setState(
      {
        actionType: 'add',
        actionId: '',
        typeId: data.id,
      },
      () => {
        this.childQuestion.setVisible();
      },
    );
  };
  handleEdit = (data, type) => {
    // TODO 通过类型判断
    this.setState(
      {
        actionType: 'edit',
        actionId: data.id,
      },
      () => {
        if (type === 'category') {
          this.childCategory.setVisible();
        } else {
          this.childQuestion.setVisible();
        }
      },
    );
  };

  handleDelete = async data => {
    const confirmVal = await Swal.fire({
      text: '删除该分类时，其子集也会被同时删除。确定要执行本次操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      let res = await this.props.dispatch({
        type: 'helperCenter/deleteCategory',
        payload: {
          id: data.id,
        },
      });
      if (res && res.status) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      } else message.error(res.statusDesc);
    }
  };

  handleChildDelete = async data => {
    const confirmVal = await Swal.fire({
      text: '确定要删除吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    if (confirmVal.value) {
      let res = await this.props.dispatch({
        type: 'helperCenter/deleteQuestion',
        payload: {
          id: data.id,
        },
      });
      if (res && res.status) {
        message.success(res.statusDesc);
        this.getList(this.state.currPage, this.state.pageSize);
      } else message.error(res.statusDesc);
    }
  };
  handleMove = async (data, type) => {
    if ((type === 'up' && data.disabledUp) || (type === 'down' && data.disabledDown)) return;
    const {
      helperCenter: {
        category: { list },
      },
    } = this.props;
    let typeOption = {
      up: 0,
      down: 1,
    };
    let ids = list.map(item => item.id).join(',');
    let res = await this.props.dispatch({
      type: 'helperCenter/moveCategory',
      payload: {
        id: data.id,
        direction: typeOption[type],
        ids,
      },
    });
    if (res && res.status === 1) {
      message.success(res.statusDesc);
      this.getList(this.props.currPage, this.props.pageSize);
    } else message.error(res.statusDesc);
  };

  /**
   * 进行tree child排序
   * @param data
   * @param type up/down
   * @returns {Promise<void>}
   */
  handleChildMove = async (data, type) => {
    if ((type === 'up' && data.disabledUp) || (type === 'down' && data.disabledDown)) return
    const {
      helperCenter: {
        category: { list },
      },
    } = this.props;

    let typeOption = {
      up: 0,
      down: 1,
    };
    let res = await this.props.dispatch({
      type: 'helperCenter/moveQuestion',
      payload: {
        id: data.id,
        direction: typeOption[type],
        ids: getChildIds(list, data.id),
      },
    });
    if (res && res.status === 1) {
      message.success(res.statusDesc);
      this.getList(this.props.currPage, this.props.pageSize);
    } else message.error(res.statusDesc);
  };

  previewImg = url => {
    this.setState({ previewImg: url, previewVisible: true });
  };

  expandIcon = props => {
    if (props.record.children) {
      if (props.expanded) {
        return (
          <Icon
            style={{ marginRight: '5px' }}
            type='caret-down'
            onClick={e => props.onExpand(props.record, e)}
          />
        );
      } else {
        return (
          <Icon
            style={{ marginRight: '5px' }}
            type='caret-right'
            onClick={e => props.onExpand(props.record, e)}
          />
        );
      }
    } else {
      return <i style={{ marginRight: '20px' }} onClick={e => props.onExpand(props.record, e)} />;
    }
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
    });
  };
  renderBtn = () => {
    const { permission } = this.props;
    return (
      <Fragment>
        {permission.includes('chuangrong:helpType:add') && (
          <Button onClick={() => this.handleAdd('category')}>添加分类</Button>
        )}
        <Button style={{ marginBottom: 16 }} onClick={() => window.location.reload()}>
          刷新
        </Button>
      </Fragment>
    );
  };

  render() {
    const {
      permission,
      helperCenter: {
        category: { list },
      },
    } = this.props;
    const { actionType, actionId, currPage, pageSize, typeId } = this.state;
    return (
      <Fragment>
        <PageHeaderWrapper hiddenBreadcrumb renderBtn={this.renderBtn}>
          <Card bordered={false}>
            <Table
              rowKey={record => record.uniqueKey}
              expandIcon={props => this.expandIcon(props)}
              onExpand={this.onExpand}
              columns={this.state.syncColumns}
              dataSource={list}
              pagination={false}
            />
          </Card>

          {/* 图片预览 */}
          <Modal
            visible={this.state.previewVisible}
            footer={null}
            onCancel={() => this.setState({ previewVisible: false })}
          >
            <img style={{ width: '100%' }} src={this.state.previewImg} />
          </Modal>
          <AddCategory
            getChild={child => {
              this.childCategory = child;
            }}
            getList={this.getList}
            currPage={currPage}
            pageSize={pageSize}
            actionId={actionId}
            actionType={actionType}
          />
          <AddQuestion
            getChild={child => (this.childQuestion = child)}
            getList={this.getList}
            currPage={currPage}
            pageSize={pageSize}
            actionId={actionId}
            actionType={actionType}
            typeId={typeId}
          />
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}
