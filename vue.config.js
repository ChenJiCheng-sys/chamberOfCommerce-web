var webpack = require('webpack');

module.exports = {
  devServer: {
	proxy: {
		'/api':{
			// target: 'http://192.168.8.122:8000',
			// target: 'http://192.168.8.148:8000',
			// target: 'http://192.168.8.147:8000',
			target: 'http://qb.eseakj.cn',
			changeOrigin: true,
			pathRewrite:{
				'/api': ''
			}
		}
	},
	port: 8000
  },
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  productionSourceMap: false,
  css: {
    extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps
    loaderOptions: {}, // css预设器配置项
	requireModuleExtension: true // 启用 CSS modules for all css / pre-processor files.
  },
 //  chainWebpack: config => {//①这里是配置的部分
	// config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
 //  }
}