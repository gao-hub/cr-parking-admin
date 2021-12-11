import React, { Component, Fragment } from 'react';
import { Row, Col, Card, message } from 'antd';
import { connect } from 'dva';

import permission from '@/utils/PermissionWrapper';
import styles from './index.less';

const middleColumns = [
  {
    name: '用户姓名',
    key: 'truename',
  },
  {
    name: '手机号',
    key: 'mobile',
  },
  {
    name: '会员等级',
    key: 'gradeStr',
  },
  {
    name: '注册时间',
    key: 'regTime',
  },
];

const endColumns = [
  {
    name: '用户名',
    key: 'username',
  },
  {
    name: '身份证号',
    key: 'idcard',
  },
  {
    name: '开户状态',
    key: 'openAccountStr',
  },
  {
    name: '开户时间',
    key: 'openAccountTime',
  },
];
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 10,
  },
};

const supplyInfo = [
  [
    {
      name: '状态',
      key: 'openStatusStr',
    },
    {
      name: '邀请码',
      key: 'userId',
    },
    {
      name: '合作银行账户',
      key: 'bankCardNo',
    },
  ],
  [
    {
      name: '一级渠道',
      key: 'parentUtmName',
    },
    {
      name: '当前成长值',
      key: '',
    },
    {
      name: '推荐人',
      key: 'spreadsUserName',
    },
  ],
  [
    {
      name: '角色',
      key: 'roleName',
    },
    {
      name: '当前积分',
      key: '',
    },
    {
      name: 'ACCP用户编号',
      key: 'accpUserno',
    },
  ],
];

const fontWeight = {
  fontWeight: 'bold',
};

const borderBottom = {
  'borderBottom': '1px solid #ebedf0',
};

const borderRight = {
  'borderRight': '1px solid #ebedf0',
};

const avatar = require('@/assets/avatar.png');

@permission
@connect(({ memberDetail }) => ({
  memberDetail,
}))
export default class memberDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        username: '123',
      },
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const { dispatch } = this.props;
    const { userId } = this.props.location.query;
    const res = await dispatch({ type: 'memberDetail/getMemberDetail', payload: { userId } });
    if (res && res.status === 1) {
      this.setState({
        data: res.data,
      });
    } else res && message.error(res.statusDesc);
  }

  getReceiverAddress = () => {
    const {
      data: { receiveAddresseList },
    } = this.state;
    let list = receiveAddresseList && receiveAddresseList.length ? receiveAddresseList : [
      {
        receiveName: '',
        receivePhone: '',
        area: '',
        address: '',
      },
    ];
    return (
      <div className={styles.formBox}>
        <div className='label'>
          收货地址
        </div>
        <div className={styles.content} style={{ paddingLeft: 20 }}>
          {
            list.map(item => (
              <div style={borderBottom} key={item.id}>
                <div className={styles.formBox}>
                  <div className={styles.label}>
                    姓名：
                  </div>
                  <div className={styles.content}>
                    {item.receiveName}
                  </div>
                </div>
                <div className={styles.formBox}>
                  <div className='label'>
                    手机号：
                  </div>
                  <div className='content'>
                    {item.receivePhone}
                  </div>
                </div>
                <div className={styles.formBox}>
                  <div className='label'>
                    所在地区：
                  </div>
                  <div className='content'>
                    {item.area}
                  </div>
                </div>
                <div className={styles.formBox}>
                  <div className='label'>
                    详细地址：
                  </div>
                  <div className='content'>
                    {item.address}
                  </div>
                </div>
              </div>
            ))
          }

        </div>
      </div>
    );
  };

  render() {
    const { data } = this.state;
    return (
      <Fragment>
        <Card border={false} style={{ marginTop: '20px' }}>
          <Row type='flex' justify='space-around'>
            <Col span={6}>
              <h1 style={fontWeight}>会员详情</h1>
            </Col>
            <Col span={6} />
            <Col span={6} />
          </Row>
          <Row type='flex' justify='space-around'>
            <Col span={6} style={borderRight}>
              <div className={styles['avatar-image']}>
                <img src={data.iconUrl || avatar} />
              </div>
              <div className={styles['member-name']}>{data.nickName}</div>
            </Col>
            <Col span={6}>
              {middleColumns.map((item, index) => {
                return (
                  <div className={styles.formBox} key={index}>
                    <div className='label'>{item.name}：</div>
                    <div>{data[item.key]}</div>
                  </div>
                );
              })}
            </Col>
            <Col span={6}>
              {endColumns.map((item, index) => {
                return (
                  <div className={styles.formBox} key={index}>
                    <div className='label'>{item.name}：</div>
                    <div>{data[item.key]}</div>
                  </div>
                );
              })}
            </Col>
          </Row>
        </Card>
        <Card border={false} style={{ marginTop: '20px' }}>
          {/* 补充信息 */}
          <div className='user-info-item'>
            <Row type='flex' justify='space-around'>
              <Col span={6}>
                <h1 style={fontWeight}>补充信息</h1>
              </Col>
              <Col span={6} />
              <Col span={6} />
            </Row>
            <Row type='flex' justify='space-around'>
              {supplyInfo.map(item => {
                return (
                  <Col span={6}>
                    {
                      item.map((child) => {
                        return (
                          <div className={styles.formBox} key={child.key}>
                            <div class='label'>{child.name}：</div>
                            <div>{data[child.key]}</div>
                          </div>
                        );
                      })
                    }
                  </Col>
                );
              })}
            </Row>
          </div>
          {/* 收货信息 */}
          <div className='user-info-item'>
            <Row type='flex' justify='space-around'>
              <Col span={6}>
                <h1 style={fontWeight}>收货信息</h1>
              </Col>
              <Col span={6} />
              <Col span={6} />
            </Row>
            <Row>
              <Col offset={1}>
                {this.getReceiverAddress()}
                <div className={styles.formBox}>
                  <div className='label'>
                    通讯地址
                  </div>
                  <div className={styles.content} style={{ paddingLeft: 20 }}>
                    <div style={borderBottom}>
                      {/*<div className={styles.formBox}>*/}
                      {/*  <div className={styles.label}>*/}
                      {/*    姓名：*/}
                      {/*  </div>*/}
                      {/*  <div className={styles.content}>*/}
                      {/*    {data.truename}*/}
                      {/*  </div>*/}
                      {/*</div>*/}
                      {/*<div className={styles.formBox}>*/}
                      {/*  <div className='label'>*/}
                      {/*    手机号：*/}
                      {/*  </div>*/}
                      {/*  <div className='content'>*/}
                      {/*    {data.mobile}*/}
                      {/*  </div>*/}
                      {/*</div>*/}
                      <div className={styles.formBox}>
                        <div className='label'>
                          所在地区：
                        </div>
                        <div className='content'>
                          {data.area}
                        </div>
                      </div>
                      <div className={styles.formBox}>
                        <div className='label'>
                          详细地址：
                        </div>
                        <div className='content'>
                          {data.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </Fragment>
    );
  }
}
