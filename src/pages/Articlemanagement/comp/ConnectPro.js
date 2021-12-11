import React, { PureComponent } from 'react';
import { Button } from 'antd';
import CheckshopModal from './CheckshopModal';

export default class ConnectPro extends PureComponent {
  state = {
    CheckshopModalVisible: false,
    checkedShopArr: [],
  };

  componentDidMount() {
    const { value } = this.props;
    if (value && value.length > 0) {
      this.setState({ checkedShopArr: value });
    }
  }

  getCheckedShop = value => {
    const { onChange } = this.props;
    this.setState({
      checkedShopArr: value,
      CheckshopModalVisible: false,
    });
    onChange(value);
  };

  render() {
    const { checkedShopArr, CheckshopModalVisible } = this.state;
    const { disabled, value } = this.props;
    return (
      <div>
        {checkedShopArr.map(shop => {
          return (
            <span
              key={shop.id}
              style={{
                color: '#0000FF',
                marginRight: '10px',
              }}
            >
              {shop.storeName}
            </span>
          );
        })}
        <Button
          onClick={() => {
            this.setState({
              CheckshopModalVisible: true,
            });
          }}
          disabled={disabled}
          type="primary"
        >
          选择产品
        </Button>
        <CheckshopModal
          visible={CheckshopModalVisible}
          handleCancel={() => {
            this.setState({
              CheckshopModalVisible: false,
            });
          }}
          handleOk={this.getCheckedShop}
          value={value}
        />
      </div>
    );
  }
}
