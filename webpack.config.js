var path = require('path');
var webpack = require('webpack');
//var OpenBrowserPlugin = require('open-browser-webpack-plugin');
// var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
	// entry: './src/main.js',
	entry: [
		'./lib/build.js' // Your appʼs entry point
	],
	output: {
		filename: './public/js/bundle.js'
	},
	
	//target: 'node',
	module: {
		loaders: [{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				loaders: ['react-hot', 'jsx?harmony'],
				include: path.join(__dirname, 'src'),
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'react']
				}
			}, 
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			]
	},
	plugins: [
		// new webpack.DefinePlugin({
		// 	__DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
		// }),
		new webpack.HotModuleReplacementPlugin(),
		//提取多个入口文件的公共脚本部分
		//new webpack.optimize.CommonsChunkPlugin('common.js'),
		// new HtmlwebpackPlugin({
		// 	title: 'Webpack-demos',
		// 	filename: 'index.html'
		// }),
		// new OpenBrowserPlugin({
		// 	url: 'http://localhost:8080'
		// }),

		//压缩代码会增加打包代码的时间
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	}
		// })

	],
	resolve: {
		// you can now require('file') instead of require('file.coffee')
		extensions: ['', '.js', '.json', '.jsx']
	}
};