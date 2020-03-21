const CompressionPlugin = require('compression-webpack-plugin') // gzip 压缩的插件
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 要进行压缩的文件类型
const path = require('path')
// 拼接绝对路径函数resolve
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false, // 不会生成js中的map文件
  // publicPath: './',
  lintOnSave: false, // 关闭ESlint
  devServer: { // 配置代理服务器
    proxy: {
      '/gdou': { // 接口暗号
        target: 'http://ustbhuangyi.com',
        changeOrigin: true,
        pathRewrite: {
          '^/gdou': ''
        }
      },
      '/laofang': { // 老方的接口暗号
        target: 'http://47.95.207.1:3000/',
        changeOrigin: true,
        pathRewrite: {
          '^/laofang': ''
        }
      }
    }
  },
  // 配置别名
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src')) // src的绝对路径起一个别名叫@
      .set('api', resolve('./src/api')) // api的绝对路径起一个别名叫api
      .set('style', resolve('./src/style'))
      .set('components', resolve('./src/components'))

    // 配置分析工具
    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end();
      }
    } else {}
  },
  // 配置gzip
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(new CompressionPlugin({
        algorithm: 'gzip',
        test: productionGzipExtensions,
        threshold: 10240,
        minRatio: 0.8
      }))
    }
  }
}
