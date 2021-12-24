const { dest, parallel, series, src, watch } = require('gulp');
const del = require('del');
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();


const env = process.env.NODE_ENV;

const copy = () => {
	return src('src/*.html')
		.pipe(dest('dest'))
		.pipe(browserSync.stream());
}

const clean = () => del('dest');

const css = () => {
	const sass = gulpSass(dartSass);
	const postcssPlugins = [];
	env === 'production' && postcssPlugins.push(cssnano({ preset: 'advanced' }));

	return src('src/scss/main.scss')
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(postcss(postcssPlugins))
		.pipe(dest('dest/css'))
		.pipe(browserSync.stream())
}

const watcher = () => {
	watch('src/scss/**/*.scss', css);
	watch('src/*.html', copy);
}

const serve = async () => {
	browserSync.init({
		server: {
			baseDir: "dest"
		}
	});
}

const build = series(clean, parallel(copy, css));

exports.build = build;
exports.default = series(build, parallel(serve, watcher));

