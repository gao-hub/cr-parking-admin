import React, { Fragment, PureComponent } from 'react'
import { Button, Checkbox, Modal, Form, Card } from 'antd'
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SetColumns from '@/components/SetColumns';
import FilterIpts from './FilterIpts'
import './index.less'
const plainOptions = [
  { label: '序号', value: 'key' },
  { label: '职务', value: 'post' },
  { label: '姓名', value: 'trueName' }
];
const defcolumns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '职务',
    dataIndex: 'post',
  }, {
    title: '姓名',
    dataIndex: 'trueName',
  }];

@Form.create()

export default class Demo extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      initColumns: ['key', 'post', 'trueName'],
      syncColumns: [],
      staticColumns: [
        {
          title: '操作',
          width: '5%'
        }
      ],
      searchWholeState: false
    }
  }
  componentDidMount() {
    this.syncChangeColumns([...defcolumns, ...this.state.staticColumns])
  }
  syncChangeColumns = (array = []) => {
    this.setState({
      syncColumns: array
    })
  }
  /**  展开全部的搜索条件
   * openSearch
   */
  openSearch = () => {
    this.setState({
      searchWholeState: !this.state.searchWholeState
    })
  }
  renderBtn = () => {
    const { searchWholeState } = this.state
    return (
      <Fragment>
        <Button onClick={this.openSearch}>{`${searchWholeState ? '合并' : '展开'}详细搜索`}</Button>
        <SetColumns
          syncColumns={this.state.syncColumns}
          plainOptions={plainOptions}
          defcolumns={defcolumns}
          initColumns={this.state.initColumns}
          staticColumns={this.state.staticColumns}
          syncChangeColumns={this.syncChangeColumns}
        />
      </Fragment>
    )
  }
  render() {
    return (
      <PageHeaderWrapper renderBtn={this.renderBtn}>
        <Card bordered={false}>
          <FilterIpts searchWholeState={this.state.searchWholeState}/>
          <StandardTable
            data={{
              list: [],
              pagination: {},
            }}
            columns={this.state.syncColumns}
            multiSelect = {false}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}
