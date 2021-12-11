import React, { PureComponent } from 'react';
import styles from './index.scss';

export default class Shopcontent extends PureComponent {
  render() {
    const { data } = this.props;

    return (
      <div className={styles.containerwrapper}>
        <div>
          <img
            src={data.image}
            alt="商品"
            style={{
              height: '100%',
              width: '200px',
            }}
          />
        </div>
        <div>
          <div>{data.storeName}</div>
          <div>
            <span
              style={{
                color: '#ff0000',
              }}
            >
              {data.otPrice}
            </span>
            <span
              style={{
                textDecoration: 'line-through',
                marginRight: '10px',
                fontSize: '12px',
              }}
            >
              {data.markPrice}
            </span>
          </div>
          <div>
            已售
            {data.ficti}
          </div>
        </div>
      </div>
    );
  }
}
