/* eslint-disable */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => ({
  entry: "./client/src/main.js",
  output: {
    filename: env.prod ? "app.[contenthash].js" : "app.js",
    publicPath: "/",
    clean: true,
  },
  devtool: env.prod ? "eval" : "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /.s?css$/,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|avif|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "img/[contenthash][ext]",
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset",
        generator: {
          filename: "fonts/[contenthash][ext]",
        },
      },
    ],
  },
  devServer: {
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Coin.",
      template: "./client/src/index.html", // шаблон
      filename: "index.html",
      favicon: "./client/src/assets/img/favicon.svg", // название выходного файла
      minify: {
        collapseWhitespace: env.prod ? true : false,
      },
    }),
    new MiniCssExtractPlugin({
      filename: env.prod ? "main.[contenthash].css" : "main.css",
      linkType: "text/css",
    }),
  ],
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              [
                "gifsicle",
                {
                  interlaced: true,
                },
              ],
              [
                "jpegtran",
                {
                  progressive: true,
                },
              ],
              [
                "optipng",
                {
                  optimizationLevel: 5,
                },
              ],
            ],
          },
        },
      }),
    ],
  },
});
