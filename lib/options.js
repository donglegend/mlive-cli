const path = require('path')
const exists = require('fs').existsSync
const getGitUser = require('./git-user')
// const validateName = require('validate-npm-package-name')

module.exports = function (name, dir) {
    const opts = getMetadata(dir)

    setDefault(opts, 'name', name)

    const author = getGitUser()
    if (author) {
        setDefault(opts, 'author', author)
    }
    return opts
}

/**
 * 
 * @param {获取 meta.js 数据} dir 
 */
function getMetadata(dir) {
    var js = path.join(dir, 'meta.js')
    var opts = {}
    if (exists(js)) {
        var req = require(path.resolve(js))
        if (req !== Object(req)) {
            throw new Error('meta.js needs to expose an object')
        }
        opts = req
    }
    return opts
}


function setDefault(opts, key, val) {
    const prompts = opts.prompts || (opts.prompts = {})
    if (!prompts[key] || typeof prompts[key] !== 'object') {
        prompts[key] = {
            'type': 'string',
            'default': val
        }
    } else {
        prompts[key]['default'] = val
    }
}