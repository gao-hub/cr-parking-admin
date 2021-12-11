export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      // { path: '/user/resetPwd', component: './User/ResetPwd' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
      {
        component: '404',
      },
    ],
  },
  // 交易快照
  {
    path: '/Jiaoyikuaizhao',
    name: '交易快照',
    component: './Jiaoyikuaizhao',
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/default' },
      { path: '/testinuat', component: './Test' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/default',
            name: '首页',
            component: './Dashboard',
          },
        ],
      },
      {
        path: '/member',
        name: '会员中心',
        icon: 'dashboard',
        routes: [
          {
            path: '/member/list',
            name: '会员列表',
            component: './MemberCenter/MemberList',
          },
          {
            path: '/member/enterprise',
            name: '会员列表',
            component: './MemberCenter/EnterpriseList',
          },
          {
            path: '/member/bankcard/list',
            name: '银行卡管理',
            component: './MemberCenter/BankcardList',
          },
          {
            path: '/member/detail',
            name: '会员详情',
            component: './MemberCenter/MemberDetail',
          },
        ],
      },
      {
        path: '/memberEquity',
        name: '会员权益',
        icon: 'dashboard',
        routes: [
          {
            path: '/memberEquity/growupSet',
            name: '成长值设置',
            component: './MemberEquity/GrowupSetList',
          },
          {
            path: '/memberEquity/growupInfo',
            name: '成长值明细',
            component: './MemberEquity/GrowupInfoList',
          },
          {
            path: '/memberEquity/getEquityInfo',
            name: '权益领取明细',
            component: './MemberEquity/GetEquityInfo',
          },
          {
            path: '/memberEquity/getEquityManagement',
            name: '权益管理列表',
            component: './MemberEquity/GetEquityManagementList',
          },
          {
            path: '/memberEquity/addEquity/edit',
            name: '修改权益',
            component: './MemberEquity/GetEquityManagementList/EditEquity'
          },
        ],
      },
      {
        path: '/product',
        name: '产品中心',
        icon: 'dashboard',
        routes: [
          {
            path: '/product/building/list',
            name: '楼盘列表',
            component: './ProductCenter/BuildingList',
          },
          {
            path: '/product/building/edit/:id',
            name: '新增楼盘',
            component: './ProductCenter/BuildingList/BuildingDetail',
          },
          {
            path: '/product/parking/list',
            name: '车位列表',
            component: './ProductCenter/ParkingList',
          },
          {
            path: '/product/parking/detail/:id',
            name: '车位列表',
            component: './ProductCenter/ParkingList/Detail',
          },
          {
            path: '/product/renew/list',
            name: '续约列表',
            component: './ProductCenter/RenewList',
          },
          {
            path: '/product/rent/list',
            name: '租金列表',
            component: './ProductCenter/RentList',
          },
          {
            path: '/product/send/list',
            name: '发放记录',
            component: './ProductCenter/SendList',
          },
          {
            path: '/product/parking/audit',
            name: '出售审核',
            component: './ProductCenter/ParkingAudit',
          },
          {
            path: '/product/parking/auditDetail',
            name: '出售审核车位详情',
            component: './ProductCenter/ParkingAudit/ParkingDetail',
          },
          {
            path: '/product/parking/transfer',
            name: '转让列表',
            component: './ProductCenter/ParkingTransfer',
          },
          {
            path: '/product/due/plan',
            name: '到期计划',
            component: './ProductCenter/DuePlan',
          },
          {
            path: '/product/falsify/send',
            name: '', // 违约金发放
            component: './ProductCenter/FalsifySend',
          },
          {
            path: '/product/parking/conversion',
            name: '车位转化',
            component: './ProductCenter/ParkingConversion',
          },
          {
            path: '/product/parking/conversionInfo',
            name: '车位转化详情',
            component: './ProductCenter/ParkingConversion/Info',
          },
        ],
      },
      {
        path: '/promotion',
        name: '推广中心',
        icon: 'dashboard',
        routes: [
          {
            path: '/promotion/channel/list',
            name: '渠道管理',
            component: './PromotionCenter/ChannelList',
          },
        ],
      },
      {
        path: '/order',
        name: '订单中心',
        icon: 'dashboard',
        routes: [
          {
            path: '/order/payment/list',
            name: '支付订单',
            component: './OrderCenter/PaymentOrder',
          },
          {
            path: '/order/paymentrequest/list',
            name: '银行支付订单',
            component: './OrderCenter/PaymentRequest',
          },
          {
            path: '/order/parking/list',
            name: '车位订单',
            component: './OrderCenter/ParkingOrder',
          },
          {
            path: '/order/transfer/list',
            name: '转让订单',
            component: './OrderCenter/TransferOrder',
          },
          {
            path: '/order/list/detail',
            name: '车位详情',
            component: './OrderCenter/ParkingOrder/ParkingDetail',
          },
          {
            path: '/order/parking/list/verify/:id',
            name: '出售审核',
            component: './OrderCenter/ParkingOrder/SellVerify',
          },
          {
            path: '/order/renewal/list',
            name: '续约订单',
            component: './OrderCenter/RenewalOrder',
          },
          {
            path: '/order/recharge/list',
            name: '充值订单',
            component: './OrderCenter/RechargeOrder',
          },
        ],
      },
      {
        path: '/newcontent',
        name: '新内容中心',
        icon: 'dashboard',
        routes: [
          {
            path: '/newcontent/advsmanageconfig',
            name: '广告位配置',
            component: './NewContentCenter/Advertising/AdvertisingConfig',
          },
        ],
      },
      {
        path: '/content',
        name: '内容中心',
        icon: 'dashboard',
        routes: [
          {
            path: '/content/advsmanage',
            name: '广告管理',
            component: './ContentCenter/AdvsManage',
          },
          {
            path: '/content/news',
            name: '麦麦资讯',
            component: './ContentCenter/News',
          },
          {
            path: '/content/appversion',
            name: '版本管理',
            component: './ContentCenter/AppVersion',
          },
          {
            path: '/content/smartCommunity',
            name: '智慧社区管理',
            component: './ContentCenter/SmartCommunity',
          },
        ],
      },
      {
        path: '/buyback',
        name: '申请回购',
        icon: 'dashboard',
        routes: [
          {
            path: '/buyback/buybackorder',
            name: '申请回购',
            component: './BuyBackManage/BuyBackOrderManage',
          },
          {
            path: '/buyback/buybackorder/verify',
            name: '退货审核',
            component: './BuyBackManage/BuyBackOrderManage/BuyBackVerify',
          },
        ],
      },
      {
        path: '/funds',
        name: '资金中心',
        icon: 'dashboard',
        routes: [
          {
            path: '/funds/merchantaccount',
            name: '账户管理',
            component: './FundsManage/MerchantAccount',
          },
          {
            path: '/funds/useraccount',
            name: '用户账户管理',
            component: './FundsManage/UserAccount',
          },
          {
            path: '/funds/enterpriseaccount',
            name: '用户账户管理',
            component: './FundsManage/EnterpriseAccount',
          },
          {
            path: '/funds/splitdetail',
            name: '分账管理',
            component: './FundsManage/SplitDetail',
          },
          {
            path: '/funds/accountrecharge',
            name: '充值管理',
            component: './FundsManage/AccountRecharge',
          },
          {
            path: '/funds/accountwithdraw',
            name: '提现管理',
            component: './FundsManage/AccountWithdraw',
          },
          {
            path: '/funds/platformaccountdetail',
            name: '平台流水',
            component: './FundsManage/PlatformAccountDetail',
          },
          {
            path: '/funds/useraccountdetail',
            name: '资金明细',
            component: './FundsManage/UserAccountDetail',
          },
          {
            path: '/funds/useraccountdetailinfo',
            name: '资金明细详情',
            component: './FundsManage/UserAccountDetailInfo',
          },
        ],
      },
      {
        path: '/message',
        name: '消息中心',
        icon: 'dashborad',
        routes: [
          {
            path: '/message/syslog',
            name: '短信记录',
            component: './MessageManage/SmsLog',
          },
          {
            path: '/message/msgconfig',
            name: '短信配置',
            component: './MessageManage/MsgConfig',
          },
          {
            path: '/message/msgtemplate',
            name: '推送模板',
            component: './MessageManage/MsgTemplate',
          },
          {
            path: '/message/msglog',
            name: '推送记录',
            component: './MessageManage/MsgLog',
          },
        ],
      },
      {
        path: '/config',
        name: '配置中心',
        routes: [
          {
            path: '/config/systemconfig',
            name: '系统配置',
            component: './ConfigManage/SystemConfig',
          },
          {
            path: '/config/developersconfig',
            name: '开发商配置',
            component: './ConfigManage/DevelopersConfig',
          },
          {
            path: '/config/agentconfig',
            name: '代理商配置',
            component: './ConfigManage/AgentConfig',
          },
          {
            path: '/config/protocol',
            name: '协议模板管理',
            component: './ConfigManage/ProtocolConfig',
          },
          {
            path: '/config/protocolog',
            name: '协议模板日志',
            component: './ConfigManage/ProtocolLog',
          },
          {
            path: '/config/systemconfiglog',
            name: '系统配置操作日志',
            component: './ConfigManage/SystemConfigLog',
          },
        ],
      },
      {
        path: '/system',
        name: '系统管理',
        icon: 'dashboard',
        routes: [
          {
            path: '/system/menu/list',
            name: '菜单管理',
            component: './PrivilegeManage/MenuManage',
          },
          {
            path: '/system/role/list',
            name: '角色管理',
            component: './PrivilegeManage/RoleManage',
          },
          {
            path: '/system/user/list',
            name: '用户管理',
            component: './PrivilegeManage/UserManage',
          },
          {
            path: '/system/maintenance/list',
            name: '数据字典',
            component: './PrivilegeManage/Maintenance',
          },
          {
            path: '/system/demo',
            name: '优化',
            component: './MemberCenter/MemberList',
          },
        ],
      },
      {
        path: '/smarthome',
        name: '智慧家居',
        icon: 'dashboard',
        routes: [
          {
            path: '/smarthome/homeconfig/list',
            name: '首页配置',
            component: './Smarthome/HomeConfig',
          },
          {
            path: '/smarthome/goodscategory/list',
            name: '标签配置',
            component: './Smarthome/GoodsCategory',
          },
          {
            path: '/smarthome/products/list',
            name: '产品库',
            component: './Smarthome/Products',
          },
          {
            path: '/smarthome/products/add',
            name: '新增商品',
            component: './Smarthome/Products/comp/add/',
          },
          {
            path: '/smarthome/order/info',
            name: '订单详情',
            component: './Smarthome/orderManage/comp/orderDetail/orderDetail',
          },
          {
            path: '/smarthome/order/list',
            name: '订单管理',
            component: './Smarthome/orderManage',
          },
        ],
      },
      {
        path: '/articlemanagement',
        name: '文章管理',
        icon: 'dashboard',
        routes: [
          {
            path: '/articlemanagement/info',
            name: '文章详情',
            component: './Articlemanagement/comp',
          },
          {
            path: '/articlemanagement/list',
            name: '文章管理',
            component: './Articlemanagement',
          },
        ],
      },
      {
        path: '/wisdomTrip',
        name: '智慧旅途',
        icon: 'dashboard',
        routes: [
          {
            path: '/wisdomTrip/account/list',
            name: '账户管理',
            component: './WisdomTripManage/AccountList',
          },
          {
            path: '/wisdomTrip/product/list',
            name: '旅途产品管理',
            component: './WisdomTripManage/ProductList',
          },
          {
            path: '/wisdomTrip/order/list',
            name: '订单管理',
            component: './WisdomTripManage/orderManage',
          },
          {
            path: '/wisdomTrip/homepage/config',
            name: '首页配置',
            component: './WisdomTripManage/HomePageConfig',
          },
        ],
      },
      {
        path: '/activity',
        name: '活动中心',
        icon: 'dashboard',
        routes: [
          {
            path: '/activity/lottery',
            name: '抽奖活动',
            icon: 'dashboard',
            routes: [
              {
                path: '/activity/lottery/activityManagement',
                name: '抽奖活动管理',
                component: './ActivityCenter/Lottery/ActivityManagement',
              },
              {
                path: '/activity/lottery/activityEdit/:id',
                name: '新增抽奖活动',
                component: './ActivityCenter/Lottery/ActivityManagement/ActivityDetail',
              },
              {
                path: '/activity/lottery/lotterySetting/:id',
                name: '奖品设置',
                component: './ActivityCenter/Lottery/LotterySetting',
              },
              {
                path: '/activity/lottery/lotteryDetails',
                name: '抽奖机会明细',
                component: './ActivityCenter/Lottery/LotteryDetails',
              },
              {
                path: '/activity/lottery/winningRecord',
                name: '中奖记录',
                component: './ActivityCenter/Lottery/WinningRecord',
              },
            ],
          },
          {
            path: '/activity/lotteryBlacklist',
            name: '抽奖黑名单',
            component: './ActivityCenter/LotteryBlacklist',
          },
          {
            path: '/activity/exchange',
            name: '累计兑换活动',
            icon: 'dashboard',
            routes: [
              {
                path: '/activity/exchange/activityManagement',
                name: '活动管理',
                component: './ActivityCenter/Exchanges/ActivityManagement',
              },
              {
                path: '/activity/exchange/activityInfo/:id',
                name: '新增兑换活动',
                component: './ActivityCenter/Exchanges/ActivityInfo',
              },
              {
                path: '/activity/exchange/setPrize/:id',
                name: '奖品设置',
                component: './ActivityCenter/Exchanges/SetPrize',
              },
              {
                path: '/activity/exchange/amountDetail',
                name: '兑换额度明细',
                component: './ActivityCenter/Exchanges/AmountDetail',
              },
              {
                path: '/activity/exchange/record',
                name: '兑奖记录',
                component: './ActivityCenter/Exchanges/Record',
              },
            ],
          },
          {
            path: '/activity/unifiedLottery',
            name: '统一开奖',
            icon: 'dashboard',
            routes: [
              {
                path: '/activity/unifiedLottery/activityManagement',
                name: '活动管理',
                component: './ActivityCenter/UnifiedLottery/ActivityManagement',
              },
              {
                path: '/activity/unifiedLottery/activityInfo/:id',
                name: '新增活动',
                component: './ActivityCenter/UnifiedLottery/ActivityInfo',
              },
              {
                path: '/activity/unifiedLottery/setPrize/:id',
                name: '奖品设置',
                component: './ActivityCenter/UnifiedLottery/SetPrize',
              },
              {
                path: '/activity/unifiedLottery/activityUserDetails/:id',
                name: '活动用户明细',
                component: './ActivityCenter/UnifiedLottery/ActivityUserDetails',
              },
              {
                path: '/activity/unifiedLottery/record',
                name: '中奖记录',
                component: './ActivityCenter/UnifiedLottery/Record',
              },
              {
                path: '/activity/unifiedLottery/detailsOfTheLuckyDrawOpportunity',
                name: '抽奖机会明细',
                component: './ActivityCenter/UnifiedLottery/DetailsOfTheLuckyDrawOpportunity',
              },
            ],
          },
          {
            path:'/activity/redEnvelopes',
            name: '红包活动',
            icon: 'dashboard',
            routes: [
              {
                path: '/activity/redEnvelopes/activityManagement',
                name: '红包活动',
                component: './ActivityCenter/RedEnvelopes/ActivityManagement',
              },
              {
                path: '/activity/redEnvelopes/redSetting/:id',
                name: '新增红包活动',
                component: './ActivityCenter/RedEnvelopes/RedSetting',
              },
              {
                path: '/activity/redEnvelopes/prize/:id/:isStart',
                name: '奖品设置',
                component: './ActivityCenter/RedEnvelopes/Prize',
              },
              {
                path: '/activity/redEnvelopes/record',
                name: '中奖记录',
                component: './ActivityCenter/RedEnvelopes/WinningRecord',
              }
            ]
          
          }
        ],
      },
      {
        path: '/newsContent',
        name: '新内容中心',
        icon: 'dashboard',
        routes: [
          {
            path: '/newsContent/userPublish',
            name: '用户发布',
            icon: 'dashboard',
            routes: [
              {
                path: '/newsContent/userPublish/publishList',
                name: '用户发布列表',
                component: './NewsContent/UserPublish/PublishList',
              },
              {
                path: '/newsContent/userPublish/publishDetails/:id/:type/:preview',
                name: '发布信息详情',
                component: './NewsContent/UserPublish/PublishDetails',
              },
            ],
          },
          {
            path: '/newsContent/officialPublish',
            name: '官方发布',
            icon: 'dashboard',
            routes: [
              {
                path: '/newsContent/officialPublish/publishList',
                name: '官方发布列表',
                component: './NewsContent/OfficialPublish/PublishList',
              },
              {
                path: '/newsContent/officialPublish/publishDetails/:id/:preview',
                name: '发布信息详情',
                component: './NewsContent/OfficialPublish/PublishDetails',
              },
            ],
          },
          {
            path: '/newsContent/accountManagement',
            name: '账号管理',
            icon: 'dashboard',
            routes: [
              {
                path: '/newsContent/accountManagement/blacklist',
                name: '黑名单管理',
                component: './NewsContent/AccountManagement/Blacklist',
              },
              {
                path: '/newsContent/accountManagement/accountList',
                name: '账号管理',
                component: './NewsContent/AccountManagement/AccountList',
              },
            ],
          },
          {
            path: '/newsContent/companySituation',
            name: '公司动态',
            component: './NewsContent/CompanySituation',
          },
          {
            path: '/newsContent/messageCenter',
            name: '消息中心',
            icon: 'dashboard',
            routes: [
              {
                path: '/newsContent/messageCenter/notifyPush',
                name: '消息推送',
                component: './NewsContent/MessageCenter/NotifyPush',
              },
              {
                path: '/newsContent/messageCenter/activityMessage',
                name: '活动消息',
                component: './NewsContent/MessageCenter/ActivityMessage',
              },
              {
                path: '/newsContent/messageCenter/notice',
                name: '公告',
                component: './NewsContent/MessageCenter/NoticeMessage',
              },
            ],
          },
          {
            path: '/newsContent/helperCenter',
            name: '帮助中心',
            component: './NewsContent/HelperCenter',
          },
          {
            path: '/newsContent/advsManagement',
            name: '广告位管理',
            icon: 'dashboard',
            routes: [
              {
                path: '/newsContent/advsManagement/advsConfig',
                name: '广告位配置',
                component: './NewsContent/AdvsManagement/AdvsConfig',
              },
              {
                path: '/newsContent/advsManagement/iconConfig',
                name: 'icon配置',
                component: './NewsContent/AdvsManagement/IconConfig',
              },
              {
                path: '/newsContent/advsManagement/searchConfig',
                name: '搜索配置',
                component: './NewsContent/AdvsManagement/SearchConfig',
              },
            ],
          },
        ],
      },
      // 秒杀活动
      {
        path: '/spikeActivity',
        name: '秒杀活动',
        icon: 'dashboard',
        routes: [
          {
            path: '/spikeActivity/activityManage',
            name: '活动管理',
            component: './SpikeActivity/ActivityManage',
          },
          {
            path: '/spikeActivity/commodityManage',
            name: '商品管理',
            component: './SpikeActivity/ActivityManage/CommodityManage',
          },
        ],
      },
      {
        path: '/integralMall',
        name: '积分商城',
        icon: 'dashboard',
        routes: [{
          path: '/integralMall/goodsManage/list',
          name: '商品管理',
          component: './IntegralMall/GoodsManage'
        },{
          path: '/integralMall/goodsManage/save',
          name: '保存商品',
          component: './IntegralMall/GoodsManage/EditGoods'
        },{
          path: '/integralMall/Exchange/list',
          name: '积分兑换订单',
          component: './IntegralMall/ExchangeOrders'
        },{
          path: '/integralMall/IntegralDetail/list',
          name: '积分明细',
          component: './IntegralMall/IntegralDetail'
        },{
          path: '/integralMall/setting/page',
          name: '积分设置',
          component: './IntegralMall/IntegralSetting'
        },{
          path: '/integralMall/blacklist/list',
          name: '黑名单',
          component: './IntegralMall/BlackList'
        }]
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
