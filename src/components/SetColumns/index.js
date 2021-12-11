import React, { Fragment, PureComponent } from 'react'
import { Button, Checkbox, Modal, Form } from 'antd'
// import StandardTable from '@/components/StandardTable';
import styles from './index.less'
const CheckboxGroup = Checkbox.Group;

@Form.create()

export default class Demo extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      editorStateValue: '',
      initColumns: props.initColumns,
      staticColumns: props.staticColumns
    }
  }
  onChange = (checkedValues)=> {
    const { defcolumns } = this.props
    let data = []
      defcolumns.forEach((r, index)=>{
      checkedValues.forEach(rs=>{
        if(r.dataIndex == rs){
          data.push(r)
        }
      })
    })
    this.props.syncChangeColumns([...data, ...this.state.staticColumns ])
  }
  changeVisible = (val) => {
    this.setState({
      visible: val
    })
  }
  handleOk = () => {
    this.onChange(this.props.form.getFieldsValue().columnsList)
    this.changeVisible(false)
    this.setState({
      initColumns: this.props.form.getFieldsValue().columnsList
    })
  }
  renderContent = ()=> {
    const { getFieldDecorator } = this.props.form
    const { plainOptions } = this.props
    return <Form>
      {getFieldDecorator('columnsList', {
        initialValue: this.state.initColumns
      })(
        <CheckboxGroup options={plainOptions} />
      )}
    </Form>
  }
  render() {
    return (
      <Fragment>
        <Button onClick={() => this.changeVisible(true)}>定制列</Button>
        <Modal
          title= '定制列'
          visible={this.state.visible}
          // bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
          onOk={this.handleOk}
          maskClosable={false}
          destroyOnClose={true}
          onCancel={() => this.changeVisible(false)}
        >
          { this.renderContent() }
        </Modal>
      </Fragment>
    )
  }
}