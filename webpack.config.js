const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',				// 开发环境,生产环境
  entry: "./src/main.js",												// 打包文件出口,为相对路径
  output: {
    path: path.resolve(__dirname, 'dist'),			// 拼接位绝对路径,不能使用相对路径
    filename: "bundle.js",
  },
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "2048",
      filename: "index.html",
      template: 'index.html'	// 定义模板,在webpack.config.js同目录下查找
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}