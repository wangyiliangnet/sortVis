import fs from 'fs';
import yargs from 'yargs';
import webpack from 'webpack';
import gulp from 'gulp';
import path from 'path';
import gutil from 'gulp-util';
import del from 'del';
import webpackConfig from './webpack.config.js';
import runSequence from 'run-sequence';
import WebpackDevServer from 'webpack-dev-server';

const argv = yargs.alias('wp', 'webpack-server-port').argv;

const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');
const WEBPACK_SERVER_PORT = argv.wp || 3000;
const WEBPACK_DEV_FILES = [
    `webpack-dev-server/client?http://localhost:${WEBPACK_SERVER_PORT}/`
];

gulp.task('clean', (done) => {
    del.sync([BUILD_PATH], {force: true});
    done();
});

gulp.task('webpack', (done) => {
    webpack(webpackConfig({
        isDev: false
    }), (err, stats) => {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }

        gutil.log("[webpack]", stats.toString({
          colors: true
        }));
        done();
    });
});

gulp.task('build', (done) => {
    runSequence('clean', 'webpack');
});

gulp.task('dev', (done) => {
    const config = webpackConfig({
        isDev: true
    });

    config.entry = WEBPACK_DEV_FILES.concat(config.entry);

    const compiler = webpack(config);

    const server = new WebpackDevServer(compiler, {
        contentBase: `http://localhost:${WEBPACK_SERVER_PORT}`
    });

    server.listen(WEBPACK_SERVER_PORT, '0.0.0.0', () => gutil.log('[webpack]', 'webpack-dev-server started.'));
});

