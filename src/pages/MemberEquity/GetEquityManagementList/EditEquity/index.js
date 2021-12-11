import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import PermissionWrapper from '@/utils/PermissionWrapper';
import Physical from './Physical';

@PermissionWrapper
@connect(({ EquityManage }) => ({ EquityManage }))
class IndexComponent extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      location,
      type
    } = this.props;
  }

  render() {
    const {
      permission,
      location
    } = this.props;
    const { id, type, goodsType } = location.query;
    return (
      <Fragment>
        <div style={{
          background: '#fff',
          minHeight: '100%',
          padding: '20px'
        }}
        >
          <Physical id={id} />
        </div>
      </Fragment>
    );
  }
}

export default IndexComponent;
