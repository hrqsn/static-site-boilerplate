const path = require('path')

const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const dirScripts = path.join(__dirname, 'src/scripts')
const dirViews = path.join(__dirname, 'src/views')
const dirStyles = path.join(__dirname, 'src/styles')

const enabledSourceMap = process.env.NODE_ENV !== 'production'

const folders = [
  ['index.html', 'home.pug'],
  ['about/index.html', 'about.pug'],
]

const mapFolders = folders.map(filename => {
  return new HtmlWebpackPlugin({
    filename: filename[0],
    template: path.join(dirViews, filename[1]),
    inject: false,
    minify: {
      collapseWhitespace: true,
      keepClosingSlash: true,
      removeComments: false,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
    }
  })
})

module.exports = {
  entry: [
    path.join(dirScripts, 'index.js'),
    path.join(dirStyles, 'main.scss')
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'scripts/[name].js',
    assetModuleFilename: 'assets/[hash][ext]'
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  plugins: [
    ...mapFolders,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/styles/loader-main.css',
          to: 'styles'
        },
        {
          from: 'src/styles/loader-sub.css',
          to: 'styles'
        },
        {
          from: 'src/scripts/vendors',
          to: 'scripts/vendors'
        },
        // {
        //   from: 'src/styles/vendors',
        //   to: 'styles/vendors'
        // },
        {
          from: 'src/assets/favicons',
          to: 'assets/favicons'
        },
        {
          from: 'src/assets/share.png',
          to: 'assets'
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ]
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: enabledSourceMap
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: enabledSourceMap,
              postcssOptions: {
                plugins: [require('autoprefixer')({ grid: true })]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: enabledSourceMap
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|svg|webp|gif|mp4|webm)$/,
        type: 'asset/resource'
      }
    ]
  }
}
