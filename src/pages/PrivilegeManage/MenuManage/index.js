import React, { PureComponent, Fragment } from "react";
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import permission from '@/utils/PermissionWrapper';
import classNames from 'classnames';
import { connect } from 'dva';
import "antd/dist/antd.css";
import { Card, Table, Icon, Button, Dropdown, Menu, message } from "antd";
import Swal from 'sweetalert2';
//   添加角色组件
import AddMenu from './AddMenu';
//   css
import styles from './index.less';

@permission

@connect(({ MenuManage, loading }) => ({
  MenuManage,
}))

export default class MenuManage extends PureComponent {
  state = {
    title: '',     //   父节点name
    parentId: '',   //  父节点id
    menuType: '',   //  菜单类型
    addAndModify: true,
    columns: [
      {
        title: "菜单名称",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "排序",
        dataIndex: "orderNum",
        key: "orderNum",
        width: "5%"
      },
      {
        title: "请求地址",
        dataIndex: "url",
        width: "10%",
        key: "url"
      },
      {
        title: "类型",
        dataIndex: "menuType",
        key: "menuType",
        render: (record) => {
          if (record && record == 'M') return <span className={classNames(styles.menuType, styles.catalog)}>目录</span>;
          if (record && record == 'C') return <span className={classNames(styles.menuType, styles.showMenu)}>菜单</span>;
          if (record && record == 'F') return <span className={classNames(styles.menuType, styles.btnbtn)}>权限</span>;
        }
      },
      {
        title: "可见",
        dataIndex: "visible",
        key: "visible",
        render: (record) => record && record == '0' ? <span className={classNames(styles.visible, styles.menuType, styles.showMenu)}>显示</span> : <span className={classNames(styles.visible, styles.menuType, styles.hideMenu)}>隐藏</span>
      },
      {
        title: "权限标识",
        dataIndex: "perms",
        key: "perms"
      },
      {
        title: "操作",
        render: (record) => {
          const { permission } = this.props;
          const action = (
            <Menu>
              {
                permission.includes('system:menu:update') ? 
                <Menu.Item onClick={() => this.modifyMenu(record.key)}>
                  <Icon type="edit" /> 编辑
                </Menu.Item> : null
              }
              {
                permission.includes('system:menu:delete') ? 
                <Menu.Item onClick={() => this.deleteMune(record.key)}>
                  <Icon type="delete" /> 删除
                </Menu.Item> : null
              }
              {
                permission.includes('system:menu:add') && record.menuType !== 'F' ? 
                <Menu.Item onClick={() => this.addSubMenu(record.key, record.title, record.menuType)}>
                  <Icon type="plus" /> 添加下级菜单
                </Menu.Item> : null
              }
            </Menu>
          )
          return (
            <Dropdown overlay={action} disabled={permission.includes('system:menu:update') || permission.includes('system:menu:delete') || permission.includes('system:menu:add') ? false : true}>
              <a className="ant-dropdown-link" href="#">
                操作<Icon type="down" />
              </a>
            </Dropdown>
          )
        }
      }
    ]
  }
  //   编辑菜单
  modifyMenu = async (menuId) => {
    this.setState({
      addAndModify: false,
      menuType: false,
    })
    const { dispatch, form } = this.props;
    const res = await dispatch({
      type: 'MenuManage/getMenuInfo',
      payload: {
        menuId,
      }
    })
    if (res && res.status === 1) {
      this.props.dispatch({
        type: 'MenuManage/modifyMenuType',
        payload: res.data.menuType,
      })
      this.addChild.changeVisible(true)
    }
  }
  //   删除菜单
  deleteMune = async (menuId) => {
    const confirmVal = await Swal.fire({
      text: '确定要删除菜单吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirmVal.value) {
      const res = await this.props.dispatch({
        type: 'MenuManage/deleteMenuManage',
        payload: {
          menuId,
        }
      })
      if (res && res.status === 1) {
        message.success(res.statusDesc)
        this.getMenuTreeList()
      } else {
        message.error(res.statusDesc)
      }
    }
  }
  //   添加下级菜单
  addSubMenu = (parentId, title) => {
    this.addChild.changeVisible(true)
    this.setState({
      parentId,
      title,
      menuType: false,
      addAndModify: true
    })
    this.props.dispatch({
      type: 'MenuManage/modifyMenuType',
      payload: 'M',
    })
  }
  addMenu = () => {
    this.addChild.changeVisible(true)
    this.setState({
      menuType: true,
      parentId: '0',
      title: '主目录',
      addAndModify: true
    })
    this.props.dispatch({
      type: 'MenuManage/modifyMenuType',
      payload: 'M',
    })
  }
  //   获取菜单管理树
  getMenuTreeList = async () => {
    const { dispatch, form } = this.props;
    await dispatch({
      type: 'MenuManage/fetchList'
    })
  }
  renderBtn = () => {
    return (
      <Fragment>
        <Button onClick={() => this.addMenu(1)}><Icon type="plus" />添加菜单</Button>
      </Fragment>
    )
  }
  expandIcon = (props) => {
    if (props.record.children) {
      if (props.expanded) {
        return (
          <Icon
            style={{ marginRight: "5px" }}
            type="caret-down"
            onClick={e => props.onExpand(props.record, e)}
          />
        );
      } else {
        return (
          <Icon
            style={{ marginRight: "5px" }}
            type="caret-right"
            onClick={e => props.onExpand(props.record, e)}
          />
        );
      }
    } else {
      return (
        <i
          style={{ marginRight: "20px" }}
          onClick={e => props.onExpand(props.record, e)}
        />
      );
    }
  }
  componentDidMount() {
    this.getMenuTreeList()
  }
  render() {
    const { title, parentId, menuType, addAndModify } = this.state;
    const { list } = this.props.MenuManage;
    const { permission } = this.props;
    return (
      <PageHeaderWrapper renderBtn={permission.includes('system:menu:add') ? this.renderBtn : null}>
        <Card bordered={false}>
          {
            permission.includes('system:menu:list') ? 
              <Table
                expandIcon={props => this.expandIcon(props)}
                onExpand={this.onExpand}
                columns={this.state.columns}
                dataSource={list}
                pagination={false}
              /> : null
            }
        </Card>
        <AddMenu 
          getChildData={(child) => this.addChild = child} 
          title={title}
          parentId={parentId}
          parentMenuType={menuType}
          addAndModify={addAndModify}
          getMenuTreeList={this.getMenuTreeList}
        />
      </PageHeaderWrapper>
    )
  }
}
