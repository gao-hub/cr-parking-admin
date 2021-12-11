import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows, selectedRowKeys);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const {
      data: { list, pagination },
      selectedRows,
      getCheckboxProps,
      rowKey,
      deleteChange,
      multiOperate,
      scroll,
      ...rest
    } = this.props;

    const paginationProps = {
      showTotal: (total, range) => `共 ${pagination.total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: this.props.pageSizeOptions ? this.props.pageSizeOptions : undefined, //配置分页选项
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps
    };
    return (
      <div className={styles.standardTable}>
        {
          rest.multiSelect ? 
            (<Alert
              message={
                <Fragment>
                  已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项数据&nbsp;&nbsp;
                  {
                    selectedRows && selectedRows.length && multiOperate ? multiOperate : null // 多条操作
                  }
                  {
                    selectedRows && selectedRows.length ? <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                      清空
                    </a> : null
                  }
                  {
                    selectedRows && selectedRows.length && !multiOperate ? <a onClick={() => deleteChange()} style={{ marginLeft: 24 }}>
                      删除
                    </a> : null
                  } 
                </Fragment>
              }
              type="info"
              showIcon
            />): null
        }
        <Table
          rowKey={rowKey ? rowKey : record => record.key}
          rowSelection={selectedRows ? rowSelection : null}
          dataSource={list}
          scroll={{ x: scroll ? scroll : 1300 }}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
