const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const TerserPlugin = require("terser-webpack-plugin")
// const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isEnvProduction = process.env.NODE_ENV === 'production'
const isEnvDevelopment = process.env.NODE_ENV === 'development'
const isEnvStagging = process.env.NODE_ENV === 'stagging'

module.exports = {
  mode: isEnvDevelopment ? 'development' : 'production',
  entry: "./src/index.tsx",
  devtool: isEnvProduction ? false :'inline-cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
    filename: "sources/[name].[contenthash].js",
    assetModuleFilename: "sources/[contenthash][ext]",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader', 'source-map-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.obj$/,
        use: ['file-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isEnvDevelopment ? '[path][name]__[local]' : '[hash:base64:5]',
              },
            },
          },

        ],
      },
    ],
  },
  optimization: {
    minimize: !isEnvDevelopment,
    // minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'initial',
          enforce: true
        },
      },
    },
    concatenateModules: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/template.html'),
      // favicon: path.resolve(__dirname, 'apps/Shared/public/favicon.ico'),
    }),
    new MiniCssExtractPlugin({
      filename: 'sources/[name].css',
    }),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.svg', '.tsx', '.ts', '.js'],
    fallback: {
      "fs": false,
      "path": false,
    },
    alias: {
      "src": path.resolve(__dirname, 'src'),
      "constants": path.resolve(__dirname, 'src/constants'),
      "components": path.resolve(__dirname, 'src/components'),
      "utils": path.resolve(__dirname, 'src/utils'),
      "types": path.resolve(__dirname, 'src/types'),
      "hooks": path.resolve(__dirname, 'src/hooks'),
      "assets": path.resolve(__dirname, 'src/assets'),
      "styles": path.resolve(__dirname, 'src/styles'),
      "secrets": path.resolve(__dirname, 'src/secrets'),
    },
  },
  devServer: {
    client: {
      overlay: {
        warnings: false,
      }
    },
    static: {
      directory: path.join(__dirname, 'dist'),
      serveIndex: true,
    },
    hot: false,
    liveReload: false,
    historyApiFallback: true,
    compress: true,
    port: 3000,
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },
}
