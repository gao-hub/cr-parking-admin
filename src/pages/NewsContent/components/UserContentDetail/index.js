import React, { useState, useEffect } from 'react';
import { Button, Divider, Icon } from 'antd';
import _ from 'lodash';
import Upload from '../../components/Upload';
import MarkdownEditor from '../../components/MarkdownEditor';
import style from './index.less';


const UserContentDetail = props => {
  const { info, type, preview, callBack, defaultImage, videoPlayAuth } = props;
  const [contentDetail, setContentDetail] = useState(info);  // 详情
  const deleteGoods = (index, tag) =>{
    let data = _.cloneDeep(contentDetail);
    //  1 文章， 2 图片 3视频
    if(type === '1') {
      data.articleContent.splice(index, 1);
    } else {
      // 图片或者视频
      data.articleContent.productList.splice(index, 1);
    }
    setContentDetail(data);
    callBack(data);
  }
  useEffect(()=>{
    if(videoPlayAuth.PlayAuth){
      // 创建视频播放器
      new Aliplayer({
        "id": "player-con",
        "vid": videoPlayAuth.VideoId, // 视频id
        "playauth": videoPlayAuth.PlayAuth, // 播放凭证
        "qualitySort": "asc",
        "format": "mp4",
        "mediaType": "video",
        "width": "300px",
        "height": "300px",
        "autoplay": false,
        "isLive": false,
        "cover": info.coverPic || '', // 视频封面图
        "rePlay": false,
        "playsinline": true,
        "preload": false,
        "controlBarVisibility": "hover",
        "useH5Prism": true
        }, function (player) {
          console.log("The player is created");
        }
      );
    }
  }, [videoPlayAuth])
  return (
    <div className={style.UserContentDetail}>
      {
        contentDetail.articleContent && type === '2' &&
        <Upload
          type={type === '2' ? "image" : ''}
          disabled={preview === 'info' || type === '3'}
          defaultUrl={type === '2' ? (contentDetail.articleContent.images || []) : (contentDetail.articleContent.videoUrl || '')}
          defaultImage={defaultImage}
          setIconUrl={url => {
            let obj = contentDetail;
            if(type === '2'){
              obj.articleContent.images = url;
            } else {
              obj.articleContent.videoUrl = url.toString();
            }
            setContentDetail(obj);
            callBack(obj);
          }}
        />
      }
      {
        type === '3' && <div style={{ marginBottom: 20 }} id="player-con" />
      }
      <div className={style.title} >{ info.articleTitle }</div>
      <Divider />
      {
        type !== '1' &&
        <div className={style.contentItem}>
          <MarkdownEditor
            uploadImageUrl="/article/upload"
            preview={preview}
            content={contentDetail && contentDetail.articleContent.content}
            callBack={(html, md)=>{
              contentDetail.articleContent.content = md;
              callBack(contentDetail);
            }}
          />
        </div>
      }
      {
        type === '1' && contentDetail && contentDetail.articleContent && contentDetail.articleContent.map((item, index)=>{
          // 1 商品 3 富文本 2 图片
          return (
            item.type === 3 ?
              <div key={index} className={style.contentItem}>
                <MarkdownEditor
                  uploadImageUrl="/article/upload"
                  preview={preview}
                  content={item.content}
                  callBack={(html, md)=>{
                    item.content = md;
                    callBack(contentDetail);
                  }}
                />
              </div>
              : item.type === 1 ?
              <div key={index} className={style.contentItem}>
                <div className={style.goodsContent}>
                  <div className={style.goodsInfo}>
                    <img src={item.image} />
                    <div className={style.info}>
                      <div>
                        <div className={style.name}>{item.title}</div>
                        <div>
                          <span className={style.price}>{item.discountPrice}</span>
                          {
                            item.otPrice &&
                            <span className={style.overPrice}>{item.otPrice}</span>
                          }
                        </div>
                      </div>
                      <div className={style.bottom}>
                        {
                          item.sold && <div className={style.saleNum}>{item.sold}</div>
                        }
                        <Button type="primary">购买</Button>
                      </div>
                    </div>
                  </div>
                  {
                    preview === 'edit' &&
                    <div className={style.icon} onClick={()=>deleteGoods(index)}>
                      <Icon type="delete" />
                    </div>
                  }
                </div>
              </div>
              :
              <div key={index} className={style.contentItem}>
                <img className={style.typeImage} src={ item.image } />
                {
                  preview === 'edit' &&
                  <div className={style.icon} onClick={()=>deleteGoods(index)}>
                    <Icon type="delete" />
                  </div>
                }
              </div>
          )
        })
      }
      {
        type !== '1' &&
        contentDetail.articleContent &&
        contentDetail.articleContent.productList &&
        contentDetail.articleContent.productList.map((item, index)=>{
          // 1 商品 3 富文本 2 图片
          return (
            <div key={index} className={style.contentItem}>
              <div className={style.goodsContent}>
                <div className={style.goodsInfo}>
                  <img src={item.image} />
                  <div className={style.info}>
                    <div>
                      <div className={style.name}>{item.title}</div>
                      <div>
                        <span className={style.price}>{item.discountPrice}</span>
                        {
                          item.otPrice &&
                          <span className={style.overPrice}>{item.otPrice}</span>
                        }
                      </div>
                    </div>
                    <div className={style.bottom}>
                      {
                        item.sold && <div className={style.saleNum}>{item.sold}</div>
                      }
                      <Button type="primary">购买</Button>
                    </div>
                  </div>
                </div>
                {
                  preview === 'edit' &&
                  <div className={style.icon} onClick={()=>deleteGoods(index)}>
                    <Icon type="delete" />
                  </div>
                }
              </div>
            </div>
          )
        })
      }
    </div>
  );
}

export default UserContentDetail;
