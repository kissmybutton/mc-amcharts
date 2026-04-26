const path = require("path");
const webpack = require("webpack");

module.exports = {
  context: path.resolve(__dirname),
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "./"),
    filename: "./bundle.js",
  },
  resolve: {
    extensions: [".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.m?js/,
        resolve: { fullySpecified: false },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer: {
    host: "127.0.0.1",
    port: 8095,
    historyApiFallback: false,
    hot: true,
    static: path.join(__dirname),
  },
};
