import React, { PureComponent, Fragment } from 'react';
import { Modal, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import permission from '@/utils/PermissionWrapper';
@permission
@connect(({ sendManage }) => ({
  sendManage,
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

    if (
      (type === 1 && returnTotalAmount.bankAvailableBalance > returnTotalAmount.sum) ||
      (type === 2 && returnTotalAmount.bankAvailableBalance > returnTotalAmount.selectedSum)
    ) {
      const res = await dispatch({
        type: 'sendManage/postManualDistributionRentReturns',
        payload: {
          idList,
        },
      });
      if (res.status === 1) {
        message.success(res.statusDesc);
        this.props.clearCheck()
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
        okText={
          type === 1
            ? returnTotalAmount.bankAvailableBalance > returnTotalAmount.sum
              ? '确定'
              : '我知道了'
            : returnTotalAmount.bankAvailableBalance > returnTotalAmount.selectedSum
              ? '确定'
              : '我知道了'
        }
        maskClosable={false}
        destroyOnClose={true}
        onCancel={this.handleCancel}
      >
        <div>
          当前待发放金额总计：
          {returnTotalAmount.sum ? returnTotalAmount.sum : 0}元
        </div>
        <div>
          选中待发放金额总计：
          {type == 1
            ? returnTotalAmount.sum
            : returnTotalAmount.selectedSum
              ? returnTotalAmount.selectedSum
              : 0}
          元
        </div>
        <div>选中待发放免密金额总计：0元</div>
        {type === 1 ? (
          returnTotalAmount.bankAvailableBalance < returnTotalAmount.sum ? (
            <div style={{ color: 'red' }}>当前账户余额不足，暂不可批量发放</div>
          ) : null
        ) : returnTotalAmount.bankAvailableBalance < returnTotalAmount.selectedSum ? (
          <div style={{ color: 'red' }}>当前账户余额不足，暂不可批量发放</div>
        ) : null}
      </Modal>
    );
  }
}
