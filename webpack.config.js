import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import WebpackNotifierPlugin from 'webpack-notifier';

const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');

export default function ({isDev}) {
    return {
        entry: [
            path.resolve(SRC_PATH, 'index.js'),
            'rxjs'
        ],
        debug: isDev,
        devtool: isDev ? 'inline-source-map' : '',
        output: {
            path: BUILD_PATH,
            filename: '[name].js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: [/node_modules/],
                },
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
                },
                {
                    test: /\.(gif|jpg|jpeg|png|woff|woff2|eot|ttf|svg)(\?v=.+)?$/,
                    loader: 'url-loader?limit=20480&name=[path][name].[ext]?[sha256:hash:base64:8]'
                }
            ]
        },
        postcss: [autoprefixer],
        plugins: [
            new HtmlWebpackPlugin({
                title: 'sortVis'
            }),
            new ExtractTextPlugin(`${isDev ? '[name]' : '[name].[contenthash]'}.css`, {
                allChunks: false
            }),
            new webpack.DefinePlugin({
                __DEV__: isDev
            })
        ].concat(isDev ? [
            new WebpackNotifierPlugin({
                title: 'Webpack(sortVis)'
            })
        ] : [
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]),
        devServer: {
            inline: true
        }
    };
}


