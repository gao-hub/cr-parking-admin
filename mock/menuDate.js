export default {
  'POST /bace-admin/menu_data': {
    data: [
      {
        url: '/system',
        title: '系统管理',
        icon: 'dashboard',
        routes: [
          {
            url: '/system/menu/list',
            title: '菜单管理',
            component: './PrivilegeManage/MenuManage'
          },
          {
            url: '/system/role/list',
            title: '角色管理',
            component: './PrivilegeManage/RoleManage'
          },
          {
            url: '/system/user/list',
            title: '用户管理',
            component: './DepartmentManage/UserManage'
          },
          {
            url: '/system/demo',
            title: '优化组件'
          }
        ]
      }
    ],
    status: 1
  }
};
