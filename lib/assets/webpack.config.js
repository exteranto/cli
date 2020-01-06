const { basePath } = require('../modules/helpers')
const DefinePlugin = require('webpack').DefinePlugin
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin
const FriendlyErrors = require('friendly-errors-webpack-plugin')

module.exports = ($env) => ({
  mode: 'production',
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  plugins: [
    new VueLoaderPlugin,
    new FriendlyErrors,
    new DefinePlugin({ $env }),
  ],
  optimization: {
    minimize: false
  },
  entry: {
    content: './src/app/content/main.ts',
    background: './src/app/background/main.ts'
  },
  output: {
    path: basePath('dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      '@': basePath('src'),
      'vue$': 'vue/dist/vue.runtime.esm.js',
      'config': basePath('config')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [basePath('src')]
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                indentedSyntax: true
              }
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [basePath('src'), basePath('config')],
        options: { appendTsSuffixTo: [/\.vue$/] }
      }
    ]
  }
})
