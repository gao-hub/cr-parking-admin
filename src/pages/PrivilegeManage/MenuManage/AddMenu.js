import React, {PureComponent} from 'react';
import { Modal, Form, Input, message, TreeSelect, Select, Radio, Popover, Button, Icon } from 'antd';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import iconsData from './icons';
import styles from './index.less'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@Form.create()

@connect(({ MenuManage, loading }) => ({
  MenuManage,
}))

export default class AddMenu extends PureComponent {
  constructor(props) {
    super(props)
    const value = props.value || '';                    
    this.state = {
      visible: false,
      value,
    }
  }
  changeVisible = (flag) => {
    this.setState({
      visible: !!flag,
    })
  }
  handleOk = async () => {
    const { dispatch, form, addAndModify, MenuManage: { modifyMenuId } } = this.props;
    form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        let res;
        if (addAndModify) {
          res = await dispatch({
            type: 'MenuManage/addMenuManage',
            payload: values
          })
        } else {
          res = await dispatch({
            type: 'MenuManage/upDateMenuManage',
            payload: {
              ...values,
              menuId: modifyMenuId
            }
          })
        }
        if (res && res.status === 1) {
          this.changeVisible(false)
          message.success(res.statusDesc)
          this.props.getMenuTreeList()
        } else message.error(res.statusDesc)
      }
    });
    
  }
  componentDidMount() {
    this.props.getChildData(this)
    // this.focusEditor();
  }
  //   点击icon获取iconName
  handleChangeAction = value => {
    this.setState({ value });
    this.props.form.setFieldsValue({ icon: value })
  }
  //   更改菜单类型
  onChangeMenuType = (e) => {
    this.props.dispatch({
      type: 'MenuManage/modifyMenuType',
      payload: e.target.value,
    })
  }
  //   自定义弹出小icon库
  renderContent = ()=>{
    const { getFieldDecorator } = this.props.form;
    const { title, parentId, parentMenuType, addAndModify } = this.props;
    const { menuInfo, menuType } = this.props.MenuManage;
    const formConfig = {
      labelCol:  { span: 5 },
      wrapperCol: { span: 18 }
    }
    const { value } = this.state;

    const icon_box = (
      <div className={styles.icon_inner}>
        <div className={styles.icon_list}>
          {iconsData.map(icon => (
            <Button style={{ margin: '8px 0 0 8px' }} key={icon} type={value === icon ? 'primary' : 'default'} onClick={() => this.handleChangeAction(icon)}>
              <IconFont type={icon} />
            </Button>
          ))}
        </div>
      </div>
    );
    return(
      <Form>
          <FormItem
            label="上级id"
            style={{ display: 'none' }}
            {...formConfig}
          >
            {getFieldDecorator('parentId', {
              initialValue: addAndModify ? parentId : (menuInfo.parentId && menuInfo.parentId)
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem
            label="上级菜单"
            {...formConfig}
          >
            <Input value={addAndModify ? title : (menuInfo.parentName ? menuInfo.parentName : '主目录')} disabled />
          </FormItem>
          <FormItem
            label="类型"
            {...formConfig}
          >
            {getFieldDecorator('menuType', {
              initialValue: !addAndModify ? (menuInfo.menuType && menuInfo.menuType) : menuType
            })(
              <RadioGroup onChange={this.onChangeMenuType}  disabled={!addAndModify ? true : false}>
                <Radio value="M">目录</Radio>
                <Radio disabled={parentMenuType} value="C">菜单</Radio>
                <Radio disabled={parentMenuType} value="F">权限</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            label={`${menuType === "F" ? "权限" : "菜单"}名称`}
            {...formConfig}
          >
            {getFieldDecorator('menuName', {
              initialValue: !addAndModify ? (menuInfo.menuName && menuInfo.menuName) : ''
            })(
              <Input />
            )}
          </FormItem>
          {
            menuType && menuType === 'C' && <FormItem
              label="路由地址"
              {...formConfig}
            >
              {getFieldDecorator('url', {
                initialValue: !addAndModify ? (menuInfo.url && menuInfo.url) : ''
              })(
                <Input />
              )}
            </FormItem>
          }
          {
            menuType && (menuType === 'C' || menuType === 'F') && <FormItem
              label="权限标识"
              {...formConfig}
            >
              {getFieldDecorator('perms', {
                initialValue: !addAndModify ? (menuInfo.perms && menuInfo.perms) : ''
              })(
                <Input />
              )}
            </FormItem>
          }
          <FormItem
            label="显示排序"
            {...formConfig}
          >
            {getFieldDecorator('orderNum', {
              initialValue: !addAndModify ? (menuInfo.orderNum && menuInfo.orderNum) : ''
            })(
              <Input />
            )}
          </FormItem>
          { 
            menuType && menuType === 'M' && <FormItem
              label="图标"
              {...formConfig}
            >
              <Popover
                content={icon_box}
              >
                {getFieldDecorator('icon', {
                  initialValue: addAndModify ? value : (menuInfo.icon && menuInfo.icon)
                })(
                  <Input type="primary"
                    placeholder='请选择图标'
                    onChange={this.handleChangeAction}
                  />
                )}
              </Popover> 
            </FormItem>
          }
          <FormItem
            label={`${menuType === "F" ? "权限" : "菜单"}状态`}
            {...formConfig}
          >
            {getFieldDecorator('visible', {
              initialValue: !addAndModify ? (menuInfo.visible && menuInfo.visible) : '0'
            })(
              <RadioGroup>
                <Radio value='0'>显示</Radio>
                <Radio value='1'>隐藏</Radio>
              </RadioGroup>
            )}
          </FormItem>
      </Form>
    )
  }

  render() {
    const { addAndModify } = this.props;
    return (
      <Modal
        title= {addAndModify ? '添加菜单' : '编辑菜单'}
        visible={this.state.visible}
        onOk={this.handleOk}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => this.changeVisible(false)}
      >
        { this.renderContent() }
      </Modal>
    )
  }
}