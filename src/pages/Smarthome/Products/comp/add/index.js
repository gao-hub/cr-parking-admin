import React, { PureComponent } from 'react';
import permission from '@/utils/PermissionWrapper';
import { connect } from 'dva';
import router from 'umi/router';
import { Col, Button, message } from 'antd';
import BasicInformation from './BasicInformation';
import SalesInformation from './SalesInformation';
import SetInformation from './SetInformation';
import styles from './index.less';
import { addProduct, updateInfo } from '../../services/index';

@permission
@connect(({ productsManage, loading }) => ({
  productsManage,
  loading: loading.effects['productsManage/AddProduct'],
}))
class Add extends PureComponent {
  componentWillMount() {
    const {
      location: { query },
      dispatch,
    } = this.props;
    if (query.id) {
      dispatch({
        type: 'productsManage/getInfo',
        payload: {
          id: query.id,
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productsManage/setSpecSelectData',
      payload: [],
    });
    dispatch({
      type: 'productsManage/setInfoData',
      payload: null,
    });
    dispatch({
      type: 'productsManage/setTotalStocks',
      payload: 0,
    });
  }

  getThis1 = value => {
    this.BasicInformation = value;
  };

  getThis2 = value => {
    this.SalesInformation = value;
  };

  getThis3 = value => {
    this.SetInformation = value;
  };

  handleSubmit = async () => {
    const {
      productsManage: { infoData },
    } = this.props;
    if (
      this.BasicInformation.handleFormData() &&
      this.SalesInformation.handleFormData() &&
      this.SetInformation.handleFormData()
    ) {
      const params = {
        ...this.BasicInformation.handleFormData(),
        ...this.SalesInformation.handleFormData(),
        ...this.SetInformation.handleFormData(),
      };
      let res;
      if (infoData) {
        res = await updateInfo({
          ...params,
          id: infoData.id,
        });
      } else {
        res = await addProduct(params);
      }
      if (res && res.status === 1) {
        message.success(res.statusDesc);
        router.goBack();
      } else {
        message.error(res.statusDesc);
      }
    }
  };

  render() {
    const {
      loading,
      productsManage: { infoData },
      location: { query },
    } = this.props;

    return (
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        {((query.id || query.edit) && infoData !== null) || query.add ? (
          <>
            <BasicInformation getThis={this.getThis1} infoData={infoData} disabled={!query.edit} />
            <SalesInformation getThis={this.getThis2} infoData={infoData} disabled={!query.edit} />
            <SetInformation getThis={this.getThis3} infoData={infoData} disabled={!query.edit} />
          </>
        ) : null}
        <Col className={styles.btnwrapper}>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => {
              router.goBack();
            }}
          >
            返回
          </Button>
          {query.edit && (
            <Button
              onClick={() => {
                this.handleSubmit();
              }}
              loading={loading}
              type="primary"
            >
              保存
            </Button>
          )}
        </Col>
      </div>
    );
  }
}

export default Add;
