import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Tree, TreeSelect, Radio } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const RadioGroup = Radio.Group;

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];


@Form.create()
@connect(({ RoleManage, loading }) => ({
  RoleManage,
}))
export default class ModifyRole extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      perms: '',
    };
  }
  changeVisible = visible => {
    this.setState({
      visible,
    });
  };
  handleOk = async () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        const res = await dispatch({
          type: 'RoleManage/upDateRoleManage',
          payload: {
            ...values,
            roleId: this.props.RoleManage.modifyId,
            menuIds: this.props.RoleManage.menuAuthorize,
          }
        })
        if (res && res.status === 1) {
          this.changeVisible(false)
          message.success(res.statusDesc)
          this.props.getRoleList(this.props.currPage, this.props.pageSize)
        } else message.error(res && res.statusDesc)
      }
    });
  };
  componentDidMount() {
    this.props.getChildData(this);
    // this.focusEditor();
  }
  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    this.props.dispatch({
      type: 'RoleManage/modifyMenuAuthorize',
      payload: checkedKeys
    })
  };

  onSelect = (activeList, info) => {
    console.log(activeList, 'roleInfo ')
  };

  renderTreeNodes = data =>
    data && data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  getMenuData = (value, node, extra) => {
    this.setState({ perms: node.props.perms });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { modifyInfoData : { roleInfo, menuTree }, menuAuthorize } = this.props.RoleManage;
    const formConfig = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title="修改"
        bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        <Form>
          <FormItem
            label="角色名称"
            {...formConfig}
          >
            {getFieldDecorator('roleName', {
              rules: [{ required: true, message: '请输入角色名称' }],
              initialValue: roleInfo && roleInfo.roleName
            })(
              <Input placeholder={'请输入角色名称'} />
            )}
          </FormItem>
          <FormItem
            label="角色说明"
            {...formConfig}
          >
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入角色说明' }],
              initialValue: roleInfo && roleInfo.remark
            })(
              <Input placeholder={'请输入角色说明'} />
            )}
          </FormItem>
          <FormItem
            label="角色状态"
            {...formConfig}
          >
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择角色状态' }],
              initialValue: roleInfo ? roleInfo.status : this.state.value
            })(
              <RadioGroup>
                <Radio value='0'>正常</Radio>
                <Radio value='1'>停用</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="菜单授权" {...formConfig}>
            {getFieldDecorator('activeList')(
              <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={menuAuthorize}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
              >
                {this.renderTreeNodes(menuTree)}
              </Tree>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
