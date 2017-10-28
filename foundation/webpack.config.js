import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HappyPack from 'happypack';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

import config from './config';


const configuration = {
  bail: ! config.debug,
  cache: ! config.debug,
  devtool: config.debug ? 'cheap-eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                discardComments: { removeAll: true },
                importLoaders: 1,
                localIdentName: '[local]',
                minimize: ! config.debug,
                modules: true,
                sourceMap: config.debug,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: path.resolve(__dirname, 'postcss.config.js'),
                },
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        }),
      },
      {
        test: /\.(png|jpg)$/,
        use: 'url-loader?limit=8192',
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      ...config.debug ?
        [] :
        [
          {
            test: path.resolve(__dirname, '../node_modules/react-deep-force-update/lib/index.js'),
            loader: 'null-loader',
          },
        ],
    ],
  },
  plugins: [
    new ExtractTextPlugin({ filename: '[name].css', allChunks: true }),
    new HappyPack({
      loaders: [
        {
          loader: 'babel-loader',
          query: {
            presets: ['env', 'react'],
            plugins: [
              'dynamic-import-webpack',
              'transform-class-properties',
              'transform-object-rest-spread',
              'transform-runtime',
            ],
          },
        },
      ],
      verbose: false,
    }),
    new StatsWriterPlugin({ fields: ['chunks', 'publicPath'] }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules'],
  },
  stats: {
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    colors: true,
    hash: false,
    modules: false,
    reasons: true,
    timings: false,
    version: false,
  },
};

const client = {
  ...configuration,
  entry: {
    client: [
      'babel-polyfill', 'whatwg-fetch', path.resolve(__dirname, './core/client/index'),
      ...config.debug ? [
        'react-error-overlay',
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?nane=client&reload=true',
      ] : [],
    ],
  },
  name: 'client',
  node: {
    fs: 'empty',
  },
  output: {
    chunkFilename: config.debug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
    filename: config.debug ? '[name].js' : '[name].[chunkhash:8].chunk.js',
    path: path.resolve(process.cwd(), 'public/build'),
    publicPath: '/build/',
  },
  plugins: [
    ...configuration.plugins,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': config.debug ? '"development"' : '"production"',
      'process.env.BROWSER': true,
      __DEV__: config.debug,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.resource),
    }),
    ...config.debug ?
      [
        // eslint-disable-next-line global-require
        new (require('webpack-error-notification'))('darwin'),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
      ] : [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
            screw_ie8: true,
            warnings: true,
            unused: true,
            dead_code: true,
          },
          mangle: {
            screw_ie8: true,
          },
          output: {
            comments: false,
            screw_ie8: true,
          },
        }),
      ],
  ],
  resolve: {
    ...configuration.resolve,
    modules: [...configuration.resolve.modules, process.cwd()],
  },
  target: 'web',

};

const server = {
  ...configuration,
  entry: {
    server: ['babel-polyfill', path.resolve(__dirname, './core/server/index.js')],
  },
  externals: [
    nodeExternals({ whitelist: [/\.(scss|css)$/, /\.(png|jpg)$/] }),
  ],
  name: 'server',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  output: {
    path: path.resolve(process.cwd(), 'build/server'),
    filename: '[name].js',
    chunkFilename: 'chunks/[name].js',
    libraryTarget: 'commonjs2',
    ...config.debug ? {
      hotUpdateMainFilename: 'updates/[hash].hot-update.json',
      hotUpdateChunkFilename: 'updates/[id].[hash].hot-update.js',

    } : {},
  },
  plugins: [
    ...configuration.plugins,
    ...config.debug ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin(),
    ] : [],
  ],
  resolve: {
    ...configuration.resolve,
    modules: [...configuration.resolve.modules, './'],
  },
  target: 'node',
};


export default { client, server };
