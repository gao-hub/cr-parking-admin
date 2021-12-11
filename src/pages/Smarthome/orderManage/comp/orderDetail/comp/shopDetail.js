import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Table, Button } from 'antd';
import PermissionWrapper from '@/utils/PermissionWrapper';

@PermissionWrapper
class ShopDetail extends PureComponent {
  render() {
    const { info } = this.props;
    const { permission } = this.props;

    const columns = [
      {
        title: '商品',
        render: record => (
          <div
            style={{
              display: 'flex',
            }}
          >
            <div>
              <img width={100} alt="shopphoto" src={record.productUrl} />
            </div>
            <div
              style={{
                marginLeft: '15px',
              }}
            >
              <div>{record.storeName}</div>
              <div>
                规格：
                {record.productSpecs}
              </div>
              <div>
                规格编码：
                {record.productSpecs}
              </div>
              <div>
                {permission.includes('chuangrong:homeOrder:snapshot') ? (
                  <Button
                    type="link"
                    onClick={() => {
                      // router.push({
                      //   pathname: '/Jiaoyikuaizhao',
                      //   query: {
                      //     id: info?.id,
                      //   },
                      // });
                      window.open(`/Jiaoyikuaizhao?id=${info?.id}`);
                    }}
                  >
                    交易快照
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: '价格（元）',
        dataIndex: 'price',
      },
      {
        title: '数量',
        dataIndex: 'orderCount',
      },
      {
        title: '运费',

        dataIndex: 'freight',
      },
      {
        title: '实际支付',

        dataIndex: 'payment',
      },
      {
        title: '状态',

        dataIndex: 'orderStatus',
        render: value => {
          switch (value) {
            case 1:
              return '待付款';
            case 2:
              return '待发货';
            case 3:
              return '待收货';
            case 4:
              return '已完成';
            case 5:
              return '已关闭';
            case 6:
              return '已退款';
            default:
              return '';
          }
        },
      },
    ];
    return (
      <div
        style={{
          marginTop: '20px',
        }}
      >
        <Table columns={columns} dataSource={[info || {}]} pagination={false} />
      </div>
    );
  }
}

export default ShopDetail;
