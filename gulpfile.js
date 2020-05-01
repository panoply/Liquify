const { src, dest, watch, series, parallel, lastRun } = require('gulp') // eslint-disable-line
const pipeline = require('stream').pipeline
const sass = require('gulp-sass')
const changed = require('gulp-changed')
const imagemin = require('gulp-imagemin')
const flatten = require(' gulp-flatten')
const gulpif = require('gulp-if')
const gulpfn = require('gulp-fn')
const cssnano = require('gulp-cssnano')
const svgmin = require('gulp-svgmin')
const svgsprite = require('gulp-svg-sprite')
const spawn = require('cross-spawn')
const del = require('del')
const minimist = require('minimist')
const bs = require('browser-sync').create()
const { rollup } = require('rollup')
const includePaths = require('rollup-plugin-includepaths')
const buble = require('rollup-plugin-buble')
const babel = require('rollup-plugin-babel')
const iife = require('rollup-plugin-iife')
const replace = require('rollup-plugin-replace')
const noderesolve = require('rollup-plugin-node-resolve')
const depinject = require('rollup-plugin-dep-inject')
const commonjs = require('rollup-plugin-commonjs')
const ghPages = require('gh-pages')
const { utils, logs } = require('./build/index')
const cms = require('./build/cms')

exports.vscode
