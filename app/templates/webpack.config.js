const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const NODE_ENV = process.env.NODE_ENV
const APP_ENV = process.env.APP_ENV
const isBuild = NODE_ENV === 'production'
const isUglify = isBuild && APP_ENV !== 'dev'
const dist = path.resolve(__dirname, `./${ !isBuild ? 'dist' : /dev|test/.test(APP_ENV) ? `temp/${APP_ENV}` : 'dist' }`)

var plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "./public/index.html"),
    filename: path.join(dist, './index.html')
  }),
  new MiniCssExtractPlugin({
    filename: isBuild ? 'static/[name].[contenthash:8].css' : 'static/[name].css'
  }),
  new webpack.DefinePlugin({
    'process.env.APP_ENV': JSON.stringify(APP_ENV)
  })
]

if (isUglify) {
  plugins = plugins.concat([
    new OptimizeCSSAssetsPlugin({})
  ])
}

module.exports = {
  mode: isUglify ? 'production' : 'development',
  entry: {
    app: './src/main.js'
  },
  output: {
    path: dist,
    filename: isBuild ? 'static/[name].[contenthash:8].js' : 'static/[name].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          fallback: 'file-loader',
          name: isBuild ? 'static/img/[hash:8].[ext]' : 'static/img/[name].[ext]'
        }
      }
    ]
  },
  optimization: isBuild ? {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        }
      }
    }
  } : undefined,
  plugins: plugins
}
