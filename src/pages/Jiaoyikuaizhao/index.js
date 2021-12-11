import React, { PureComponent } from 'react';
import SwiperCore, { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getSnapshot } from './services/index';
import style from './index.less';

import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';

SwiperCore.use([Pagination]);

export default class jiaoyikuaizhao extends PureComponent {
  state = {
    info: null,
    data: null,
  };

  componentWillMount() {
    const {
      location: {
        query: { id },
      },
    } = this.props;
    getSnapshot({
      id,
    }).then(data => {
      if (data.status === 1) {
        this.setState({
          info: data.data.sapshot,
          data: data.data,
        });
      }
    });
  }

  render() {
    const { info, data } = this.state;
    return (
      <div className={style.divWrapper}>
        <Swiper
          pagination={{ type: 'fraction' }}
          onSlideChange={() => console.log('slide change')}
          onSwiper={swiper => console.log(swiper)}
          className={style.SwiperWrapper}
          initialSlide={0}
        >
          {info?.images.map(value => (
            <SwiperSlide>
              <img
                src={value}
                alt="商品介绍图"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={style.info}>
          <div className={style.money}>¥ {data?.price}</div>
          <div className={style.jieshao}>{info?.storeName}</div>
          <div>
            当前页面内容为订单快照，包含订单创建时的商品描述和下单信息，买卖双方和平台在发生交易争议时，该页面作为判断依据
          </div>
          <div className={style.maidian}>{info?.description}</div>
        </div>
        <div className={style.guige}>
          {info?.specType ? (
            <div>
              <div>选择：</div>
              <div>{data?.productSpecs}</div>
            </div>
          ) : null}
          <div>
            <div>运费：</div>
            <div>{info?.postage}元</div>
          </div>
          <div>
            <div>保障：</div>
            <div>
              {info?.postSaleType === 0
                ? '7天无理由退换货'
                : info?.postSaleType === 1
                  ? '不支持7天无理由退换货'
                  : '质量问题包退换'}
            </div>
          </div>
        </div>
        <div className={style.detail}>
          <div className={style.detailTopText}>详情</div>
          <div
            dangerouslySetInnerHTML={{ __html: info?.content }}
            style={{
              width: '100%',
              overflow: 'auto',
            }}
          />
        </div>
      </div>
    );
  }
}
