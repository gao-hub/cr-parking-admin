import React, { useState } from 'react';
import { Input, Form, Row, Col, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { businessAccountOpen, businessAccountApply, businessAccountUserinfo } from './services';
import './index.less';
import { selfAdaption } from '@/utils/utils';
const { inputConfig, timeConfig, formItemConfig, searchConfig, colConfig } = selfAdaption()
const { Search } = Input;

function TestInUat() {
  const [userId, setUserId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [idNo, setIdNo] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const formSubmit = async () => {
    const para={
      userId,
      regPhone,
      userName,
      idNo,
      regEmail,
    }
    businessAccountOpen(para).then((res)=>{
      console.log(res)
    })
  }
  return (
    <PageHeaderWrapper>
      <Form>
        <Row gutter={24} type="flex">
          <Col {...inputConfig}>
            <Form.Item label="企业开户UserId" name="userId">
              <Input placeholder="请输入userId" value={userId} onChange={value => setUserId(value.target.value)}/>
            </Form.Item>
          </Col>
          <Col {...inputConfig}>
            <Form.Item label="手机号regPhone" name="regPhone">
              <Input  placeholder="请输入regPhone" value={regPhone} onChange={value => setRegPhone(value.target.value)}/>
            </Form.Item>
          </Col>
          <Col {...inputConfig}>
            <Form.Item label="公司名称userName" name="userName">
              <Input  placeholder="请输入userName"  value={userName} onChange={value => setUserName(value.target.value)}/>
            </Form.Item>
          </Col>
          <Col {...inputConfig}>
            <Form.Item label="统一社会信用代码证idNo" name="idNo">
              <Input  placeholder="请输入idNo" value={idNo} onChange={value => setIdNo(value.target.value)}/>
            </Form.Item>
          </Col>
          <Col {...inputConfig}>
            <Form.Item label="邮箱regEmail" name="regEmail">
              <Input placeholder="请输入regEmail" value={regEmail} onChange={value => setRegEmail(value.target.value)}/>
            </Form.Item>
          </Col>
          <Col {...searchConfig}>
            <Form.Item>
              <Button onClick={formSubmit} type="primary">开户</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Form>
        <Form.Item label="物业开户后协议申请">
          <Search
            placeholder="请输入userId"
            onSearch={value => businessAccountApply({ userId: value }).then((res)=>{
              console.log(res)
            })}
            style={{ width: 200 }}
            enterButton="申请"
          />
        </Form.Item>
      </Form>
      <Form>
        <Form.Item label="物业开户后更新合作银行账号">
          <Search
            placeholder="请输入userId"
            onSearch={value => businessAccountUserinfo({ userId: value }).then((res)=>{
              console.log(res)
            })}
            style={{ width: 200 }}
            enterButton="更新"
          />
        </Form.Item>
      </Form>
    </PageHeaderWrapper>
  );
}

export default TestInUat;
