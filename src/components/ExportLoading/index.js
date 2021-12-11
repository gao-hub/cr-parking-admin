import React, { Component, Fragment } from 'react';
import { Button, message, Icon } from 'antd';

export default class ExportLoading extends Component {
  constructor(props) {
    super(props);
  }

  exportExcelLoading = () => {
    message.warning('正在导出数据，请耐心等待！');
  };

  render() {
    const { exportLoading, exportTile, exportExcel } = this.props;
    return (
      <Fragment>
        {exportLoading ? (
          <Button onClick={this.exportExcelLoading}>
            <Icon type="loading" />
            {exportTile || '导出列表'}
          </Button>
        ) : (
          <Button onClick={exportExcel}>
            <Icon type="export" />
            {exportTile || '导出列表'}
          </Button>
        )}
      </Fragment>
    );
  }
}
