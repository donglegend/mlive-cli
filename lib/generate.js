// const chalk = require('chalk')
// const logger = require('./logger')
const async = require('async')
// const path = require('path')

const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const render = require('consolidate').handlebars.render
const getOptions = require('./options')
const ask = require('./ask')

module.exports = function (conf, done) {

    var opts = getOptions(conf.name, conf.src)
    var metalsmith = Metalsmith(conf.src + '/template')

    /**
     * metalsmith.metadata() 全局插件流的一块元数据，
     * Get the global metadata. This is useful for plugins that want to set global-level metadata that can be applied to all files.
     */
    var data = Object.assign(metalsmith.metadata(), {
        destDirName: conf.name,
        inPlace: conf.dest === process.cwd(),
        noEscape: true
    })

    /**
     * 先不用 handlebars 处理模版
     */

    // 第一步，给用户选择权利 装一些 插件的机会
    metalsmith.use(askQuestions(opts.prompts))
        .use(renderTemplateFiles())

    metalsmith.clean(true)
        .source('.')
        .destination(conf.dest)
        .build((err, files) => {
            done(err, files)
            console.log(opts.completeMessage)
        })
}

/**
 * 
 * @param {中间件 询问问题} prompts 
 */
function askQuestions(prompts) {
    return function (files, metalsmith, done) {
        ask(prompts, metalsmith.metadata(), done)
    }
}

function renderTemplateFiles() {
    return function (files, metalsmith, done) {
        const keys = Object.keys(files)
        const metalsmithMetadata = metalsmith.metadata()
        async.each(keys, function (file, next) {

            let str = files[file].contents.toString()
            // 排除不需要渲染的文件
            if (!/{{([^{}]+)}}/g.test(str)) {
                return next()
            }

            render(str, metalsmithMetadata, function (err, res) {
                if (err) {
                    err.message = `[${file}] ${err.message}`
                    return next(err)
                }

                files[file].contents = new Buffer(res)
                next()
            })
        }, done)
    }
}