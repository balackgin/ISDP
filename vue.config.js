// http://10.1.51.64:8080/contract/detail?id=1-14OMOSX&agreementId=1-ZHQV7P&type=edit
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ipConfig = require('./ip'),
  path = require('path');
const ENV = process.env.NODE_ENV,
  isDevelopment = ENV === 'development';
module.exports = {
  // baseUrl: process.env.BASE_URL,
  publicPath: process.env.BASE_URL,
  devServer: (isDevelopment && {
    disableHostCheck: true,
    allowedHosts: [ 'www.deliver.com' ],
    proxy: {
      '/group1': {
        target: 'http://10.1.248.135/group1',
        changeOrigin: true,
        ws: false,
        secure: false,
        pathRewrite: {
          '^/group1': ''
        },
        bypass(req, res, proxyOptions) {
          // console.log(proxyOptions, 'proxyOptions');
          proxyOptions;
          if (
            req.headers.accept &&
            req.headers.accept.indexOf('html') !== -1
          ) {
            return '/index.html';
          }
        }
      },
      '/': {
        // target: 'http://10.1.248.135',
        // target: 'http://10.25.7.38:8091',
        target: ipConfig.output,
        changeOrigin: true,
        ws: false, // WebSocket
        pathRewrite: {
          // '^/customer': '/customer'
        },
        secure: false,
        bypass(req, res, proxyOptions) {
          // console.log(proxyOptions, 'proxyOptions');
          proxyOptions;
          if (
            req.headers.accept &&
            req.headers.accept.indexOf('html') !== -1
          ) {
            return '/index.html';
          }
        }
      }
    }
  }) || {
    // proxy: {
    //   '/': {
    //     target: 'http://10.1.248.135:8080',
    //     changeOrigin: true,
    //     ws: false, // WebSocket
    //     pathRewrite: {
    //       // '^/customer': '/customer'
    //     },
    //     secure: false,
    //     bypass(req, res, proxyOptions) {
    //       // console.log(proxyOptions, 'proxyOptions');
    //       proxyOptions;
    //       if (req.headers.accept.indexOf('html') !== -1) {
    //         return '/index.html';
    //       }
    //     }
    //   }
    // }
  },
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@ISDP': path.resolve(__dirname, 'src/projects/ISDP/'),
        '@outsourcer': path.resolve(__dirname, 'src/projects/outsourcer/'),
        '@management': path.resolve(__dirname, 'src/projects/management/'),
        '@sys': path.resolve(__dirname, 'src/projects/sys'),
        '@ISDPOld': path.resolve(__dirname, 'src/projects/ISDPOld'),
        '@orderVis': path.resolve(__dirname, 'src/projects/orderVis')
      }
    }
  }
  // lintOnSave: isDevelopment
  // configureWebpack: (config) => {
  //   if (!isDevelopment) {
  //     // 为生产环境修改配置...
  //     //删除console插件
  //     const plugins = [
  //       new UglifyJsPlugin({
  //         uglifyOptions: {
  //           compress: {
  //             warnings: false,
  //             drop_debugger: true,
  //             drop_console: true
  //           }
  //         }
  //       })
  //     ];
  //     config.plugins = [ ...config.plugins, ...plugins ];
  //   } else {
  //     // 为开发环境修改配置...
  //   }
  // },
  // css: {
  //   extract: true,
  //   sourceMap: false,
  //   modules: false
  // }
};