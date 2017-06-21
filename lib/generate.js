// const chalk = require('chalk')
// const logger = require('./logger')
// const async = require('async')
// const path = require('path')
const Metalsmith = require('metalsmith')

module.exports = function (conf, done) {
    var metalsmith = Metalsmith(conf.src)
    metalsmith.clean(true)
        .source('.')
        .destination(conf.dest)
        .build((err, files) => {
            done(err, files)
        })
}