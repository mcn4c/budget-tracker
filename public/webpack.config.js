const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
	entry: {
		app: './index.js'
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].bundle.js'
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env' ]
					}
				}
			}
		]
	},
	plugins: [
		new WebpackPwaManifest({
			fingerprints: false,
			name: 'Budget Tracker',
			short_name: 'Budget Tracker',
			description: 'Helps you keep track of your spending even while traveling',
			background_color: '#01579b',
			theme_color: '#ffffff',
			'theme-color': '#ffffff',
			start_url: '/',
			icons: [
				{
					src: path.resolve('icons/icon-192x192.png'),
					size: '192x192' // you can also use the specifications pattern
				},
				{
					src: path.resolve('icons/icon-512x512.png'),
					size: '512x512'
				}
			]
		})
	]
};

module.exports = config;
