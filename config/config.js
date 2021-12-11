// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      targets: {
        ie: 11,
      },
      locale: {
        enable: true, // default false
        default: 'zh-TW', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      headScripts: [
        'https://cdn.bootcdn.net/ajax/libs/jquery/2.1.4/jquery.min.js',
        'https://static.lianlianpay.com/wallet/PasswordControl/Js/PassGuardCtrl.js',
        'https://static.lianlianpay.com/wallet/PasswordControl/Js/crypto-js.js',
        'https://static.lianlianpay.com/wallet/PasswordControl/Js/thickbox.js',
      ],
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
      },
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: true,
          }
        : {}),
    },
  ],
];

// judge add ga
if (process.env.APP_TYPE === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  // add for transfer to umi
  plugins,
  targets: {
    ie: 11,
  },
  hash: true,
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  // proxy: {
  //   // '/nuocheng-admin': {
  //   //   target: 'http://10.10.3.60:8071', // 倪晓玲
  //   //   changeOrigin: true,
  //   //   // pathRewrite: { '^/nuocheng-admin': '/nuocheng-admin' },
  //   // },
  //   '/content':{
  //     target: 'http://10.10.3.60:8071', // 倪晓玲
  //     changeOrigin: true,
  //     pathRewrite: { '^/content': '' }
  //   }
  // },
  // 代理配置表，在这里可以配置特定的请求代理到对应的API接口
  proxy: {
    '/cr-admin': {
      // target: 'http://10.10.2.85:8071', // 王通
      // target: 'http://10.10.2.67:8071', // 孙帅帅
      // target: 'http://10.10.2.59:8071', // 高大超
      // target: 'http://10.10.3.74:8071', // 李彬
      // target: 'http://39.98.147.151:8071', // 测试环境
      // target: 'http://10.10.3.74:8071', // 李彬
      // target: 'http://10.10.3.85:8071', // 季君君
      // target: 'http://10.10.2.70:8071', // 崔广强
      // target: 'http://10.10.2.65:8071', // 董泽衫
      // target: 'http://10.10.2.66:8071', // 查道建
      // target: 'http://10.10.2.72:8071', // 张晴晴
      // target: 'http://10.10.3.3:8071',
      // target:'http://10.10.2.62:8071',
      // target: 'https://testadmin1.ncbxdl.com/', // 环境1
      // target: 'http://ncadmin.sit.ncbxdl.com/', // 环境2
      // target: 'http://10.10.2.71:8071' ,// 温馨
      // target: 'http://10.10.2.59:8071',// 高大超
      // target: 'http://10.10.2.62:8071',// 张志成
      target: 'https://devadmin.maimaichewei.com/',
      // target: 'https://testadmin.maimaichewei.com/',
      // target: 'https://mmadmin.maimaichewei.com/',
      changeOrigin: true,
      pathRewrite: { '^/cr-admin': '/cr-admin' },
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  chainWebpack: webpackPlugin,
};
