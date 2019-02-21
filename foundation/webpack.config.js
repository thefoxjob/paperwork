import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import WebpackBar from 'webpackbar';
import chalk from 'chalk';
import config from 'config';
import fs from 'fs';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { StatsWriterPlugin } from 'webpack-stats-plugin';


const ROOT_DIR = path.resolve(__dirname, '../');
const BUILD_DIR = path.resolve(ROOT_DIR, './build');
const analyze = process.argv.includes('--analyze');
const debug = config.get('debug', false) === true;


const configuration = {
  bail: ! debug,
  cache: debug,
  context: ROOT_DIR,
  devtool: debug ? 'inline-source-map' : 'source-map',
  mode: debug ? 'development' : 'production',
  module: {
    rules: [
      {
        exclude: {
          test: /node_modules/,
        },
        test: /\.(js|jsx)?$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 4,
            },
          },
          'babel-loader',
        ],
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
    ],
  },
  plugins: [
    ...analyze ? [
      new BundleAnalyzerPlugin({ analyzerMode: 'static', defaultSizes: 'gzip', logLevel: 'silent' }),
    ] : [],
  ],
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
      '@babel/polyfill', 'whatwg-fetch', path.resolve(ROOT_DIR, './foundation/core/client/index'),
      ...config.get('debug') ? [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?name=client&reload=true&quiet=true',
      ] : [],
    ],
  },
  module: {
    ...configuration.module,
    rules: [
      ...configuration.module.rules,
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: false,
              sourceMap: debug,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: __dirname,
              },
            },
          },
          {
            loader: 'sass-loader',
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(ROOT_DIR, './src/stylesheets/variables.scss'),
            },
          },
        ],
      },
      {
        test: /\.(png|jpg)$/,
        use: 'url-loader?limit=8192',
      },
    ],
  },
  name: 'client',
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  output: {
    chunkFilename: config.debug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
    filename: config.debug ? '[name].js' : '[name].[chunkhash:8].chunk.js',
    path: path.resolve(config.get('application.public'), './build'),
    publicPath: '/build/',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          // eslint-disable-next-line no-useless-escape
          test: /[\\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
  },
  plugins: [
    ...configuration.plugins,
    new WebpackBar({ name: 'client' }),
    new StatsWriterPlugin({ fields: ['chunks', 'publicPath'] }),
    new MiniCssExtractPlugin({
      chunkFilename: debug ? '[name].[id].css' : '[name].[id].[hash].css',
      filename: debug ? '[name].css' : '[name].[hash].css',
    }),
    new WebpackAssetsManifest({
      customize: ({ key, value }) => {
        if (key.toLowerCase().endsWith('.map')) {
          return false;
        }

        return { key, value };
      },
      done: (manifest, stats) => {
        const filename = path.resolve(config.get('application.public'), './build/chunk-manifest.json');

        try {
          const chunks = stats.compilation.chunkGroups.reduce((accumulator, current) => {
            if (current.name) {
              accumulator[current.name] = [
                ...(accumulator[current.name] || []),
                ...current.chunks.reduce((files, chunk) => [
                  ...files,
                  ...chunk.files.filter(file => ! file.endsWith('.map')).map(file => manifest.getPublicPath(file)),
                ], []),
              ];
            }

            return accumulator;
          }, Object.create(null));

          fs.writeFileSync(filename, JSON.stringify(chunks, null, 2));
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(chalk.red(`ERROR: Cannot write ${ filename }: `, error));

          if (! debug) {
            process.exit(1);
          }
        }
      },
      output: path.resolve(config.get('application.public'), './build/assets-manifest.json'),
      publicPath: true,
      writeToDisk: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': config.debug ? '"development"' : '"production"',
      'process.env.BROWSER': true,
      __DEV__: config.debug,
    }),
    ...debug ? [
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
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules'],
  },
  target: 'web',
};

const server = {
  ...configuration,
  entry: {
    server: [
      '@babel/polyfill',
      path.resolve(__dirname, './core/server/index.js'),
    ],
  },
  externals: [
    nodeExternals({ whitelist: [/\.(scss|css)$/, /\.(png|jpg)$/] }),
  ],
  name: 'server',
  node: {
    Buffer: false,
    console: false,
    global: false,
    process: false,
    __dirname: false,
    __filename: false,
  },
  output: {
    chunkFilename: 'chunks/[name].js',
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.resolve(BUILD_DIR, './server'),
    ...debug ? {
      hotUpdateMainFilename: 'updates/[hash].hot-update.json',
      hotUpdateChunkFilename: 'updates/[id].[hash].hot-update.js',
    } : {},
  },
  plugins: [
    ...configuration.plugins,
    new WebpackBar({ name: 'server' }),
    ...debug ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin(),
    ] : [],
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules', ROOT_DIR],
  },
  target: 'node',
};

module.exports = { client, server };
