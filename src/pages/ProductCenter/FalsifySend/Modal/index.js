import React, { PureComponent, Fragment } from 'react';
import { Modal, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import permission from '@/utils/PermissionWrapper';
@permission
@connect(({ falsifySendManage }) => ({
  falsifySendManage,
}))
export default class template extends PureComponent {
  constructor(props) {
    super(props);
  }
  handleOk = async () => {
    const {
      permission,
      dispatch,
      release: { visible, type, selectedReleaseRows, idList },
      returnTotalAmount,
    } = this.props;
    if (returnTotalAmount.msg === '') {
      const res = await dispatch({
        type: 'falsifySendManage/postManualDistributionReturnAll',
        payload: {
          idList,
        },
      });
      if (res.status === 1) {
        message.success(res.statusDesc);
        this.props.clearCheck();
        this.props.getList(1, this.props.pageSize);
      } else {
        message.error(res.statusDesc);
      }
    }

    this.props.status(false);
  };

  handleCancel = () => {
    this.props.status(false);
  };
  render() {
    const {
      permission,
      release: { visible, type, selectedReleaseRows, idList },
      returnTotalAmount,
    } = this.props;
    return (
      <Modal
        title="发放提示"
        visible={visible}
        onOk={this.handleOk}
        okText={returnTotalAmount.msg !== '' ? '我知道了' : '确定'}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={this.handleCancel}
      >
        <div>
          当前待发放金额总计：
          {returnTotalAmount.allPrice ? returnTotalAmount.allPrice : 0}元
        </div>
        <div>
          选中待发放金额总计：
          {type == 1
            ? returnTotalAmount.allPrice
            : returnTotalAmount.selectedPrice
              ? returnTotalAmount.selectedPrice
              : 0}
          元
        </div>
        <div>
          选中待发放免密金额总计：
          {returnTotalAmount.selectedToBPrice ? returnTotalAmount.selectedToBPrice : 0}元
        </div>
        {returnTotalAmount.msg !== '' ? (
          <div style={{ color: 'red' }}>{returnTotalAmount.msg}</div>
        ) : null}
      </Modal>
    );
  }
}
